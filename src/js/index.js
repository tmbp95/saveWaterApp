// Global app controller
import Consume from './models/Consume';
import ConsumeList from './models/ConsumeList';

import * as consumeView from './views/consumeView';

import { elements, consumeTypes, resPerPage } from './views/base';
import '../sass/main.scss';

/** Global state of the app
 * - Consume object
 * - ListConsume objec
 * - Time object
 */
const state = {
    bathTub: 'medium'
};

// const consumeObj = {
//     type: 'shower',
//     time: 10,
//     date: new Date()
// };

/**
 * INITIAL VALUES JUST FOR TESTING THE APP
 **/

const storage = JSON.parse(localStorage.getItem('consumeList'));
if (!storage) {
    if (!state.consumes) state.consumes = new ConsumeList();
    const date1 = new Date();
    date1.setDate(date1.getDate() - 4);

    const date2 = new Date();
    date2.setDate(date2.getDate() - 3);

    const date3 = new Date();
    date3.setDate(date3.getDate() - 2);

    const date4 = new Date();
    date4.setDate(date4.getDate() - 1);

    const consume1 = new Consume('shower', 'Shower', 650, date1);
    const consume2 = new Consume('shower', 'Shower', 600, date2);
    const consume3 = new Consume('shower', 'Shower', 500, date3);
    const consume4 = new Consume('shower', 'Shower', 550, date4);
    const consume5 = new Consume('handsWash', 'Hands Wash', 20, new Date());
    consume1.calcConsume();
    consume2.calcConsume();
    consume3.calcConsume();
    consume4.calcConsume();
    consume5.calcConsume();
    state.consumes.addConsume(consume1);
    state.consumes.addConsume(consume2);
    state.consumes.addConsume(consume3);
    state.consumes.addConsume(consume4);
    state.consumes.addConsume(consume5);
}

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
['hashchange', 'load'].forEach(event => {
    window.addEventListener(event, controlMenu);
    if (!state.consumes) state.consumes = new ConsumeList();

    // Restore consumes from LocalStorage
    state.consumes.readStorage();
});

/**
 * SECTION CONTROLLER
 **/
const controlSection = menuOption => {
    switch (menuOption) {
        case 'about':
            controlAbout();
            break;
        case 'addConsume':
            controlAddConsume();
            break;
        case 'manage':
            controlManage();
            break;
    }
};

/**
 * ABOUT CONTROLLER
 **/
const controlAbout = () => {
    // Remove Shadow from the UI
    consumeView.removeShadow();
};

/**
 * ADDCONSUME CONTROLLER
 **/
const controlAddConsume = () => {
    // Control Sidebar to check whhich is the type of consume
    const [activeItem, nameItem] = controlSidebar();

    // Render Shadow in the UI
    consumeView.renderShadow();

    // Render UI text about type of consume and liters per minute
    consumeView.renderTextInfo(activeItem.dataset.itemid, nameItem);

    // Reset all the messages from the UI (success and error)
    consumeView.resetResultMessages();

    // Reset Timer and Inputs
    resetTimer();
    resetInputs();
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
    const itemID = activeItem.dataset.itemid;
    const nameItem = getItemName(itemID);

    // Change The Timer options of inputs to add a new consume
    if (itemID == 'bath') {
        elements.timerDOM.style.display = 'none';
        elements.flushDOM.style.display = 'none';

        elements.portionDOM.style.display = 'flex';
    } else if (itemID == 'toiletFlush') {
        elements.portionDOM.style.display = 'none';
        elements.timerDOM.style.display = 'none';

        elements.flushDOM.style.display = 'flex';
    } else {
        elements.portionDOM.style.display = 'none';
        elements.flushDOM.style.display = 'none';

        elements.timerDOM.style.display = 'flex';
    }

    // Return both activeItem and the full name of the type of consume
    return [activeItem, nameItem];
};

