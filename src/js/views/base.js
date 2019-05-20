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
    waterPerMinuteText: document.querySelector('.waterPerMinute'),
    timer: document.querySelector('.timer__auto'),
    timerInputs: document.querySelector('.timer__counter'),
    stopButton: document.querySelector('.timer__stop'),
    saveButton: document.querySelector('.timer__save'),
    tableButtons: document.querySelector('.data-box__buttons')
};

export const consumeTypes = {
    shower: 12,
    handsWash: 5,
    toiletFlush: 10
};

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
