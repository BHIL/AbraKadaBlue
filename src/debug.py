#!/usr/bin/env python
import os
import sys
from application import app, db
from models import User
from config import INITIALY_LOCKED_NPCS, TUTORIAL_UNLOCK
import routes
from config import NPCs, Items, INITIAL_INVENTORY
from utils.TempInventory import TempInventory


class MOCK_MODE:
    DUEL_OFFER_U1_D6 = 'DUEL_OFFER_U1_D6'
    TRADE_OFFER_U1_T4 = 'TRADE_OFFER_U1_T1'
    TUTORIAL = 'TUTORIAL'
    INVENTORY_FOR_UNLOCKS = 'INVENTORY_FOR_UNLOCKS'
    NONE = 'NONE'
    TROLOLO = 'TROLOLO'

MODE = MOCK_MODE.TUTORIAL


def create_mock_db():
    db.drop_all()
    db.create_all()

    session = db.session

    if MODE != MOCK_MODE.TUTORIAL:
        INITIALY_LOCKED_NPCS.remove(TUTORIAL_UNLOCK)

    if MODE == MOCK_MODE.INVENTORY_FOR_UNLOCKS:
        INITIAL_INVENTORY.clear()
        for npc in NPCs.values():
            if npc.unlock_price and npc.id != TUTORIAL_UNLOCK:
                INITIAL_INVENTORY.append({'item_id': npc.unlock_price, 'amount': 1})

    if MODE == MOCK_MODE.TRADE_OFFER_U1_T4:
        INITIAL_INVENTORY.clear()
        INITIAL_INVENTORY.append({'item_id': Items.SnoozeBest.id, 'amount': 9})


    u1 = User('user1', 'user1@mock.db', 'FackAuthID1', False)
    u2 = User('user2', 'user2@mock.db', 'FackAuthID2', True)
    u3 = User('user3', 'user3@mock.db', 'FackAuthID3', True)
    u4 = User('user4', 'user4@mock.db', 'FackAuthID4', True)
    u5 = User('user5', 'user5@mock.db', 'FackAuthID5', True)
    session.add(u1)
    session.add(u2)
    session.add(u3)
    session.add(u4)
    session.add(u5)

    session.commit()

    # user 1
    u1.set_inventory(TempInventory(INITIAL_INVENTORY))
    
    # user 2
    u2.set_inventory(TempInventory([
        {'item_id': Items.NastyNoodles.id, 'amount': 2},
        {'item_id': Items.TonyStank.id, 'amount': 3},
        {'item_id': Items.SugarCrush.id, 'amount': 5},
        {'item_id': Items.Flashfunk.id, 'amount': 7},
        {'item_id': Items.SnoozeBest.id, 'amount': 11},
    ]))

    # user 3
    u3.set_inventory(TempInventory([
        {'item_id': Items.TeleFart.id, 'amount': 1},
    ]))

    session.commit()

    if MODE == MOCK_MODE.TROLOLO:
        # Set the inventory with the some items
        u1.set_inventory(TempInventory([
            # TODO select items
            {'item_id': Items.TeleFart.id, 'amount': 30},
            {'item_id': Items.TonyStank.id, 'amount': 30},
            {'item_id': Items.Grooviton.id, 'amount': 30},
            {'item_id': Items.Flashfunk.id, 'amount': 30},
            {'item_id': Items.HonkHonk.id, 'amount': 30},
        ]))

        # Unlock the arena master of Trololo
        INITIALY_LOCKED_NPCS.remove(NPCs['D13'].front)

        u1.status = User.Status.WAITING_FOR_DUEL
        u1.duel_offer = {
            'risked_item': Items.SlitheringSoup.id, 
            'desired_item': Items.HolyMoly.id,
        }
        u1.duel_offer_npc = NPCs['D13'].front
        INITIALY_LOCKED_NPCS.remove(NPCs['D13'].front)

    # Create mock duel offer with npc (D6)
    if MODE == MOCK_MODE.DUEL_OFFER_U1_D6:
        u1.status = User.Status.WAITING_FOR_DUEL
        u1.duel_offer = {
            'risked_item': Items.TonyStank.id, 
            'desired_item': Items.FoxyBoxy.id,
        }
        u1.duel_offer_npc = NPCs['D6'].front

    # Create mock trade offer to trader
    if MODE == MOCK_MODE.TRADE_OFFER_U1_T4:
        u1.status = User.Status.WAITING_FOR_TRADER
        u1.suggested_trade = {
            'offers': [
                [
                    {'item_id': Items.SnoozeBest.id, 'quantity': 2},
                ]
            ],
            'desires': [
                [
                    {'item_id': Items.SnoozeBest.id, 'quantity': 1},
                ]
            ],
        }
        u1.suggested_trade_npc = NPCs['T4'].id
    
    session.commit()

if __name__ == "__main__":
    create_mock_db()
    app.run(port=int(os.getenv('PORT', 5000)), host=os.getenv('IP', '0.0.0.0'), debug=('debugger' not in sys.argv))
    