// Control Sidebar on Click event to change the text and the active's sidebar item
elements.typeConsume.addEventListener('click', e => {
    // Get the clicked sidebar Item
    const itemID = e.target.closest('.sidebar__item').dataset.itemid;

    // Depending on the clicked sidebar item, create the full name type of consume
    const nameItem = getItemName(itemID);

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
    consumeView.renderTextInfo(itemID, nameItem);

    // Change The Timer Inputs
    if (itemID == 'bath') {
        elements.timerDOM.style.display = 'none';
        elements.flushDOM.style.display = 'none';

        elements.portionDOM.style.display = 'flex';
    } else if (itemID == 'toiletFlush') {
        elements.portionDOM.style.display = 'none';
        elements.timerDOM.style.display = 'none';

        elements.flushDOM.style.display = 'flex';
    } else {
        elements.portionDOM.style.display = 'none';
        elements.flushDOM.style.display = 'none';

        elements.timerDOM.style.display = 'flex';
    }
});

// Get Item Name from the itemID (shower = Shower, handsWash = Hands Wash, etc.)
const getItemName = itemID => {
    switch (itemID) {
        case 'shower':
            return 'Shower';
        case 'bath':
            return 'Bath';
        case 'handsWash':
            return 'Hands Wash';
        case 'toiletFlush':
            return 'Toilet Flush';
        default:
            return 'Error';
    }
};

/**
 * TIMER CONTROLLER
 **/

// Set the first Click to true
let firstClick = true;

// Set the interval to -1 meaning there is no pause
let timerInterval = -1;

// On Click on timer componenet do something
elements.timer.addEventListener('click', () => {
    // Reset all the messages from the UI (success and error)
    consumeView.resetResultMessages();

    // If it IS the first time the user clicks do something
    if (firstClick) {
        // Reset the Timer to inital configuration
        resetTimer();

        // Prepare the UI of the timer element to Pause configuration
        consumeView.renderTextTimer('pause');

        // Start counting the time in cycles of 1 second
        timerInterval = timerIntervalCounter(1000);

        // Change the firsClick flag to false
        firstClick = false;
    }
    // If it is NOT the first time the user clicks do something
    else {
        // If there is NO PAUSE
        if (timerInterval == -1) {
            // Prepare the UI of the timer element to Pause configuration
            consumeView.renderTextTimer('pause');

            // Start counting the time in cycles of 1 second
            timerInterval = timerIntervalCounter(1000);
        }
        // If there IS a PAUSE
        else {
            // Prepare the UI of the timer element to Continue configuration
            consumeView.renderTextTimer('continue');

            // Clear the interval and set pause
            clearInterval(timerInterval);
            timerInterval = -1;
        }
    }
});

// SetInterval with cycles of X milliseconds (1000)
const timerIntervalCounter = milliseconds => {
    const interval = setInterval(function() {
        // Adds 1 second every second
        state.time += 1;

        // Change the UI to the timer element to the time that has already passed
        consumeView.renderTimeTimer(state.time);
    }, milliseconds);

    // Return the interval ID
    return interval;
};

// Reset the Timer UI
const resetTimer = () => {
    // Reset value of timer
    elements.timer.childNodes[1].textContent = `00:00:00`;
    state.time = 0;

    // Prepare the UI of the timer element to Start configuration
    consumeView.renderTextTimer('start');

    // Reset all the messages from the UI (success and error)
    consumeView.resetResultMessages();

    // Clear the interval and set pause
    clearInterval(timerInterval);
    timerInterval = -1;
    firstClick = true;
};

// Control the Inputs when the user clicks the increment or decrement buttons
const controlInputs = event => {
    // Reset all the messages from the UI (success and error)
    consumeView.resetResultMessages();

    const targetClassList = [...event.target.classList];
    let newValue = 0;
    if (targetClassList.includes('btn__add')) {
        const typeInput = event.target.parentNode.childNodes[3];
        const typeInputValue = +typeInput.value;
        newValue = typeInputValue + 1;

        if (parseInt(newValue, 10) < 10) newValue = '0' + newValue;
        typeInput.value = newValue;
        toggleDisable(typeInput);
    }
    if (targetClassList.includes('btn__remove')) {
        const typeInput = event.target.parentNode.childNodes[3];
        const typeInputValue = +typeInput.value;
        newValue = typeInputValue - 1;

        if (parseInt(newValue, 10) < 10) newValue = '0' + newValue;
        typeInput.value = newValue;
        toggleDisable(typeInput);
    }
};

