import uniqId from 'uniqID';
import { consumeTypes } from '../views/base';

export default class Consume {
    constructor(type, time, date) {
        this.id = uniqId();
        this.type = type;
        this.time = time;
        this.date = date; // NOW date
    }

    // Calc the consumes according to the type and time of the consume
    calcConsume() {
        // Assuming that we consume x Liters per minute of running water
        this.liters = this.time * consumeTypes[this.type];
    }
}
