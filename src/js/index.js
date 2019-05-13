// Global app controller
import Consume from './models/Consume';
import ListWeek from './models/ListWeek';

import * as consumeView from './views/consumeView';
import * as chartView from './views/chartView';

import { elements, renderLoader, clearLoader } from './views/base';
import '../sass/main.scss';

/** Global state of the app
 * - Consume object
 * - ListWeek object
 */
const state = {};

// const consumeObj = {
//     type: 'shower',
//     time: 10,
//     date: new Date()
// };

// const weekAmount = {
//     Monday: 0,
//     Tuesday: 0,
//     Wednesday: 0,
//     Thursday: 0,
//     Friday: 0,
//     Saturday: 0,
//     Sunday: 0
// };

const consume1 = new Consume('shower', 10, new Date('05/13/2019'));
const consume2 = new Consume('shower', 15, new Date('05/14/2019'));
const consume3 = new Consume('shower', 15, new Date('05/15/2019'));
const consume4 = new Consume('shower', 15, new Date('05/16/2019'));

consume1.calcConsume();
consume2.calcConsume();
consume3.calcConsume();
consume4.calcConsume();

state.consumes = [consume1, consume2, consume3, consume4];

/**
 * MENU CONTROLLER
 **/
const controlMenu = () => {
    // Get menuOption from url
    const menuOption = window.location.hash.replace('#', '') || 'about';
    // Get all sections available (about, addConsume, manage)
    const sections = [...elements.sections];

    // Hide all sections on UI
    sections.forEach(section => (section.style.display = 'none'));

    // Find section with the same name as the menuOption
    const section = sections.find(section => section.className == `section-${menuOption}`);

    // Show section on UI
    section.style.display = 'flex';

    // Control Section
    controlSection(menuOption);
};
// The Beginning of the Controllers
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlMenu));

/**
 * SECTION CONTROLLER
 **/
const controlSection = menuOption => {
    switch (menuOption) {
        case 'about':
            // controlAbout();
            break;
        case 'addConsume':
            // controlAddConsume();
            break;
        case 'manage':
            controlManage();
            break;
        default:
    }
};

/**
 * MANAGE CONTROLLER
 **/
const controlManage = () => {
    // Control Toggle to check whether to show Table or Chart
    controlToggle();

    // Control WaterPercentage Animation
    controlWaterPercentage();
};

/**
 * TOGGLE CONTROLLER
 **/
const controlToggle = () => {
    // Get value from checkbox to understand what should it render (table, chart)
    const showElement = elements.toggleButton.checked ? 'chart' : 'table';

    // Depending on the showElement value control Table or Chart
    if (showElement === 'table') controlTable();
    else if (showElement === 'chart') controlChart();
};

// Control Toggle on CHANGE to check whether to show Table or Chart
elements.toggleButton.addEventListener('change', () => {
    controlToggle();
});

/**
 * TABLE CONTROLLER
 **/
const controlTable = () => {
    // Prepare UI for changes
    elements.table.style.display = 'block';
    elements.chart.style.display = 'none';

    // Clear Table Content
    consumeView.clearConsumesTable();

    // Render consumes to table
    consumeView.renderConsumesTable(state.consumes);
};

/**
 * CHART CONTROLLER
 **/
const controlChart = () => {
    // Prepare UI for changes
    elements.table.style.display = 'none';
    elements.chart.style.display = 'block';

    // Create ListWeek to convert the Consumes State into an array of liters per week day
    const [_, arrWeek] = createWeekStruct();

    // Render the Chart with the array of liter per week day
    chartView.renderChart(arrWeek);
};

/**
 * WATER_PERCENTAGE_ANIMATION CONTROLLER
 **/
const controlWaterPercentage = () => {
    // Create ObjWeek to convert the Consumes State into an object -> keys = week day, values = liters
    const [objWeek, _] = createWeekStruct();

    // Add each consume date converted to full date, from state.consumes to an array
    const fullDateArr = state.consumes.map(consume => convertToFullDate(consume.date));
    // Get Full Date from today's date
    const todayDate = convertToFullDate(new Date());

    // Calculate today's consume
    const todaysConsume = fullDateArr.reduce((counter, date, index) => {
        if (date == todayDate) {
            // console.log(index - 1);
            counter += state.consumes[index].liters;
        }
        return counter;
    }, 0);

    // Set numDays = 0, as it will be used to count the number of week days without 0 as value
    let numDays = 0;
    // Calculate average of week's consume
    const averageDay =
        Object.keys(objWeek).reduce((total, key) => {
            // If the value from the week day is different from 0 then increment the total and the number of days
            if (objWeek[key] != 0) {
                total += objWeek[key];
                ++numDays;
            }
            return total;
        }, 0) / numDays;

    // Calculate the percentage from today's usage compared to week's average consume.
    const percentage = (todaysConsume / averageDay) * 100;

    // Update the (percentage) text's position using the Bottom property
    const textPercentage = [...elements.waterAnimationBig.childNodes][1];
    const bottomPosition = (percentage.toFixed(0) * 45) / 50;
    textPercentage.style.bottom = `${bottomPosition}%`;

    //////////////////////////////////////////////////////////////////////////////
    // TODO: IF THE BOTTOMPOSITION IS TO BIG, IT WILL GET HIDDEN BY THE OVERFLOW
    //////////////////////////////////////////////////////////////////////////////

    // Update the percentage text to the respective value
    const percentageDOM = [...elements.waterAnimationBig.childNodes][1].firstChild;
    percentageDOM.textContent = percentage.toFixed(0);

    // Update the waves DOMs positions usign the Bottom property
    const wavesDOM = [...elements.waterAnimationBig.childNodes].filter(elm => (elm.classList ? elm.classList.contains('wave') : null));
    const modifiedPercentage = 100 - percentage.toFixed(0);

    wavesDOM.forEach(wave => (wave.style.bottom = `-${modifiedPercentage.toFixed(0)}%`));

    //////////////////////////////////////////////////////////////////////////////
    // TODO: IF THE BOTTOMPOSITION IS TO BIG, IT WILL GET HIDDEN BY THE OVERFLOW
    //////////////////////////////////////////////////////////////////////////////
};

// Create Week Strucute, can be an Object or an Array
const createWeekStruct = () => {
    // Set the default weekAmount object pointing each week day to 0 liters
    const weekAmount = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0
    };

    // For each consume entry, update the weekAmount Object using the consumed liters per week day
    const objWeek = state.consumes
        .map(consume => findWeekDay(consume.date))
        .reduce((counter, consumeWeekDay, cur) => {
            counter[consumeWeekDay] = counter[consumeWeekDay] + state.consumes[cur].liters;
            return counter;
        }, weekAmount);

    //////////////////////////////////////////////////////////////////////////////
    // TODO: STILL COUNTING EVEN IF THE CONSUME WAS FROM PAST WEEK
    //////////////////////////////////////////////////////////////////////////////

    // For each objWeek key, create an array containing the consumed liters
    const arrWeek = [];
    Object.keys(objWeek).map(igKey => {
        arrWeek.push(objWeek[igKey]);
    });

    // Return both object and array Week consumed liters
    return [objWeek, arrWeek];
};

// Find the week day from date
const findWeekDay = date => {
    const dayOfWeek = date.getDay();
    const weekDay = isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    return weekDay;
};

// Pick any date and convert it to the format yyyy-mm-dd
const convertToFullDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const fullDate = `${year}-${month}-${day}`;
    return fullDate;
};
