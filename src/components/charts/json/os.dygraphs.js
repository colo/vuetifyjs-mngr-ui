export default {
  "uptime": {
    "class": "line",
    "style": "width:95%; height:100px;",
    "interval": 0,
    "options": {
      // drawPoints: true,
      showRoller: true,
      // valueRange: [0.0, 1.2],
      labels: ['Time', 'Value']
    }
  },

  "loadavg": {
    "class": "line",
    "style": "width:95%; height:250px;",
    "interval": 0,
    "options": {
      // drawPoints: true,
      showRoller: true,
      // valueRange: [0.0, 1.2],
      labels: ['Time', '1 min avg', '5 min avg', '15 min avg']

    }
  },
  // "loadavg": {
  //   "class": "line",
  //   "interval": 5000,
  //   "type": "chartjs-line",
  //   "options": {
  //     "labels": ["January", "February", "March", "April", "May", "June", "July"],
  //     "datasets":[{
  //         label: "My first dataset",
  //         fill: false,
  //         lineTension: 0.1,
  //         backgroundColor: "rgba(75,192,192,0.4)",
  //         borderColor: "rgba(75,192,192,1)",
  //         borderCapStyle: 'butt',
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         borderJoinStyle: 'miter',
  //         pointBorderColor: "rgba(75,192,192,1)",
  //         pointBackgroundColor: "#fff",
  //         pointBorderWidth: 1,
  //         pointHoverRadius: 5,
  //         pointHoverBackgroundColor: "rgba(75,192,192,1)",
  //         pointHoverBorderColor: "rgba(220,220,220,1)",
  //         pointHoverBorderWidth: 2,
  //         pointRadius: 1,
  //         pointHitRadius: 10,
  //         data: [65, 59, 80, 81, 56, 55, 40],
  //         spanGaps: false,
  //     }],
  //     "option": {
  //       responsive:true,
  //       maintainAspectRatio:true,
  //       title: {
  //           display: true,
  //           position: 'bottom',
  //           text: 'Custom Chart Title'
  //       },
  //       scales: {
  //           yAxes: [{
  //               display: true,
  //               ticks: {
  //                   beginAtZero:true,
  //               }
  //           }]
  //       }
  //     }
  //
  //   }
  // },
  // cpu: {
  //   "class": "gauge",
  //   "interval": 1000,
  //   "type": "pie-chart",
  //   "option": {
  //
  //
  //   }
  // },
  // mem: {
  //   "class": "gauge",
  //   "interval": 2000,
  //   "type": "pie-chart",
  //   "option": {
  //
  //   }
  // }
}
