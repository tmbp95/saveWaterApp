import uniqId from 'uniqID';
import { consumeTypes } from '../views/base';

export default class ConsumeList {
    constructor() {
        this.list = []; // List containing all the consumptions
    }

    // Add a consume into the List
    addConsume(consume) {
        // Unshift will add the entry into the beginning of the array List
        this.list.unshift(consume);
        // Persist the data in localStorage
        this.persistData();
        return consume;
    }

    // Remove a consume from the List WHERE consume.id == id
    deleteConsume(id) {
        // Find the index of the consume
        const index = this.list.findIndex(el => el.id === id);
        // Remove the element from the List
        this.list.splice(index, 1);

        // Persist the data in localStorage
        this.persistData();
    }

    // Find the consume on the List
    findConsume(id) {
        return this.list.find(el => el.id === id);
    }

    // Update the consume on the List
    updateConsume(id, newTime) {
        const consume = this.findConsume(id);
        // Convert the received time in minutes into seconds
        newTime = newTime * 60;
        // Update the time of the consume
        consume.time = newTime;

        // If the consumeType is a child of 'bath' => bath: { small: value , medium: value, big: value}
        if (isNaN(consumeTypes[consume.type])) {
            // Update the liters of the consume
            consume.liters = consumeTypes['bath'][consume.type];
        }
        // If the time has the normal value depending on the input
        else {
            // Update the liters of the consume
            consume.liters = (newTime / 60) * consumeTypes[consume.type];
        }

        // Persist the data in localStorage
        this.persistData();
    }

    // Persist the data in localStorage
    persistData() {
        localStorage.setItem('consumeList', JSON.stringify(this.list));
    }

    // Read the data from localStorage
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('consumeList'));
        // Restoring List from the localStorage
        if (storage) this.list = storage;
    }

    /*
     * GETTERS
     */

    getTime(id) {
        // Return the time of the consume
        return this.findConsume(id).time;
    }

    getConsume(id) {
        // Return the liters of the consume
        return this.findConsume(id).liters;
    }

    getType(id) {
        // Return the type of the consume
        return this.findConsume(id).type;
    }
}
