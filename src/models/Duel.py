from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import json
from datetime import datetime

from models import User
from application import db


class Duel(db.Model):
    class Status:
        ACTIVE = 'active'
        FIRST_PLAYER_WINS = 'first_player_wins'
        SECOND_PLAYER_WINS = 'second_player_wins'
        FAILED = 'failed'

    __tablename__ = 'duels'

    id = Column(Integer, primary_key=True)
    player1_id = Column(Integer, ForeignKey(User.id))
    player2_id = Column(Integer, ForeignKey(User.id))
    npc_id = Column(String)

    status = Column(String)

    _state = Column(String)

    lock_id = Column(Integer)
    lock_time = Column(DateTime)

    last_turn_time = Column(DateTime)
    
    def __init__(self, initial_state, player1_id, player2_id=None, npc_id=None):
        self.player1_id = player1_id
        self.player2_id = player2_id
        self.npc_id = npc_id
        self.status = Duel.Status.ACTIVE
        self.last_turn_time = datetime.utcnow()

        self.state = initial_state

    @property
    def state(self):
        return json.loads(self._state)

    @state.setter
    def state(self, value):
        self._state = json.dumps(value)

    @classmethod
    def get_active_duel(cls, player_id):
        return cls.query.filter(cls.status == cls.Status.ACTIVE).filter((cls.player1_id == player_id) | (cls.player2_id == player_id)).one()

    def __repr__(self):
        return f"<{self.__class__.__name__}(player1_id={repr(self.player1_id)}, player2_id={repr(self.player2_id)}, status={repr(self.status)})>"