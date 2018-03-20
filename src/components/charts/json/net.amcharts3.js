export default {
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
    "valueAxes": [
      {
        "id": "transmited",
        "axisAlpha": 0.2,
        "dashLength": 1,
        "position": "left"
      },
      {
        "id": "recived",
        "axisAlpha": 0.2,
        "dashLength": 1,
        "position": "right",
        "reversed": true,
        // "offset": -200
      }
    ],
    "mouseWheelZoomEnabled": true,
    "graphs": [
      {
        "id": "g1",
        "valueAxis": "transmited",
        "balloonText": "[[value]]",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "title": "red line",
        "valueField": "transmited",
        "useLineColorForBulletBorder": true,
        "balloon":{
            "drop":true
        }
      },
      {
        "id": "g2",
        "valueAxis": "recived",
        "balloonText": "[[value]]",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "title": "red line",
        "valueField": "recived",
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