// Reset the Inputs from the Timer UI
const resetInputs = () => {
    let timerInputsChilds = elements.timerInputs.childNodes;

    timerInputsChilds.forEach(child => {
        if (child.classList && child.classList.contains('timer__boxes')) {
            const typeInput = child.childNodes[3];
            // Set value of input to 0
            typeInput.value = '00';
            // Reset Inputs
            toggleDisable(typeInput);
        }
    });
};

// Toggle the increment and decrement buttons depending on the max and min values of the inputs
const toggleDisable = typeInput => {
    // Set the incremental button and the decremental button
    const incButton = typeInput.parentNode.childNodes[1];
    const decButton = typeInput.parentNode.childNodes[7];

    // If the value of the input is equal to its max then disable the inc button
    incButton.disabled = +typeInput.value == +typeInput.max;
    // If the value of the input is equal to its min then disable the dec button
    decButton.disabled = +typeInput.value == +typeInput.min;
};

// On Click on "click here to insert your own value" text, show Inputs from Timer UI
elements.showInput.addEventListener('click', event => {
    // render the inputs on the UI
    elements.timerInputs.style.display = 'flex';
    // render the save button on the UI
    elements.saveButton2.style.display = 'block';

    // remove the clicked text from the UI
    elements.showInput.style.display = 'none';

    // Reset all the messages from the UI (success and error)
    consumeView.resetResultMessages();
});

// On Click on a different bathtub size do something
elements.portion.addEventListener('click', event => changeBathTub(event));

// Change the BathTub will trigger a state change
const changeBathTub = event => {
    // Reset all the messages from the UI (success and error)
    consumeView.resetResultMessages();

    // Get the bathtub type that was clicked
    const btn = event.target.closest('.timer__option');

    // If the clicked target has a dataset-type (small, medium, big)
    if (btn.dataset.type) {
        // Prepare the UI bathtubType for changes
        consumeView.renderBathtubType(btn);

        // Change the state bathTub to the actual clicked one
        state.bathTub = btn.dataset.type;

        // Render UI text about type of consume and liters per minute
        consumeView.renderTextInfo('bath', 'Bath', state.bathTub);
    }
};

/**
 * SAVE CONSUMES CONTROLLER
 **/
