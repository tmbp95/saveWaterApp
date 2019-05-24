import uniqId from 'uniqID';
import { consumeTypes } from '../views/base';

export default class ConsumeList {
    constructor() {
        this.list = [];
    }

    addConsume(consume) {
        this.list.unshift(consume);
        return consume;
    }

    deleteConsume(id) {
        const index = this.list.findIndex(el => el.id === id);
        this.list.splice(index, 1);
    }

    getTime(id) {
        const elm = this.list.find(el => el.id === id);
        return elm.time;
    }

    getConsume(id) {
        const elm = this.list.find(el => el.id === id);
        return elm.liters;
    }

    getType(id) {
        const elm = this.list.find(el => el.id === id);
        return elm.type;
    }

    updateConsume(id, newTime) {
        const elm = this.list.find(el => el.id === id);
        newTime = newTime * 60;
        elm.time = newTime;
        elm.liters = (newTime / 60) * consumeTypes[elm.type];
        if (isNaN(consumeTypes[elm.type])) {
            elm.liters = consumeTypes['bath'][elm.type];
        } else {
            elm.liters = (newTime / 60) * consumeTypes[elm.type];
        }
    }
}
