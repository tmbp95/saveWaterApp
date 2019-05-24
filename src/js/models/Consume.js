import uniqId from 'uniqID';
import { consumeTypes } from '../views/base';

export default class Consume {
    constructor(type, name, time, date) {
        this.id = uniqId();
        this.type = type;
        this.typeComplete = name;
        this.time = time;
        this.date = date; // NOW date
    }

    // Calc the consumes according to the type and time of the consume
    calcConsume() {
        // Assuming that we consume x Liters per minute of running water
        if (isNaN(consumeTypes[this.type])) {
            this.liters = consumeTypes['bath'][this.type];
        } else {
            if (isNaN(this.time)) {
                this.liters = consumeTypes[this.type];
            } else {
                this.liters = (this.time / 60) * consumeTypes[this.type];
            }
        }
    }
}
