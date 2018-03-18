export default {
  "uptime": {
    "class": "line",
    "interval": 5000,
    "init": function(chart, data){
      /**
      * zoom on mousedown/mouseup
      * https://www.amcharts.com/kbase/setting-zoomed-event-fire-actual-zoom-finishes/
      */
      let zoomChart = function () {
        // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
        chart.zoomToIndexes(data.length - 40, data.length - 1);
      }
      chart.addListener("rendered", zoomChart);
      zoomChart();
    },
    "option": {
      "path": "dist/amcharts/",
      "type": "serial",
      "theme": "light",
      "marginRight": 80,
      "autoMarginOffset": 20,
      "marginTop": 7,
      "dataProvider": [],
      "valueAxes": [{
          "axisAlpha": 0.2,
          "dashLength": 1,
          "position": "left"
      }],
      "mouseWheelZoomEnabled": true,
      "graphs": [{
          "id": "g1",
          "balloonText": "[[value]]",
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "hideBulletsCount": 50,
          "title": "red line",
          "valueField": "value",
          "useLineColorForBulletBorder": true,
          "balloon":{
              "drop":true
          }
      }],
      "chartScrollbar": {
          "autoGridCount": true,
          "graph": "g1",
          "scrollbarHeight": 40
      },
      "chartCursor": {
         "limitToGraph":"g1"
      },
      "categoryField": "date",
      "categoryAxis": {
          "parseDates": true,
          "minPeriod": "ss",//seconds
          // "dateFormats": [{period:'ss',format:'JJ:NN:SS'}],
          "axisColor": "#DADADA",
          "dashLength": 1,
          "minorGridEnabled": true
      },
      "export": {
          "enabled": true
      }
    }
  },
  "loadavg": {
    "class": "line",
    "interval": 5000,
    // "init": function(chart, data){
    //   /**
    //   * zoom on mousedown/mouseup
    //   * https://www.amcharts.com/kbase/setting-zoomed-event-fire-actual-zoom-finishes/
    //   */
    //   let zoomChart = function () {
    //     // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    //     chart.zoomToIndexes(data.length - 40, data.length - 1);
    //   }
    //   chart.addListener("rendered", zoomChart);
    //   zoomChart();
    // },
    "option": {
      "path": "dist/amcharts/",
      "type": "serial",
      "theme": "light",
      "marginRight": 80,
      "autoMarginOffset": 20,
      "marginTop": 7,
      "dataProvider": [],
      "valueAxes": [{
          "axisAlpha": 0.2,
          "dashLength": 1,
          "position": "left"
      }],
      "mouseWheelZoomEnabled": true,
      "graphs": [
        {
          "id": "g1",
          "balloonText": "[[value]]",
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "hideBulletsCount": 50,
          "title": "red line",
          "valueField": "value0",
          "useLineColorForBulletBorder": true,
          "balloon":{
              "drop":true
          }
        },
        {
          "id": "g2",
          "balloonText": "[[value]]",
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "hideBulletsCount": 50,
          "title": "red line",
          "valueField": "value1",
          "useLineColorForBulletBorder": true,
          "balloon":{
              "drop":true
          }
        },
        {
          "id": "g3",
          "balloonText": "[[value]]",
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "hideBulletsCount": 50,
          "title": "red line",
          "valueField": "value2",
          "useLineColorForBulletBorder": true,
          "balloon":{
              "drop":true
          }
        },
      ],
      "chartScrollbar": {
          "autoGridCount": true,
          "graph": "g1",
          "scrollbarHeight": 40
      },
      "chartCursor": {
         "limitToGraph":"g1"
      },
      "categoryField": "date",
      "categoryAxis": {
          "parseDates": true,
          "minPeriod": "ss",//seconds
          // "dateFormats": [{period:'ss',format:'JJ:NN:SS'}],
          "axisColor": "#DADADA",
          "dashLength": 1,
          "minorGridEnabled": true
      },
      "export": {
          "enabled": true
      }
    }
  },
  cpu: {
    "class": "gauge",
    "interval": 2000,
    "option": {
      // "startEffect": "bounce",
      "path": "dist/amcharts/",
      "theme": "light",
      "type": "gauge",
      "axes": [{
        "topTextFontSize": 20,
        "topTextYOffset": 70,
        "axisColor": "#31d6ea",
        "axisThickness": 1,
        "endValue": 100,
        // "gridInside": true,
        "inside": true,
        "radius": "50%",
        "valueInterval": 50,
        "tickColor": "#67b7dc",
        "startAngle": -90,
        "endAngle": 90,
        "unit": "%",
        "bandOutlineAlpha": 0,
        "bands": [{
          "color": "#0080ff",
          "endValue": 100,
          "innerRadius": "105%",
          "radius": "170%",
          "gradientRatio": [0.5, 0, -0.5],
          "startValue": 0
        }, {
          "color": "#3cd3a3",
          "endValue": 0,
          "innerRadius": "105%",
          "radius": "170%",
          "gradientRatio": [0.5, 0, -0.5],
          "startValue": 0
        }]
      }],
      "arrows": [{
        "alpha": 1,
        "innerRadius": "35%",
        "nailRadius": 0,
        "radius": "170%"
      }]
    }
  },
  mem: {
    "class": "gauge",
    "interval": 2000,
    "option": {
      // "startEffect": "bounce",
      "path": "dist/amcharts/",
      "theme": "light",
      "type": "gauge",
      "axes": [{
        "topTextFontSize": 20,
        "topTextYOffset": 70,
        "axisColor": "#31d6ea",
        "axisThickness": 1,
        "endValue": 100,
        // "gridInside": true,
        "inside": true,
        "radius": "50%",
        "valueInterval": 50,
        "tickColor": "#67b7dc",
        "startAngle": -90,
        "endAngle": 90,
        "unit": "%",
        "bandOutlineAlpha": 0,
        "bands": [{
          "color": "#0080ff",
          "endValue": 100,
          "innerRadius": "105%",
          "radius": "170%",
          "gradientRatio": [0.5, 0, -0.5],
          "startValue": 0
        }, {
          "color": "#3cd3a3",
          "endValue": 0,
          "innerRadius": "105%",
          "radius": "170%",
          "gradientRatio": [0.5, 0, -0.5],
          "startValue": 0
        }]
      }],
      "arrows": [{
        "alpha": 1,
        "innerRadius": "35%",
        "nailRadius": 0,
        "radius": "170%"
      }]
    }
  }
}