const controlSaveConsume = type => {
    // Reset all the messages from the UI (success and error)
    consumeView.resetResultMessages();

    // Pick the active item from the sidebar
    let [activeItem, nameItem] = controlSidebar();
    activeItem = activeItem.dataset.itemid;

    // If the save button was from the Timer
    if (type === 'timer') {
        // If there IS water consumption do something
        if (state.time > 0) {
            console.log('Creating consume', { activeItem, nameItem, timeSeconds: state.time, date: new Date() });
            const consume = new Consume(activeItem, nameItem, state.time, new Date());
            consume.calcConsume();
            state.consumes.addConsume(consume);
            // Render the Success message on the UI
            consumeView.renderMessageResult(elements.saveButton.parentNode.nextElementSibling.firstElementChild);
        }
        // If there is NO consume
        else {
            console.log('Oups, seems like there is no consume!');
            // Render the Error message on the UI
            consumeView.renderMessageResult(elements.saveButton.parentNode.nextElementSibling.lastElementChild);
        }

        // Prepare the UI of the timer element to Restart configuration
        consumeView.renderTextTimer('restart');

        // Clear the interval and set Stop
        clearInterval(timerInterval);
        timerInterval = -1;
        firstClick = true;
    }
    // If the save button was from the Inputs
    else if (type === 'input') {
        let timerInputsChilds = elements.timerInputs.childNodes;
        let time = 0;
        // For each input from the Timer
        timerInputsChilds.forEach(child => {
            if (child.classList && child.classList.contains('timer__boxes')) {
                const typeInput = child.childNodes[3];
                const typeInputVal = +typeInput.value;

                // If the input is for seconds sum the seconds to the total
                if (typeInput.dataset.type === 'seconds') {
                    time += typeInputVal;
                }
                // If the input is for seconds sum the minutes to the total
                if (typeInput.dataset.type === 'minutes') {
                    time += typeInputVal * 60;
                }
                // If the input is for seconds sum the hours to the total
                if (typeInput.dataset.type === 'hours') {
                    time += typeInputVal * 60 * 60;
                }
            }
        });

        // If there IS water consumption do something
        if (time > 0) {
            console.log('Creating consume', { activeItem, nameItem, timeSeconds: time, date: new Date() });
            const consume = new Consume(activeItem, nameItem, time, new Date());
            consume.calcConsume();
            state.consumes.addConsume(consume);
            // Render the Success message on the UI
            consumeView.renderMessageResult(elements.saveButton2.parentNode.nextElementSibling);
        }
        // If there is NO consume
        else {
            console.log('Oups, seems like there is no consume!');
            // Render the Error message on the UI
            consumeView.renderMessageResult(elements.saveButton2.parentNode.parentNode.lastElementChild);
        }

        // Reset the Inputs from Timer
        resetInputs();
    }
    // If the save button was from the portion (bath)
    else if (type === 'portion') {
        console.log('Creating consume', { activeItem: activeItem + ':' + state.bathTub, nameItem, timeSeconds: '∞', date: new Date() });
        const consume = new Consume(state.bathTub, nameItem, '∞', new Date());
        consume.calcConsume();
        state.consumes.addConsume(consume);
        // Render the Success message on the UI
        consumeView.renderMessageResult(elements.saveButton3.parentNode.nextElementSibling);
    }
    // If the save button was from the flush (toiletFlush)
    else if (type === 'flush') {
        console.log('Creating consume', { activeItem, nameItem, timeSeconds: '∞', date: new Date() });
        const consume = new Consume(activeItem, nameItem, '∞', new Date());
        consume.calcConsume();
        state.consumes.addConsume(consume);
        // Render the Success message on the UI
        consumeView.renderMessageResult(elements.saveButton4.parentNode.nextElementSibling);
    }
};

// On Click on each input from the Timer
elements.timerInputs.addEventListener('click', event => controlInputs(event));

// On Click on each Button (save or stop) from the Timer
elements.stopButton.addEventListener('click', resetTimer);
elements.saveButton.addEventListener('click', () => controlSaveConsume('timer'));
elements.saveButton2.addEventListener('click', () => controlSaveConsume('input'));
elements.saveButton3.addEventListener('click', () => controlSaveConsume('portion'));
elements.saveButton4.addEventListener('click', () => controlSaveConsume('flush'));

/**
 * MANAGE CONTROLLER
 **/
const controlManage = (page = 1) => {
    // Render Shadow in the UI
    consumeView.renderShadow();

    // Control Toggle to check whether to show Table or Chart
    controlToggle(page);

    // Control WaterPercentage Animation
    controlWaterPercentage();
};

/**
 * TOGGLE CONTROLLER
 **/
const controlToggle = (page = 1) => {
    // Get value from checkbox to understand what should it render (table, chart)
    const showElement = elements.toggleButton.checked ? 'chart' : 'table';

    // Depending on the showElement value control Table or Chart
    if (showElement === 'table') controlTable(page);
    else if (showElement === 'chart') controlChart();
};

// Control Toggle on CHANGE to check whether to show Table or Chart
elements.toggleButton.addEventListener('change', () => {
    controlToggle();
});

/**
 * TABLE CONTROLLER
 **/
