import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    /**
     * adds an item to the list
     * @param {number} count number of units
     * @param {string} unit type of unit
     * @param {string} ingredient ingredient to add
     */
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    /**
     * removes an item from our list
     * @param {number} id id of the item to remove
     */
    deleteItem(id) {
        const index = this.items.findIndex(item => item.id === id);
        //[1,2,3] splice (1,1) -> returns [2], and array is now [1,3]
        //[1,2,3] slice (1,1) -> returns 2, and array is now [1,2,3]
        this.items.splice(index, 1);
    }

    /**
     * updates an items count in the list
     * @param {number} id id of the item to update
     * @param {number} newCount new count for that item
     */
    updateCount(id, newCount) {
        if(newCount < 0) return;
        
         this.items.find(item => item.id === id).count = newCount;
    }
}