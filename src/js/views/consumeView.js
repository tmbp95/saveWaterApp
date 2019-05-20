import { elements, consumeTypes } from './base';

// Clean up all entries of the table
export const clearConsumesTable = () => {
    elements.tableConsumes.innerHTML = '';
    elements.tableButtons.innerHTML = '';
};

// Render each consume using a markup
const renderConsume = consume => {
    const dateArray = consume.date.toString().split(' ');
    const month = dateArray[1];
    const day = dateArray[2];
    const markup = `
        <tr>
            <td>${month} ${day}</td>
            <td>${consume.typeComplete}</td>
            <td>${convertToMin(consume.time)}</td>
            <td>${consume.liters.toFixed(1)}</td>
            <td>Edit | Delete</td>
        </tr>
    `;
    elements.tableConsumes.insertAdjacentHTML('beforeend', markup);
};

// Render all consumes into the table
export const renderConsumesTable = (consumes, page = 1, resPerPage = 2) => {
    // render results of current page
    if (consumes.length <= resPerPage) {
        resPerPage = consumes.length;
    }
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

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

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // button to go to next page~
        button = createButton(page, 'next');
    } else if (page < pages) {
        // both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // only button to go prev page
        button = createButton(page, 'prev');
    } else {
        button = '';
    }

    elements.tableButtons.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 3) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
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
    const bottomPosition = (percentage.toFixed(0) * 45) / 50;

    // Set a limit to fix the hidden text when the bottomposition is too big
    if (percentage >= 78) {
        textPercentage.style.bottom = `${70}%`;
    } else {
        textPercentage.style.bottom = `${bottomPosition}%`;
    }

    // Create an alert type of text when the limit is reached
    if (percentage > 100) {
        textPercentage.classList.add('info__text--big-alert');
    }

    // Update the percentage text to the respective value
    const percentageDOM = [...elements.waterAnimationBig.childNodes][1].firstChild;
    percentageDOM.textContent = percentage.toFixed(0);

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

export const renderTextInfo = (activeItem, nameItem) => {
    // Change the UI text with the new type of consume
    elements.typeConsumeText.textContent = nameItem;

    // Change the UI text with the amount of liters per minute
    elements.waterPerMinuteText.textContent = consumeTypes[activeItem];
};

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

export const renderShadow = () => {
    elements.contentLeft.classList.add('content__left--shadow');
};

export const removeShadow = () => {
    elements.contentLeft.classList.remove('content__left--shadow');
};