const controlTable = (page = 1) => {
    // Prepare UI for changes
    elements.table.style.display = 'block';
    elements.chart.style.display = 'none';

    // Clear Table Content
    consumeView.clearConsumesTable();

    const goToPage = page;
    // Set state to have the goToPage saved
    state.page = goToPage;

    // Render consumes to table
    // resPerPage from base.js
    consumeView.renderConsumesTable(state.consumes.list, goToPage, resPerPage);
};

// On Click on table pages
elements.tableButtons.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 5);
        // Set state to have the goToPage saved
        state.page = goToPage;

        // reset the Table UI
        consumeView.clearConsumesTable();

        // Render consumes to table
        // resPerPage from base.js
        consumeView.renderConsumesTable(state.consumes.list, goToPage, resPerPage);
    }
});

// Handle save, edit or delete buttons from table rows
const handleTableButtons = event => {
    // If the target from the event is one of those buttons ( save, edit or delete)
    if (event.target.dataset.type) {
        const parent = event.target.parentNode.parentNode;
        const id = event.target.parentNode.parentNode.id;

        switch (event.target.dataset.type) {
            case 'edit':
                // Disable all edits
                disableAllEdits(elements.tableConsumes);

                // Change the text from the "edit" button to "save"
                event.target.childNodes[0].nodeValue = 'Save';
                event.target.dataset.type = 'save';

                // Change the Mins input from that row to enabled
                parent.childNodes[5].childNodes[0].disabled = false;
                parent.childNodes[5].childNodes[0].classList.remove('disabled');
                parent.childNodes[5].childNodes[0].focus();

                break;
            case 'delete':
                // Delete the consume from consumes
                state.consumes.deleteConsume(id);

                // Rerender the pages and the current page => rerender the manage section
                // If the deleted consume was the last from that page and go to the previous page and remove button to next page
                if (state.consumes.list.length - 1 < resPerPage && state.page > 1) {
                    controlManage(state.page - 1);
                }
                // If the deleted consumed doesn't affect the resulting pages
                else {
                    controlManage(state.page);
                }

                break;
            case 'save':
                // Get the value of the mins input
                const value = parent.childNodes[5].childNodes[0].value;

                // Update the consume from consumes
                state.consumes.updateConsume(id, value);

                // Change the text from the "save" button to "edit"
                event.target.childNodes[0].nodeValue = 'Edit';
                event.target.dataset.type = 'edit';

                // Change the Mins input from that row to disabled
                parent.childNodes[5].childNodes[0].disabled = true;
                parent.childNodes[5].childNodes[0].classList.add('disabled');

                // Rerender the pages and the current page => rerender the manage section
                controlManage(state.page);

                break;
        }
    }
};

// Disable All Edits from a specific table
const disableAllEdits = table => {
    // For each child from the table
    [...table.childNodes].forEach(child => {
        const id = child.id;
        // If the child isn't a consume entry => return
        if (!id) return;
        // If the child option is different from edit and save => return
        if (child.childNodes[9].childNodes[0].dataset.type != 'edit' && child.childNodes[9].childNodes[0].dataset.type != 'save') return;

        // Reset the text from the "save" button to "edit"
        child.childNodes[9].childNodes[0].childNodes[0].nodeValue = 'Edit';
        child.childNodes[9].childNodes[0].dataset.type = 'edit';
        // Change the Mins input from that row to disabled
        child.childNodes[5].childNodes[0].disabled = true;
        child.childNodes[5].childNodes[0].classList.add('disabled');
        // Set the value of the mins input and convert it to mins
        child.childNodes[5].childNodes[0].value = convertToMin(state.consumes.getTime(id));

        // Render the value of Liters of the consume to the amount of liters
        consumeView.setLitersIntoTableRow(child, state.consumes.getTime(id), state.consumes.getType(id));
    });
};

// Convert seconds to minutes
const convertToMin = seconds => {
    return (seconds / 60).toFixed(2);
};

