import { elements, consumeTypes } from './base';

// Clean up all entries of the table
export const clearConsumesTable = () => {
    elements.tableConsumes.innerHTML = '';
    elements.tableButtons.innerHTML = '';
};

// Render each consume using a markup
const renderConsume = consume => {
    // create a new Date object with the date from the consume
    const date = new Date(consume.date);
    // Split the date to have an array of strings from the date
    const dateArray = date.toString().split(' ');
    // Get the month with only 3 chars from the array
    const month = dateArray[1].substr(0, 3);
    // Get the day from the array
    const day = dateArray[2];
    // Get the liters and convert it to a fixed and formatted number
    const liters = nFormatter(consume.liters.toFixed(1), 1);
    // If the consume has a time convert it to minutes otherwise write ∞
    const time = isNaN(convertToMin(consume.time)) ? '∞' : `<input class="disabled" type="number" value="${convertToMin(consume.time)}" disabled/>`;
    // If the consume has a time create the EDIT button otherwise no
    const buttons = isNaN(convertToMin(consume.time)) ? '<button data-type="delete">Delete</button>' : `<button data-type="edit">Edit</button> | <button data-type="delete">Delete</button>`;
    const markup = `
            <tr id="${consume.id}">
                <td>${month} ${day}</td>
                <td>${consume.typeComplete}</td>
                <td>${time}</td>
                <td>${liters}</td>
                <td>${buttons}</td>
            </tr>
            
        `;
    elements.tableConsumes.insertAdjacentHTML('beforeend', markup);
};

// Render the liters into the consume row from table while updating the mins value
export const setLitersIntoTableRow = (child, time = 1, type) => {
    child.childNodes[7].childNodes[0].nodeValue = nFormatter(convertToMin(time) * consumeTypes[type], 1);
};

// Format the number to use k, M, G, T, P ... instead of having a lot of zeros
// You can find a similar approach in stackOverFlow
const nFormatter = (num, digits) => {
    const si = [{ value: 1, symbol: '' }, { value: 1e3, symbol: 'k' }, { value: 1e6, symbol: 'M' }, { value: 1e9, symbol: 'G' }, { value: 1e12, symbol: 'T' }, { value: 1e15, symbol: 'P' }, { value: 1e18, symbol: 'E' }];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    // If the number is too big >= 1e18, then use the number must be ∞
    if (num >= si[si.length - 1].value) {
        return '∞';
    }
    // If the number is normal < 1e18, then just use the normal si replacer
    else {
        return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
    }
};

// Render all consumes into the table
export const renderConsumesTable = (consumes, page = 1, resPerPage = 7) => {
    // render results of current page

    // If the consumes length is inferior to the number of results per page
    if (consumes.length <= resPerPage) {
        resPerPage = consumes.length;
    }
    // e.g. (1-1) * 7 = 0 => start = 0 | (2-1) * 7 = 0 => start = 7
    const start = (page - 1) * resPerPage;
    // e.g. 1 * 7 = 7 => end = 7 | 2 * 7 = 14 => end = 14
    const end = page * resPerPage;

    // slice the consumes array to render the respective start - end consumes
    consumes.slice(start, end).forEach(renderConsume);

    // render pagination buttons
    renderButtons(page, consumes.length, resPerPage);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;

// Render the buttons
const renderButtons = (page, numResults, resPerPage) => {
    // Number of pages = number of results / number of results per page
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    // If actual page is 1 and there are more pages
    if (page === 1 && pages > 1) {
        // create button to go to next page
        button = createButton(page, 'next');
    }
    // If actual page > 1 and < number of pages
    else if (page < pages) {
        // create both buttons to next and prev pages
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    // If actual page > 1 and = number of pages
    else if (page === pages && pages > 1) {
        // render button to go prev page
        button = createButton(page, 'prev');
    }
    // If actual page is 1 and there is only 1 page
    else {
        // DONT render buttons
        button = '';
    }

    elements.tableButtons.insertAdjacentHTML('afterbegin', button);
};

// Convertion from seconds to minutes
const convertToMin = seconds => {
    return (seconds / 60).toFixed(2);
};

// Render Chart using Chart.js library
export const renderChart = (days, data) => {
    const ctx = elements.chartConsumes.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(0,0,0,0.6)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Week'
                        },
                        gridLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value.length > 4) {
                                    return value.substr(0, 3); //truncate
                                } else {
                                    return value;
                                }
                            }
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            steps: 10,
                            stepValue: 5,
                            suggestedMax: Math.max(...data) + 5
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Liters'
                        },
                        gridLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                ]
            },
            legend: {
                display: false
            }
        }
    });
};

