import uniqId from 'uniqID';
import { consumeTypes } from '../views/base';

export default class ConsumeList {
    constructor() {
        this.list = [];
    }

    addConsume(consume) {
        this.list.push(consume);
        return consume;
    }

    deleteConsume(id) {
        const index = this.list.findIndex(el => el.id === id);
        this.list.splice(index, 1);
    }

    updateConsume(id, newLiters) {
        this.list.find(el => el.id === id).liters = newLiters;
    }
}
