export default {
  "uptime": {
    "class": "line",
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
  }
}
