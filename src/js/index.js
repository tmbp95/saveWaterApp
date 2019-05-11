// Global app controller
// import Search from './models/Search';
// import * as searchView from './views/searchView';
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
 * ### CONTROLLER
 **/

console.log(elements.sections);

// const menu = elements.menu;
// menu.forEach(option =>
//     option.addEventListener('click', () => {
//         console.log(option.childNodes[1].href);
//     })
// );

const toggleButton = elements.toggleButton;
const table = elements.table;
const chart = elements.chart;

const controlMenu = () => {
    const id = window.location.hash.replace('#', '');
    const sections = [...elements.sections];
    sections.forEach(section => {
        section.style.display = 'none';
    });
    let section;
    if (id) {
        console.log(id);
        console.log(sections[0].className);
        section = sections.find(section => section.className == `section-${id}`);
        console.log(section);
    } else {
        section = sections.find(section => section.className == `section-about`);
    }
    section.style.display = 'flex';

    checkCheckBoxValue();
};

const checkCheckBoxValue = () => {
    console.log(toggleButton.checked);
    if (toggleButton.checked) {
        table.style.display = 'none';
        chart.style.display = 'block';
    } else {
        table.style.display = 'block';
        chart.style.display = 'none';
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlMenu));

toggleButton.addEventListener('change', () => {
    checkCheckBoxValue();
});
