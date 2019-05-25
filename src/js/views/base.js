// All DOM Elements
export const elements = {
    menu: document.querySelectorAll('.topbar__item'),

    contentLeft: document.querySelector('.content__left'),

    sections: document.querySelectorAll('section'),
    sectionAbout: document.querySelector('.section-about'),
    sectionAddConsume: document.querySelector('.section-timer'),
    sectionManage: document.querySelector('.section-manage'),

    toggleButton: document.querySelector('#checkbox-toggle'),

    dataBox: document.querySelector('.data-box'),

    table: document.querySelector('.data-box__table'),
    tableConsumes: document.querySelector('#consume-table'),

    chart: document.querySelector('.data-box__chart'),
    chartConsumes: document.querySelector('#myChart'),

    waterAnimationBig: document.querySelector('.info--big'),

    typeConsume: document.querySelector('.sidebar__nav'),
    typeConsumeText: document.querySelector('.water-animation__type'),
    typeConsumeDescription: document.querySelector('.water-animation__description'),
    waterPerMinuteText: document.querySelector('.waterPerMinute'),

    timer: document.querySelector('.timer__auto'),
    timerDOM: document.querySelector('.timer'),
    stopButton: document.querySelector('.timer__timer--stop'),
    saveButton: document.querySelector('.timer__timer--save'),
    timerInputs: document.querySelector('.timer__counter'),
    saveButton2: document.querySelector('.timer__input--save'),

    portion: document.querySelector('.timer__portion'),
    portionDOM: document.querySelector('.portion'),
    saveButton3: document.querySelector('.timer__portion--save'),

    flushDOM: document.querySelector('.flush'),
    saveButton4: document.querySelector('.timer__flush--save'),

    tableDOM: document.querySelector('.table'),
    showInput: document.querySelector('.showInput'),
    tableButtons: document.querySelector('.data-box__buttons'),

    successMessage: document.querySelectorAll('.timer__added'),
    errorMessage: document.querySelectorAll('.timer__error')
};

// Consume Types
export const consumeTypes = {
    shower: 12,
    bath: {
        big: 30,
        medium: 25,
        small: 15
    },
    handsWash: 5,
    toiletFlush: 10
};

// Number of consumes per page in the table - Manage Section
export const resPerPage = 7;
