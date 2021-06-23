from sqlalchemy import Column, Integer, ForeignKey

from application import db


class Inventory(db.Model):
    __tablename__ = 'inventories'

    item_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    amount = Column(Integer)
    
    def __init__(self, item_id, user_id, amount):
        self.item_id = item_id
        self.user_id = user_id
        self.amount = amount

    def __repr__(self):
        return f"<{self.__class__.__name__}(item_id={repr(self.item_id)}, user_id={repr(self.user_id)}, amount={repr(self.amount)})>"