// Global app controller
// import Search from './models/Search';
// import * as searchView from './views/searchView';
import Consume from './models/Consume';

import * as consumeView from './views/consumeView';
import * as chartView from './views/chartView';

import { elements, renderLoader, clearLoader } from './views/base';

import '../sass/main.scss';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * MENU CONTROLLER
 **/
const controlMenu = () => {
    let section;
    // Get menuOption from url
    const menuOption = window.location.hash.replace('#', '') || 'about';
    // Get all sections available (about, addConsume, manage)
    const sections = [...elements.sections];

    // Hide all sections on UI
    sections.forEach(section => (section.style.display = 'none'));

    // Find section with the same name as the menuOption
    section = sections.find(section => section.className == `section-${menuOption}`);

    // Show section on UI
    section.style.display = 'flex';
    // Control Section
    controlSection(menuOption);
};

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
    // Get value from checkbox to understand what should it render (table, chart)
    const showElement = checkBoxValue(elements.toggleButton);

    // Depending on the showElement value control Table or Chart
    if (showElement === 'table') controlTable();
    else if (showElement === 'chart') controlChart();

    controlWaterPercentage();
};

const checkBoxValue = cb => {
    return cb.checked ? 'chart' : 'table';
};

// REPEATEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
elements.toggleButton.addEventListener('change', () => {
    const showElement = checkBoxValue(elements.toggleButton);

    // Depending on the showElement value control Table or Chart
    if (showElement === 'table') controlTable();
    else if (showElement === 'chart') controlChart();
});

// const consumeObj = {
//     type: 'shower',
//     time: 10,
//     date: new Date()
// };
const consume1 = new Consume('shower', 15, new Date('05/06/2019'));
const consume2 = new Consume('handsWash', 1, new Date('05/07/2019'));
const consume3 = new Consume('shower', 15, new Date('05/08/2019'));
const consume4 = new Consume('shower', 10, new Date('05/13/2019'));

consume1.calcConsume();
consume2.calcConsume();
consume3.calcConsume();
consume4.calcConsume();

state.consumes = [consume1, consume2, consume3, consume4];

const controlTable = () => {
    console.log('table');

    elements.table.style.display = 'block';
    elements.chart.style.display = 'none';

    // Prepare UI for changes
    consumeView.clearConsumesTable();
    // Render consumes to table
    consumeView.renderConsumesTable(state.consumes);
};

const controlChart = () => {
    console.log('chart');

    elements.table.style.display = 'none';
    elements.chart.style.display = 'block';

    const weekAmount = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0
    };

    state.consumes.forEach(consume => {
        consume.findWeekDay();
    });

    const counterObj = state.consumes
        .map(consume => consume.weekDay)
        .reduce((counter, consumeWeekDay, cur) => {
            counter[consumeWeekDay] = counter[consumeWeekDay] + state.consumes[cur].liters;
            return counter;
        }, weekAmount);

    const transformedArr = [];
    Object.keys(counterObj).map(igKey => {
        transformedArr.push(counterObj[igKey]);
    });

    chartView.renderChart(transformedArr);
};

const controlWaterPercentage = () => {
    const weekAmount = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0
    };

    state.consumes.forEach(consume => {
        consume.findWeekDay();
    });

    const counterObj = state.consumes
        .map(consume => consume.weekDay)
        .reduce((counter, consumeWeekDay, cur) => {
            counter[consumeWeekDay] = counter[consumeWeekDay] + state.consumes[cur].liters;
            return counter;
        }, weekAmount);
    console.log(counterObj);

    // Object.keys(counterObj).reduce(igKey => {
    //     transformedArr.push(counterObj[igKey]);
    // });

    const averageDay = 300;
    const todaysConsume = 200;
    const percentage = (todaysConsume / averageDay) * 100;

    const textPercentage = [...elements.waterAnimationBig.childNodes][1];
    const bottomPosition = (percentage.toFixed(0) * 45) / 50;
    textPercentage.style.bottom = `${bottomPosition}%`;

    const percentageDOM = [...elements.waterAnimationBig.childNodes][1].firstChild;
    percentageDOM.textContent = percentage.toFixed(0);

    const wavesDOM = [...elements.waterAnimationBig.childNodes].filter(elm => (elm.classList ? elm.classList.contains('wave') : null));
    const modifiedPercentage = 100 - percentage.toFixed(0);

    wavesDOM.forEach(wave => (wave.style.bottom = `-${modifiedPercentage.toFixed(0)}%`));
};
