import { elements } from './base';

// Clean up all entries of the table
export const clearConsumesTable = () => {
    elements.tableConsumes.innerHTML = '';
};

// Render each consume using a markup
const renderConsume = consume => {
    const markup = `
        <tr>
            <td>${consume.type}</td>
            <td>${consume.time}</td>
            <td>${consume.liters}</td>
            <td>Edit | Delete</td>
        </tr>
    `;
    elements.tableConsumes.insertAdjacentHTML('beforeend', markup);
};

// Render all consumes into the table
export const renderConsumesTable = consumes => {
    consumes.forEach(renderConsume);
};

// Render Chart using Chart.js library
export const renderChart = data => {
    const ctx = elements.chartConsumes.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
