from routes.login import loggedInOnly, apiErrorWrapper

from application import app, db
from models import User, Duel
from workers import BrokerWorker, DuelMatchmakerWorker, GameEngineWorker, TraderWorker
from config import NPCs, NPC, INITIAL_INVENTORY, INITIAL_INVENTORY_AFTER_TUTORIAL, UNLOCK_SCORES, TUTORIAL_UNLOCK, items_by_id
from config.consts import TIME_TO_CHECK_TICK
from utils import Logger, TempInventory
from utils.SharedRowLock import UserLock

from flask import jsonify, request, g
import json
from jsonschema import validate

logger = Logger(__name__)


def render_user_state(user):
    user_inv = user.get_inventory()
    state = {
        'status': user.status,
        'inventory': [{'item_id': i, 'amount': a} for i, a in user_inv.items()],
        'locked_npcs': [npc.npc_id for npc in user.locked_npcs],
        'score': user.inventory_score + user.duels_score + user.unlocks_score,
        'is_rusty': user.is_rusty,
    }

    if user.status == User.Status.WAITING_FOR_DUEL:
        state['duel_offer'] = user.duel_offer
        state['duel_npc'] = user.duel_offer_npc
        state['cancel_pending'] = user.is_cancel_pending
        state['ttt'] = TIME_TO_CHECK_TICK.total_seconds() * 1000
    
    if user.status in (User.Status.WAITING_FOR_BROKER, User.Status.WAITING_FOR_TRADER):
        state['suggested_trade'] = user.suggested_trade
        state['trade_npc'] = user.suggested_trade_npc
        state['cancel_pending'] = user.is_cancel_pending
        state['ttt'] = TIME_TO_CHECK_TICK.total_seconds() * 1000

    # If we are in a duel or just finished one
    if user.status == User.Status.IN_DUEL or (user.status == User.Status.MAP and user.last_action_result and 'is_winner' in user.last_action_result):
        if user.status == User.Status.IN_DUEL:
            duel = Duel.get_active_duel(user.id)
            state['ttt'] = TIME_TO_CHECK_TICK.total_seconds() * 1000
        else:
            duel = Duel.query.get(user.last_duel_id)

        if duel:
            state['duel_state'] = duel.state
            state['duel_selected_items'] = user.duel_selected_items
            if duel.npc_id:
                state['duel_player'] = 'player'
                state['opponent_character'] = duel.npc_id
            elif duel.player1_id == user.id:
                state['duel_player'] = 'player1'
            else:
                state['duel_player'] = 'player2'

    if user.status == User.Status.MAP:
        state['last_action_result'] = user.last_action_result

    return state


@app.route('/api/get_state')
@loggedInOnly
@apiErrorWrapper
def api_get_state():
    return jsonify(render_user_state(g.user))

 
@app.route('/api/get_suggested_trades')
@loggedInOnly
@apiErrorWrapper
def api_get_suggested_trades():
    assert 'npc' in request.args

    # TODO: expose in the GUI

    offers = (User.query
                 .filter(User.status == User.Status.WAITING_FOR_BROKER)
                 .filter(User.suggested_trade_npc == request.args['npc'])
                 .all())

    return jsonify([
        o.suggested_trade for o in offers
    ])


@app.route('/api/get_challenges')
@loggedInOnly
@apiErrorWrapper
def api_get_challenges():
    assert 'npc' in request.args

    # TODO: expose in the GUI

    assert NPCs[request.args['npc']].allow_human_duels

    challenges = (User.query
                     .filter(User.status == User.Status.WAITING_FOR_DUEL)
                     .filter(User.duel_offer_npc == request.args['npc'])
                     .all())

    return jsonify([
        c.duel_offer for c in challenges
    ])


TRADE_DNF_SCHEMA = {
    # DNF
    'type': 'array',
    'maxItems': 10,
    'minItems': 1,
    'items': {
        # DNF group
        'type': 'array', 
        'minItems': 1,
        'maxItems': 10,
        'items': {
            'type': 'object', 
            'properties': {
                'item_id': {
                    "type": "integer"
                },
                'quantity': { 
                    "type" : "integer",
                    "minimum": 1,
                    "maximum": 100,
                },
            }
        }
    }
}
TRADE_SCHEMA = {
    'type': 'object', 
    'properties': {
        'desires': TRADE_DNF_SCHEMA,
        'offers': TRADE_DNF_SCHEMA,
    }
}

@app.route('/api/suggest_trade', methods=['POST'])
@loggedInOnly
@apiErrorWrapper
def api_suggest_trade():
    assert 'trade' in request.form
    assert 'npc' in request.form

    trade = json.loads(request.form['trade'])
    validate(trade, schema=TRADE_SCHEMA)

    npc_id = request.form['npc']

    assert all(npc_id != locked_npc.npc_id for locked_npc in g.user.locked_npcs), "It's easier to unlock it first"

    npc = NPCs[npc_id]

    assert npc.kind in (NPC.Kind.BROKER, NPC.Kind.TRADER), 'Excuse me?'

    # assert all items are permitted with this npc
    total_items = {i['item_id'] for key in ('offers', 'desires') for t in trade[key] for i in t}
    assert total_items.issubset(set(npc.permitted_items)), 'Do not try to trick me!'
    
    with UserLock(g.user):
        assert g.user.status == User.Status.MAP, 'The user is not in the map'

        g.user.status = User.Status.WAITING_FOR_BROKER if npc.kind == NPC.Kind.BROKER else User.Status.WAITING_FOR_TRADER
        g.user.suggested_trade = trade
        g.user.suggested_trade_npc = npc_id
    
    return jsonify(render_user_state(g.user))


