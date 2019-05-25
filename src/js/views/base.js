export const elements = {
    // searchForm: document.querySelector('.search'),
    // searchInput: document.querySelector('.search__field'),
    menu: document.querySelectorAll('.topbar__item'),
    contentLeft: document.querySelector('.content__left'),
    sections: document.querySelectorAll('section'),
    sectionAbout: document.querySelector('.section-about'),
    sectionAddConsume: document.querySelector('.section-timer'),
    sectionManage: document.querySelector('.section-manage'),
    toggleButton: document.querySelector('#checkbox-toggle'),
    table: document.querySelector('.data-box__table'),
    chart: document.querySelector('.data-box__chart'),
    dataBox: document.querySelector('.data-box'),
    tableConsumes: document.querySelector('#consume-table'),
    chartConsumes: document.querySelector('#myChart'),
    waterAnimationBig: document.querySelector('.info--big'),
    typeConsume: document.querySelector('.sidebar__nav'),
    typeConsumeText: document.querySelector('.water-animation__type'),
    typeConsumeDescription: document.querySelector('.water-animation__description'),
    waterPerMinuteText: document.querySelector('.waterPerMinute'),
    timer: document.querySelector('.timer__auto'),
    timerDOM: document.querySelector('.timer'),
    portion: document.querySelector('.timer__portion'),
    portionDOM: document.querySelector('.portion'),
    flushDOM: document.querySelector('.flush'),
    timerInputs: document.querySelector('.timer__counter'),
    stopButton: document.querySelector('.timer__timer--stop'),
    saveButton: document.querySelector('.timer__timer--save'),
    saveButton2: document.querySelector('.timer__input--save'),
    saveButton3: document.querySelector('.timer__portion--save'),
    saveButton4: document.querySelector('.timer__flush--save'),
    tableDOM: document.querySelector('.table'),
    showInput: document.querySelector('.showInput'),
    tableButtons: document.querySelector('.data-box__buttons'),
    successMessage: document.querySelectorAll('.timer__added'),
    errorMessage: document.querySelectorAll('.timer__error')
};

export const consumeTypes = {
    shower: 12,
    bath: {
        big: 15,
        medium: 15,
        small: 15
    },
    handsWash: 5,
    toiletFlush: 10
};

export const resPerPage = 7;

export const elementStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};
