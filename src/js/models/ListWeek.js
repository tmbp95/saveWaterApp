export default class ListWeek {
    constructor() {
        this.obj = {};
    }

    addItem(count, unit, ingredient) {
        const weekDay = {
            id: uniqId(),
            count,
            unit,
            ingredient
        };
        this.arr.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.arr.findIndex(el => el.id === id);
        // [2,4,8] splice(1,1) => return 4, original array is [2,8]
        // [2,4,8] slice(1,1) => return 4, original array is [2,4,8]
        this.arr.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.arr.find(el => el.id === id).count = newCount;
    }
}
