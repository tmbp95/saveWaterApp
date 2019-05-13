import uniqId from 'uniqID';

export default class Consume {
    constructor(type, time, date) {
        this.id = uniqId();
        this.type = type;
        this.time = time;
        this.date = date; // NOW date
    }

    calcConsume() {
        // Assuming that we consume x Liters per minute of running water
        switch (this.type) {
            case 'shower':
                this.liters = this.time * 12;
                break;
            case 'handsWash':
                this.liters = this.time * 5;
                break;
            default:
                this.liters = 0;
        }
    }

    findWeekDay() {
        const dayOfWeek = this.date.getDay();
        this.weekDay = isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    }
}