// Render Water Animation Big using the percentage to change the text and the bottom margin
export const renderWaterAnimation = percentage => {
    // Update the (percentage) text's position using the Bottom property
    const textPercentage = [...elements.waterAnimationBig.childNodes][1];
    if (isNaN(percentage)) {
        percentage = 0;
    }
    let bottomPosition = (percentage.toFixed(0) * 45) / 50;

    // Set a limit to fix the hidden text when the bottomposition is too big
    if (percentage >= 78) {
        textPercentage.style.bottom = `${70}%`;
    } else {
        textPercentage.style.bottom = `${bottomPosition}%`;
    }

    // Create an alert type of text when the limit is reached
    if (percentage > 100) {
        textPercentage.classList.add('info__text--big-alert');
    } else {
        textPercentage.classList.remove('info__text--big-alert');
    }

    // Update the percentage text to the respective value
    const percentageDOM = [...elements.waterAnimationBig.childNodes][1].firstChild;
    if (!isNaN(percentage)) {
        percentageDOM.textContent = percentage.toFixed(0);
    } else {
        percentageDOM.textContent = 0;
    }

    // Update the waves DOMs positions usign the Bottom property
    const wavesDOM = [...elements.waterAnimationBig.childNodes].filter(elm => (elm.classList ? elm.classList.contains('wave') : null));
    const modifiedPercentage = 125 - percentage.toFixed(0);

    // Set a limit to fix the hidden waves when the bottomposition is too big
    if (percentage >= 100) {
        wavesDOM.forEach(wave => (wave.style.bottom = `-${25}%`));
    } else {
        wavesDOM.forEach(wave => (wave.style.bottom = `-${modifiedPercentage.toFixed(0)}%`));
    }
};

// Render the text information into the information on Add Consume section
export const renderTextInfo = (activeItem, nameItem, type = 'medium') => {
    // Change the UI text with the new type of consume
    elements.typeConsumeText.textContent = nameItem;

    // Change the UI secondary-text with the information suggestion of the type of consume
    let text;
    if (activeItem === 'shower') {
        text = 'Turn off the tap while soaping';
    } else if (activeItem === 'handsWash') {
        text = 'Turn off the tap while you scrub';
    } else if (activeItem === 'toiletFlush') {
        text = 'Reduce the water at each flush';
    } else {
        text = 'Why not a Shower instead?';
    }
    elements.typeConsumeDescription.textContent = text;

    // If the consumeType is a child of 'bath' => bath: { small: value , medium: value, big: value}
    if (typeof consumeTypes[activeItem] != 'number') {
        // Change the UI text with the amount of liters per minute => consumeTypes['bath'][type]
        elements.waterPerMinuteText.textContent = consumeTypes[activeItem][type] + ' L';
    } else {
        // Change the UI text with the amount of liters per minute => consumeTypes[activeItem]
        if (activeItem === 'toiletFlush') {
            elements.waterPerMinuteText.textContent = consumeTypes[activeItem] + ' L';
        } else {
            elements.waterPerMinuteText.textContent = consumeTypes[activeItem] + ' L/min';
        }
    }
};

// Render the text from the timer component in Add Consume Section
export const renderTextTimer = type => {
    if (type === 'pause') {
        // Change the UI of the timer element
        elements.timer.classList.remove('timer__auto-pause');
        // Change the info text from the timer element to display Press to Pause
        elements.timer.childNodes[3].textContent = `Press to Pause`;
    } else if (type === 'continue') {
        // Change the UI of the timer element
        elements.timer.classList.add('timer__auto-pause');
        // Change the info text from the timer element to display Press to Continue
        elements.timer.childNodes[3].textContent = `Press to Continue`;
    } else if (type === 'restart') {
        // Change the UI of the timer element
        elements.timer.classList.add('timer__auto-pause');
        // Change the info text from the timer element to display Press to Continue
        elements.timer.childNodes[3].textContent = `Press to Restart`;
    } else if (type === 'start') {
        // Change the UI of the timer element
        elements.timer.classList.add('timer__auto-pause');
        // Change the info text from the timer element to display Press to Continue
        elements.timer.childNodes[3].textContent = `Press to Start`;
    }
};

const secondsInADay = 60 * 60 * 24;
const secondsInAHour = 60 * 60;

// Render the numbers from the timer componenet in Add Consume Section
export const renderTimeTimer = time => {
    // From the time variable check the amount of hours
    let hours = Math.floor(((time % secondsInADay) / secondsInAHour) * 1);
    // From the time variable check the amount of minutes
    let mins = Math.floor((((time % secondsInADay) % secondsInAHour) / 60) * 1);
    // From the time variable check the amount of seconds
    let secs = Math.floor((((time % secondsInADay) % secondsInAHour) % 60) * 1);
    // Fix the 0s when the value is lower then 10.
    hours = hours < 10 ? `0${hours}` : `${hours}`;
    mins = mins < 10 ? `0${mins}` : `${mins}`;
    secs = secs < 10 ? `0${secs}` : `${secs}`;

    // Change the text displayed in the timer element.
    elements.timer.childNodes[1].textContent = `${hours}:${mins}:${secs}`;
};

// Reset the resulting messages from error or success on adding a consume
export const resetResultMessages = () => {
    [...elements.successMessage, ...elements.errorMessage].forEach(elm => {
        elm.style.opacity = 0;
        elm.style.display = 'none';
    });
};

// Render the resulting messages from error or success on adding a consume
export const renderMessageResult = elementMessage => {
    elementMessage.style.display = 'block';
    elementMessage.style.opacity = '1';
};

// Render the clicked bathtub type on the UI
export const renderBathtubType = btn => {
    [...elements.portion.childNodes].forEach(child => {
        if (child.dataset && child.dataset.type) {
            child.classList.remove('timer__option--active');
        }
    });
    btn.classList.add('timer__option--active');
};

// Render UI shadow on the sidebar menu
export const renderShadow = () => {
    elements.contentLeft.classList.add('content__left--shadow');
};

// Remove UI shadow on the sidebar menu

export const removeShadow = () => {
    elements.contentLeft.classList.remove('content__left--shadow');
};
