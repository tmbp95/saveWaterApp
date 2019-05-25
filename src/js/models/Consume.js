import uniqId from 'uniqID';
import { consumeTypes } from '../views/base';

export default class Consume {
    constructor(type, name, time, date) {
        this.id = uniqId(); // Random id created with uniqId lib
        this.type = type; // e.g. handsWash
        this.typeComplete = name; // e.g. hands wash
        this.time = time; // Seconds
        this.date = date; // NOW date
    }

    // Calc the consumes according to the type and time of the consume
    calcConsume() {
        // Assuming that we consume x Liters per minute of running water
        // If the consumeType is a child of 'bath' => bath: { small: value , medium: value, big: value}
        if (isNaN(consumeTypes[this.type])) {
            this.liters = consumeTypes['bath'][this.type];
        }
        // If the consumeType is a normal type => shower: value
        else {
            // If the time is not a number => time = ∞ (toiletFlush and bath have no time associated)
            if (isNaN(this.time)) {
                this.liters = consumeTypes[this.type];
            }
            // If the time has the normal value depending on the input
            else {
                // Convert the time in seconds into minutes and multiply by the amount of water per minute
                this.liters = (this.time / 60) * consumeTypes[this.type];
            }
        }
    }
}
