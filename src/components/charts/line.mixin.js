// import IEcharts from 'vue-echarts-v3/src/full.js';
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/chart/line'
// import 'echarts/lib/component/title'

export default {

  // name: 'chart-line',
  components: {
    IEcharts
  },
  props: {
    title: {
			type: [String, Object],
			default: () => ({ text: '' })
		},
    series: {
			type: [String, Array, Object],
			default: () => ([])
		},
    columns: {
			type: [String, Array],
      default: () => ([])
		},

    // name: {
		// 	type: [String],
		// 	 default: () => ('usage')
		// },
	},
  data: () => ({
    loading: true,
    line: {
      title: {
          text: 'something'
      },
      xAxis: {
          type: 'category',
          // type: 'time',
          splitLine: {
              show: false
          },
          data: [] //columns
      },
      yAxis: {
          type: 'value',
          // boundaryGap: [0, '100%'],
          splitLine: {
              show: false
          }
      },
      series: []

		}
  }),
  watch: {
    series: function (val) {
      console.log('App series doc', val)

			if(typeof(val) == 'string')
				val = JSON.parse(val)

			this.loading = !this.loading;

      // this.line.xAxis.data = this.format_timestamps(this.columns);
      if(typeof(val[0]) == 'object'){//means is an array of series of data, or an array of "series" objects

        this.line.series = [];

        Array.each(val, function(row, row_index){

          // console.log('App series row', row)

          let index = row_index;

          if(Array.isArray(row)){//an array of series of data
            Array.each(row, function(data, data_index){

							//console.log('App series data', data)

							if(!this.line.series[data_index])
								this.line.series[data_index] = JSON.parse(JSON.stringify(this.defaults.serie)) //dirty object cloning, no reference


							//console.log('App series data index', data_index)
							//console.log('App series row index', index)
							this.line.series[data_index].data[index] = data + 0;

						}.bind(this))
          }
          else{//an object compatible with "series"
            // console.log('App series doc', row)

            this.line.series.push(row)
          }

        }.bind(this))


      }
      else{//means values are simple types likes int or strings
        if(!this.line.series[0])
          this.line.series.push(this.defaults.serie)

		     this.line.series[0].data = val;
      }


		},
		columns: function (val) {
			if(typeof(val) == 'string')
				val = JSON.parse(val)

			this.loading = !this.loading;


      this.line.xAxis.data = this.format_timestamps(val);

			// console.log('App columns', this.line.xAxis.data)

		},

	},
	mounted () {
		this.defaults = {
      serie: {
          data: [],//rows
          type: 'line',
          smooth: true,
          showSymbol: true,
          hoverAnimation: false,
      }
    }

    if(typeof(this.title) != 'object'){
      this.line.title = { text: this.title }
    }
    else{
      this.line.title = { text: this.title }
    }




  },
  methods: {
    format_timestamps(timestamps){
      let formated = []
      Array.each(timestamps, function(timestamp, index){
        let start = '';
        let end = '';
        let date = new Date(timestamp);

        if(index == 0 || index == this.columns.length - 1){
          date = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        }
        // else if(){
        //   date = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        // }
        else{
          let seconds = date.toLocaleTimeString([], {second:'2-digit'})
          if(seconds == '0'){
            date = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
          }
          else{
            date = seconds
          }

        }

        formated[index] = date;

      }.bind(this))

      return formated;

    },
    onReady(instance, ECharts) {
      // console.log(instance, ECharts);
    },
    onClick(event, instance, ECharts) {
      // console.log(arguments);
    }
  }
};
