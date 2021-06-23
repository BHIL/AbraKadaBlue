from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from application import db


class LockedNPC(db.Model):
    __tablename__ = 'locked_npcs'

    npc_id = Column(String(10), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    
    def __init__(self, npc_id, user_id):
        self.npc_id = npc_id
        self.user_id = user_id

    def __repr__(self):
        return f"<{self.__class__.__name__}(npc_id={repr(self.npc_id)}, user_id={repr(self.user_id)})>"