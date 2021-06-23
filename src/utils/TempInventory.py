from config.Items import items_by_id, MAX_INVENTORY_SIZE

class TempInventory:
    def __init__(self, inventory):
        self._inventory = {}
        for i in inventory:
            amount = i.amount if hasattr(i, 'amount') else i['amount']
            item_id = i.item_id if hasattr(i, 'item_id') else i['item_id']
            if amount > 0:
                self._inventory[item_id] = amount
    
    def __getitem__(self, item_id):
        return self._inventory.get(item_id, 0)
    
    def __setitem__(self, item_id, amount):
        if amount <= 0:
            if item_id in self._inventory:
                self._inventory.pop(item_id)
        else:
            self._inventory[item_id] = amount

    def __iter__(self):
        return iter(self._inventory)

    def __contains__(self, i):
        return i in self._inventory

    def contains(self, items):
        return all(i in self._inventory for i in items)

    def items(self):
        return self._inventory.items()

    def is_valid(self):
        if len(self._inventory) > MAX_INVENTORY_SIZE:
            return False

        for i in self._inventory:
            if i not in items_by_id:
                return False
            if self._inventory[i] <= 0 or 100 <= self._inventory[i]:
                return False
        
        return True
