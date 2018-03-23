export default {
  "class": "line",
  "style": "width:95%; height:250px;",
  "interval": 0,
  "options": {
    // drawPoints: true,
    showRoller: true,
    // valueRange: [0.0, 1.2],
    labels: ['Date', 'OUT', 'IN'],
    axis : {
      x : {
        // valueFormatter: Dygraph.dateString_,
        valueFormatter: function(x){
          console.log('valueFormatter',x)
          return x
        },
        valueParser: function(x) {
          console.log('valueParser',x)
          return x
        },
        // ticker: Dygraph.dateTicker
      }
    }
  }
}
