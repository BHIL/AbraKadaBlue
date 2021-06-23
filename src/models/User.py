from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.hybrid import hybrid_property
import json
import random

from application import db
from config.Items import INITIAL_INVENTORY
from models.Inventory import Inventory
from models.NPC import LockedNPC
from config import INVENTORY_SCORES, INITIALY_LOCKED_NPCS
from utils import TempInventory

class User(db.Model):
    class Status:
        MAP = 'map'
        WAITING_FOR_TRADER = 'waiting_for_trader'
        WAITING_FOR_BROKER = 'waiting_for_broker'
        WAITING_FOR_DUEL = 'waiting_for_duel'
        IN_DUEL = 'in_duel'

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True)
    email = Column(String)
    auth_id = Column(String)
    is_rusty = Column(Boolean)

    _status = Column(String)
    inventory_score = Column(Integer)
    duels_score = Column(Integer)
    unlocks_score = Column(Integer)

    _duel_offer = Column(String)
    duel_offer_npc = Column(String) # The arena master the challenge is offered to
    _suggested_trade = Column(String)
    suggested_trade_npc = Column(String) # The broker/trader the trade is offered to
    _duel_selected_items = Column(String)
    _last_action_result = Column(String)
    last_action_time = Column(DateTime)
    last_duel_id = Column(Integer)
    _cancel_pending = Column(Boolean)
    secret = Column(Integer)

    _inventory = relationship('Inventory')
    locked_npcs = relationship(LockedNPC, backref="user")

    lock_id = Column(Integer)
    lock_time = Column(DateTime)

    def __init__(self, username, email, auth_id, is_rusty):
        self.username = username.lower()
        self._status = User.Status.MAP
        self.email = email
        self.auth_id = auth_id
        self.is_rusty = is_rusty
        self.duel_selected_items = []
        self.inventory_score = 0
        self.duels_score = 0
        self.unlocks_score = 0
        self._cancel_pending = False
        self._inventory = [Inventory(item['item_id'], None, item['amount']) for item  in INITIAL_INVENTORY]
        self.locked_npcs = [LockedNPC(npc_id, None) for npc_id in INITIALY_LOCKED_NPCS]
        self.secret = random.randint(0, 12345678)

    def get_inventory(self):
        return TempInventory(self._inventory)

    def set_inventory(self, temp_inventory):
        """This method does not commit to the DB, it is your responisibility."""
        assert temp_inventory.is_valid(), "Invalid inventory"

        db_inventory = {i.item_id: i for i in self._inventory}
        
        # Delete all items from db that are not in the temp inventory
        for db_item_id in db_inventory:
            if db_item_id not in temp_inventory:
                db_inventory[db_item_id].amount = 0

        # Update the item amount or add item if not in temp inventory 
        for inv_item_id in temp_inventory:
            if inv_item_id in db_inventory:
                db_inventory[inv_item_id].amount = temp_inventory[inv_item_id]
            else:
                db_inventory[inv_item_id] = Inventory(inv_item_id, self.id, temp_inventory[inv_item_id])
                db.session.add(db_inventory[inv_item_id])

        self.inventory_score = sum(INVENTORY_SCORES.get(item_id, 0) for item_id in db_inventory)

    @property
    def duel_offer(self):
        if self._duel_offer:
            return json.loads(self._duel_offer)

    @duel_offer.setter
    def duel_offer(self, value):
        self._duel_offer = json.dumps(value)

    @property
    def suggested_trade(self):
        if self._suggested_trade:
            return json.loads(self._suggested_trade)

    @suggested_trade.setter
    def suggested_trade(self, value):
        self._suggested_trade = json.dumps(value)

    @property
    def duel_selected_items(self):
        if self._duel_selected_items:
            return json.loads(self._duel_selected_items)

    @duel_selected_items.setter
    def duel_selected_items(self, value):
        self._duel_selected_items = json.dumps(value)

    @property
    def last_action_result(self):
        if self._last_action_result:
            return json.loads(self._last_action_result)

    @last_action_result.setter
    def last_action_result(self, value):
        self._last_action_result = json.dumps(value)

    @hybrid_property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        self._status = value
        self._cancel_pending = False
    
    def mark_for_cancel_panding(self):
        self._cancel_pending = True

    @property
    def is_cancel_pending(self):
        return self._cancel_pending

    def __repr__(self):
        return f"<{self.__class__.__name__}(id={repr(self.id)}, username={repr(self.username)}, status={repr(self.status)})>"