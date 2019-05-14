// Global app controller
import Consume from './models/Consume';

import * as consumeView from './views/consumeView';

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

const consume1 = new Consume('shower', 10, new Date('05/14/2019'));
const consume2 = new Consume('shower', 15, new Date('05/15/2019'));
const consume3 = new Consume('shower', 15, new Date('05/16/2019'));
const consume4 = new Consume('shower', 15, new Date('05/17/2019'));

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
            controlAddConsume();
            break;
        case 'manage':
            controlManage();
            break;
        default:
    }
};

/**
 * ADDCONSUME CONTROLLER
 **/
const controlAddConsume = () => {
    // Control Sidebar to check whhich is the type of consume
    const [activeItem, nameItem] = controlSidebar();

    // Render UI text about type of consume and liters per minute
    consumeView.renderTextInfo(activeItem.dataset.itemid, nameItem);

    // Control Timer to get user input
    controlTimer();
};

/**
 * SIDEBAR CONTROLLER
 **/
const controlSidebar = () => {
    // Convert Node List of node list's child nodes to an Array
    const childNodesArr = [...elements.typeConsume.childNodes];
    // Find the active item in the sidebar
    const activeItem = childNodesArr.reduce((active, child) => {
        if (child.classList && child.classList.contains('sidebar__item--active')) {
            active = child;
        }
        return active;
    }, null);

    // Depending on the active's sidebar item, create the full name type of consume
    let nameItem;
    switch (activeItem.dataset.itemid) {
        case 'shower':
            nameItem = 'Shower';
            break;
        case 'handsWash':
            nameItem = 'Hands Wash';
            break;
        case 'toiletFlush':
            nameItem = 'Toilet Flush';
            break;
        default:
            nameItem = 'Error';
    }

    // Return both activeItem and the full name of the type of consume
    return [activeItem, nameItem];
};

// Control Sidebar on Click event to change the text and the active's sidebar item
elements.typeConsume.addEventListener('click', e => {
    // Get the clicked sidebar Item
    const id = e.target.closest('.sidebar__item').dataset.itemid;

    // Depending on the clicked sidebar item, create the full name type of consume
    let nameItem;
    switch (id) {
        case 'shower':
            nameItem = 'Shower';
            break;
        case 'handsWash':
            nameItem = 'Hands Wash';
            break;
        case 'toiletFlush':
            nameItem = 'Toilet Flush';
            break;
        default:
            nameItem = 'Error';
    }

    // Convert Node List of node list's child nodes to an Array
    const childNodesArr = [...elements.typeConsume.childNodes];
    // Find the active item in the sidebar
    const activeItem = childNodesArr.reduce((active, child) => {
        if (child.classList && child.classList.contains('sidebar__item--active')) {
            active = child;
        }
        return active;
    }, null);

    // Remove current class from Sidebar item
    activeItem.classList.remove('sidebar__item--active');

    // Change the UI Sidebar item
    e.target.closest('.sidebar__item').classList.add('sidebar__item--active');

    // Render UI text about type of consume and liters per minute
    consumeView.renderTextInfo(id, nameItem);
});

/**
 * TIMER CONTROLLER
 **/
const controlTimer = () => {
    let now = new Date();
    const endtime = new Date(now.getTime() + 5000);
    console.log(now, endtime);
    while (now <= endtime) {
        now = new Date();
        console.log(now);
    }
};

elements.timer.addEventListener('click', controlTimer);

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
    consumeView.renderChart(arrWeek);
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

    // Render the WaterAnimation with the calculated percentage
    consumeView.renderWaterAnimation(percentage);
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
