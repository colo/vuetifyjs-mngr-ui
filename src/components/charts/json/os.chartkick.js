export default {
  "uptime": {
    "class": "line",
    "interval": 5000,
    "type": "line-chart",
    "option": {
      "library": {
        // responsive: false,
        elements: {
            point:{
                radius: 0,
            },
            line: {
                tension: 0, // disables bezier curves
            }
        },
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
      }

    }
  },
  "loadavg": {
    "class": "line",
    "interval": 5000,
    "type": "line-chart",
    "option": {
      "library": {
        // responsive: false,
        elements: {
            point:{
                radius: 0,
            },
            line: {
                tension: 0, // disables bezier curves
            }
        },
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
      }

    }
  },
  cpu: {
    "class": "gauge",
    "interval": 1000,
    "type": "pie-chart",
    "option": {
      "width" : "250px",
      "height": "250px",
      "library":{
          // data: {
          //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          //     datasets: [{
          //         label: '# of Votes',
          //         data: [12, 19, 3, 5, 2, 3],
          //         backgroundColor: [
          //             'rgba(255, 99, 132, 0.2)',
          //             'rgba(54, 162, 235, 0.2)',
          //             'rgba(255, 206, 86, 0.2)',
          //             'rgba(75, 192, 192, 0.2)',
          //             'rgba(153, 102, 255, 0.2)',
          //             'rgba(255, 159, 64, 0.2)'
          //         ],
          //         borderColor: [
          //             'rgba(255,99,132,1)',
          //             'rgba(54, 162, 235, 1)',
          //             'rgba(255, 206, 86, 1)',
          //             'rgba(75, 192, 192, 1)',
          //             'rgba(153, 102, 255, 1)',
          //             'rgba(255, 159, 64, 1)'
          //         ],
          //         borderWidth: 1
          //     }]
          // },
          rotation: 1 * Math.PI,
          circumference: 1 * Math.PI
      }
    }
  },
  mem: {
    "class": "gauge",
    "interval": 2000,
    "type": "pie-chart",
    "option": {
      "width" : "250px",
      "height": "250px",
      "library":{
          rotation: 1 * Math.PI,
          circumference: 1 * Math.PI
      }
    }
  }
}