@app.route('/api/suggest_duel', methods=['POST'])
@loggedInOnly
@apiErrorWrapper
def api_suggest_duel():
    assert 'risked_item' in request.form
    assert 'desired_item' in request.form
    assert 'npc' in request.form

    risked_item = int(request.form['risked_item'])
    desired_item = int(request.form['desired_item'])
    npc_id = request.form['npc']

    npc = NPCs[npc_id]
    assert npc.kind == NPC.Kind.ARENA_MASTER, 'Excuse me?'

    assert all(npc_id != locked_npc.npc_id for locked_npc in g.user.locked_npcs), 'Trying to challange a locked arena_master'

    assert {risked_item, desired_item}.issubset(set(npc.permitted_items)), 'Do not try to trick me!'
    
    with UserLock(g.user):
        assert g.user.status == User.Status.MAP, 'The user is not in the map'

        # Validate the risked item is in the inventory
        assert risked_item in g.user.get_inventory(), 'Risked item is not in the inventory'

        g.user.status = User.Status.WAITING_FOR_DUEL
        g.user.duel_offer = {
            'risked_item': risked_item, 
            'desired_item': desired_item,
        }
        g.user.duel_offer_npc = npc.id
    
    return jsonify(render_user_state(g.user))


@app.route('/api/cancel_pending', methods=['POST'])
@loggedInOnly
@apiErrorWrapper
def api_cancel_pending():
    with UserLock(g.user, ignore_assert_locking=True) as locked_users:
        # If we locked the user, cancel the pending request
        if len(locked_users) == 1:
            # If we have something to cancel
            if g.user.status != User.Status.MAP:
                assert g.user.status in (User.Status.WAITING_FOR_BROKER, User.Status.WAITING_FOR_TRADER, User.Status.WAITING_FOR_DUEL), 'The user has nothing to cancel'
                g.user.status = User.Status.MAP
        else:
            # The user is locked by another. Just mark the user action as canceled for next time someone will try to execute the pending action
            g.user.mark_for_cancel_panding()

    return jsonify(render_user_state(g.user))

@app.route('/api/reset_inventory', methods=['POST'])
@loggedInOnly
@apiErrorWrapper
def reset_inventory():
    with UserLock(g.user):
        assert g.user.status == User.Status.MAP, 'The user is not in the map'

        is_in_tutorial = any(TUTORIAL_UNLOCK == locked_npc.npc_id for locked_npc in g.user.locked_npcs)
        if is_in_tutorial:
            g.user.set_inventory(TempInventory(INITIAL_INVENTORY))
        else:
            g.user.set_inventory(TempInventory(INITIAL_INVENTORY_AFTER_TUTORIAL))

    return jsonify(render_user_state(g.user))


@app.route('/api/unlock_npc', methods=['POST'])
@loggedInOnly
@apiErrorWrapper
def api_unlock_npc():
    assert 'npc_id' in request.form

    npc_id = request.form['npc_id']

    assert npc_id in NPCs, 'NPC not found'
    assert NPCs[npc_id].unlock_price is not None, 'NPC need no unlock'

    unlock_price = NPCs[npc_id].unlock_price

    with UserLock(g.user):
        assert g.user.status == User.Status.MAP, 'The user is not in the map'

        # Pay the price for unlocking
        user_inv = g.user.get_inventory()
        
        assert user_inv[unlock_price] > 0, 'Price can not be paid'
        user_inv[unlock_price] -= 1

        for npc in g.user.locked_npcs:
            if npc.npc_id == npc_id:
                db.session.delete(npc)
                break
        else:
            assert False, 'nothing to unlock'

        # If the player completed the tutorial, reset the inventory to the initial one
        if npc_id == TUTORIAL_UNLOCK:
            user_inv = TempInventory(INITIAL_INVENTORY_AFTER_TUTORIAL)

        g.user.unlocks_score += UNLOCK_SCORES[npc_id]
        g.user.set_inventory(user_inv)

    return jsonify(render_user_state(g.user))


@app.route('/api/select_duel_items', methods=['POST'])
@loggedInOnly
@apiErrorWrapper
def api_select_duel_items():
    assert 'items' in request.form

    items = json.loads(request.form['items'])
    assert len(items) > 0 and len(items) <= 3 and len(set(items)) == len(items) and all(item_id in items_by_id for item_id in items), 'Bad format'

    with UserLock(g.user):
        assert g.user.status == User.Status.IN_DUEL, 'The user is not in a duel'

        g.user.duel_selected_items = items
    
    return jsonify(render_user_state(g.user))


@app.route('/api/tick')
@loggedInOnly
def api_tick():
    logger.trace('tick start')

    # NOTE: in production the tick is execxuted in workers

    try:
        GameEngineWorker.tick()
    except:
        logger.exception('GameEngineWorker.tick failed')

    try:
        DuelMatchmakerWorker.tick()
    except:
        logger.exception('DuelMatchmakerWorker.tick failed')

    try:
        BrokerWorker.tick()
    except:
        logger.exception('BrokerWorker.tick failed')

    try:
        TraderWorker.tick()
    except:
        logger.exception('TraderWorker.tick failed')

    logger.trace('tick done')
    db.session.commit()
    return 'ticked'
