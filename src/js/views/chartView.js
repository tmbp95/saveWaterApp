import { elements } from './base';

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
