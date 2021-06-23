export default class Backend {
    static get_state() {
        return $.get('/api/get_state');
    }

    static get_suggested_trades(npc) {
        return $.get('/api/get_suggested_trades', {npc});
    }

    static get_challenges(npc) {
        return $.get('/api/get_challenges', {npc});
    }

    static suggest_trade(trade) {
        return $.post('/api/suggest_trade', trade);
    }

    static suggest_duel(duel) {
        return $.post('/api/suggest_duel', duel);
    }

    static cancel_pending() {
        return $.post('/api/cancel_pending');
    }

    static reset_inventory() {
        return $.post('/api/reset_inventory');
    }

    static unlock_npc(npc_id) {
        return $.post('/api/unlock_npc', {npc_id});
    }

    static select_duel_items(items) {
        return $.post('/api/select_duel_items', items);
    }
}