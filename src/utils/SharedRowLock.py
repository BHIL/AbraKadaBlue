from models import User, Duel
from utils.Logger import Logger
from config.consts import DB_LOCK_TIMEOUT, COMMIT_LOCK_TIMEOUT

from datetime import datetime
from sqlalchemy import or_
from contextlib import contextmanager
import random


logger = Logger(__name__)

def SharedRowLock(table):
    @contextmanager
    def SharedRowLockImp(instance_or_filter, ignore_assert_locking=False):
        '''
            SharedRowLock is a shared lock per row in a given table, implented on top of the DB.

            On __enter__, will mark the row as locked in the DB if it is free / locked by expired lock.
                If didn't lock any row, will raise.

            On __exit__, will commit the changes to the DB and release the lock.
                if the exit was due to unhandled exception, it will release the lock but won't commit the rest of the changes.
                if the exit was after a timeout, it will release the lock but won't commit the rest of the changes.
        '''
        from application import db

        assert_locking = False
        if type(instance_or_filter) == table:
            assert_locking = not ignore_assert_locking
            filter = (table.id == instance_or_filter.id)
        else:
            filter = instance_or_filter
        
        lock_id = random.randint(1, 2**30)
        lock_time = datetime.utcnow()

        logger.trace('Trying to lock %s', table.__name__, filter=filter, lock_id=lock_id, lock_time=lock_time.strftime("%Y-%m-%d %H:%M:%S"))
        
        # Try to lock
        (db.session.query(table)
            .filter(filter)
            .filter(or_(table.lock_id == None, table.lock_time < lock_time - DB_LOCK_TIMEOUT)) # If the lock is free or help for over a timeout, we will try to lock it
            .update({
                'lock_id': lock_id,
                'lock_time': lock_time,
            })
        )
        db.session.commit()

        # Query the acquired locked rows
        locked_rows = (db.session.query(table)
            .filter(filter)
            .filter(table.lock_id == lock_id)
            .all())

        if assert_locking:
            assert len(locked_rows) == 1, 'Failed to lock instance'
            
        logger.trace('%s lock acquired', table.__name__, filter=filter, lock_id=lock_id, num_of_rows=len(locked_rows))

        try:
            yield locked_rows
        except:
            db.session.rollback()
            raise
        finally:
            logger.trace('Unlocking %s', table.__name__, filter=filter, lock_id=lock_id)

            now = datetime.utcnow()
            if now - lock_time > COMMIT_LOCK_TIMEOUT:
                logger.error('abort commit due to timeout', filter=filter, lock_id=lock_id, lock_time=lock_time, now=now)
                db.session.rollback()

            # Unlock rows only if we hold their lock
            (db.session.query(table)
                .filter(table.lock_id == lock_id)
                .update({'lock_id': None})
            )
            db.session.commit()

    return SharedRowLockImp


UserLock = SharedRowLock(User)
'''
    UserLock is a shared lock per user, implented on top of the DB.

    On __enter__, will mark the user as locked in the DB if it is free.
        If it is already locked, will raise.

    On __exit__, will commit the changes to the DB and release the lock.
        if the exist was due to unhandled exception, it will release the lock but won't commit the rest of the changes
'''

DuelLock = SharedRowLock(Duel)
'''
    DuelLock is a shared lock per duel, implented on top of the DB.

    On __enter__, will mark the user as locked in the DB if it is free.
        If it is already locked, will raise.

    On __exit__, will commit the changes to the DB and release the lock.
        if the exist was due to unhandled exception, it will release the lock but won't commit the rest of the changes
'''