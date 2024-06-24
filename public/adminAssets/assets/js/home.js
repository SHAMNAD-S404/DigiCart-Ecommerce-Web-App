
document.addEventListener('DOMContentLoaded',() => {
    const barchartDiv=document.getElementById('barchartDiv');
    if(barchartDiv) {
        const labels=JSON.parse(barchartDiv.dataset.labels);
        const counts=JSON.parse(barchartDiv.dataset.counts);
        const barColors=["red","green","blue","orange","brown"];

        new Chart("myChart",{
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: barColors,
                    data: counts
                }]
            },
            options: {
                responsive: true,
                legend: {display: false},
                title: {
                    display: true,
                    text: "Last Seven Day Order Count",
                    fontSize: 18,
                    fontColor: '#fff'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 14,
                            fontColor: '#fff'
                        },
                        gridLines: {
                            color: "rgba(255, 255, 255, 0.1)"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 14,
                            fontColor: '#fff'
                        },
                        gridLines: {
                            color: "rgba(255, 255, 255, 0.1)"
                        }
                    }]
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutBounce'
                },
                tooltips: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFontSize: 16,
                    titleFontColor: '#fff',
                    bodyFontSize: 14,
                    bodyFontColor: '#fff',
                    displayColors: false
                }
            }
        });


    }

    //FOR PIE CHART
    const pieChart = document.getElementById('pieChartDiv');
    if(pieChart) {
        const catLabel=JSON.parse(pieChart.dataset.labels);
        const catCount=JSON.parse(pieChart.dataset.counts);
        
        const barColors=[
            "#FF6384", // Soft Red
            "#36A2EB", // Soft Blue
            "#FFCE56", // Soft Yellow
            "#4BC0C0", // Soft Teal
            "#9966FF", // Soft Purple
            "#FF9F40", // Soft Orange
            "#F7464A", // Red
            "#46BFBD", // Green
            "#FDB45C", // Yellow
            "#949FB1", // Grey
            "#4D5360"  // Dark Grey
        ];

        new Chart("myPieChart",{
            type: "doughnut",
            data: {
                labels:catLabel ,
                datasets: [{
                    backgroundColor: barColors,
                    data: catCount,
                    hoverBackgroundColor: barColors.map(color => {
                        let shade=parseInt(color.slice(1),16);
                        shade=shade^0x808080;
                        return "#"+("000000"+shade.toString(16)).slice(-6);
                    })
                }]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Product-wise Order Count'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem,data) {
                            const label=catLabel[tooltipItem.index]||'';
                            const value=catCount[tooltipItem.index]||0;
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        });

    }


    //FOR HORIZONTAL CHART
    const horizontalChart=document.getElementById('horizontalChart');
    if(horizontalChart) {
        const proLabel=JSON.parse(horizontalChart.dataset.labels);
        const productCount=JSON.parse(horizontalChart.dataset.counts);
        const barColors=[
            "#FF6384", // Soft Red
            "#36A2EB", // Soft Blue
            "#FFCE56", // Soft Yellow
            "#4BC0C0", // Soft Teal
            "#9966FF", // Soft Purple
            "#FF9F40", // Soft Orange
            "#F7464A", // Red
            "#46BFBD", // Green
            "#FDB45C", // Yellow
            "#949FB1", // Grey
            "#4D5360"  // Dark Grey
        ];

        new Chart("myHorizontal",{
            type: "horizontalBar",
            data: {
                labels: proLabel,
                datasets: [{
                    backgroundColor: barColors,
                    data: productCount
                }]
            },
            options: {
                responsive: true,
                legend: {display: false},
                title: {
                    display: true,
                    text: "",
                    fontSize: 14,
                    fontColor: '#fff'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 12,
                            fontColor: '#fff'
                        },
                        gridLines: {
                            color: "rgba(255, 255, 255, 0.1)"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 14,
                            fontColor: '#fff'
                        },
                        gridLines: {
                            color: "rgba(255, 255, 255, 0.1)"
                        }
                    }]
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutBounce'
                },
                tooltips: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFontSize: 16,
                    titleFontColor: '#fff',
                    bodyFontSize: 14,
                    bodyFontColor: '#fff',
                    displayColors: false
                }
            }
        });


    }

});

   