// Handle the Min input change (every key entered will trigger this function)
const handleInputChange = event => {
    // If the key is "enter" => simulate a click on "save" button
    if (event.keyCode == '13') {
        const saveButton = document.querySelector("[data-type='save']");
        saveButton.click();
    }
    // Get the actual mins from the input
    const actualTime = event.target.value;

    const parentRow = event.target.parentNode.parentNode;
    const id = parentRow.id;

    // Render the value of Liters of the consume to the amount of liters
    consumeView.setLitersIntoTableRow(parentRow, actualTime * 60, state.consumes.getType(id));
};

// Handle click outside of the table to disable input || reset input
const handleClickOutside = event => {
    // Is the Click inside of the table?
    const isClickInside = elements.tableDOM.contains(event.target);

    // If the click was outside of the table
    if (!isClickInside) {
        // Disable all inputs and reset the input
        disableAllEdits(elements.tableConsumes);
    }
};

// On Click save, edit or delete buttons from table rows do something
elements.tableConsumes.addEventListener('click', event => handleTableButtons(event));

// On Key Up on min input from each table's row do something
elements.tableConsumes.addEventListener('keyup', event => handleInputChange(event));

// On Click on the document try to handle a click outside of the table
document.addEventListener('click', event => handleClickOutside(event));

/**
 * CHART CONTROLLER
 **/
const controlChart = () => {
    // Prepare UI for changes
    elements.table.style.display = 'none';
    elements.chart.style.display = 'block';

    // Create ListWeek to convert the Consumes State into an array of liters per week day
    const [objWeek, arrWeek] = createWeekStruct();

    // Insert into an array the days of week ordered from today-6 to today
    const arrDays = [];
    Object.keys(objWeek).map(igKey => {
        arrDays.push(igKey);
    });

    // Render the Chart with the array of liter per week day
    consumeView.renderChart(arrDays, arrWeek);
};

/**
 * WATER_PERCENTAGE_ANIMATION CONTROLLER
 **/
const controlWaterPercentage = () => {
    // Create ObjWeek to convert the Consumes State into an object -> keys = week day, values = liters
    const [objWeek, _] = createWeekStruct();

    // Add each consume date converted to full date, from state.consumes to an array
    const fullDateArr = state.consumes.list.map(consume => convertToFullDate(consume.date));
    // Get Full Date from today's date
    const todayDate = convertToFullDate(new Date());

    // Calculate today's consume
    const todaysConsume = fullDateArr.reduce((counter, date, index) => {
        if (date == todayDate) {
            counter += state.consumes.list[index].liters;
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
        // Monday: 0,
        // Tuesday: 0,
        // Wednesday: 0,
        // Thursday: 0,
        // Friday: 0,
        // Saturday: 0,
        // Sunday: 0
    };

    for (let i = 6; i >= 0; i--) {
        let day = new Date();
        day.setDate(day.getDate() - i);

        const weekDay = findWeekDay(day);
        weekAmount[weekDay] = 0;
    }

    // For each consume entry, update the weekAmount Object using the consumed liters per week day
    // BUT only for this week starting at Monday and ending at Sunday
    const todayDay = new Date();
    const objWeek = state.consumes.list
        .map(consume => findWeekDay(new Date(consume.date)))
        .reduce((counter, consumeWeekDay, cur) => {
            const consume = state.consumes.list[cur];
            const constumeDate = new Date(consume.date);
            // If the day is from the past week but not equal to this day - 7, do something
            if (constumeDate.getDate() >= todayDay.getDate() - 6) {
                counter[consumeWeekDay] = counter[consumeWeekDay] + consume.liters;
            }
            return counter;
        }, weekAmount);

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
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const fullDate = `${year}-${month}-${day}`;
    return fullDate;
};

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getWeek = function(dowOffset = 1) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
    // This has some small changes according to the needs of this project

    dowOffset = typeof dowOffset == 'number' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(), 0, 1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = day >= 0 ? day : day + 7;
    var daynum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if (day < 4) {
        weeknum = Math.floor((daynum + day - 1) / 7) + 1;
        if (weeknum > 52) {
            nYear = new Date(this.getFullYear() + 1, 0, 1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    } else {
        weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
};
