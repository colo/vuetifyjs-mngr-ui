<template>
  <div class="echarts">
    <IEcharts
      :option="line"
    />
			<!--
			:loading="loading"
      @ready="onReady"
      @click="onClick"
      -->
  </div>
</template>

<script type="text/babel">
  // import IEcharts from 'vue-echarts-v3/src/full.js';
  import IEcharts from 'vue-echarts-v3/src/lite.js'
  import 'echarts/lib/chart/line'
  // import 'echarts/lib/component/title'

  export default {
    name: 'chart-line',
    components: {
      IEcharts
    },
    props: {
      rows: {
				type: [String, Array],
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
        xAxis: {//columns
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [],//rows
            type: 'line',
            smooth: true
        }]
				// tooltip : {
				// 		formatter: "{a} <br/>{b} : {c}%"
				// },
				// toolbox: {
				// 		feature: {
				// 				restore: {},
				// 				saveAsImage: {}
				// 		}
				// },
				// series: [
				// 		{
				// 				// name: 'mem usage',
				// 				type: 'line',
				// 				detail: {formatter:'{value}%'},
				// 				data: []
				// 		}
				// ]
			}
    }),
    watch: {
      rows: function (val) {
				if(typeof(val) == 'string')
					val = JSON.parse(val)

				this.loading = !this.loading;

        this.line.series[0].data = val;
        // console.log('App rows', this.line.series[0].data)

			},
			columns: function (val) {
				if(typeof(val) == 'string')
					val = JSON.parse(val)

				this.loading = !this.loading;


        this.line.xAxis.data = this.format_timestamps(val);

				// console.log('App columns', this.line.xAxis.data)

			},
      // name: function (val) {
			// 	this.line.series[0].name = val;
			// 	// console.log('App columns', this.line.series[0].data)
      //
			// },
		},
		mounted () {

      if(typeof(this.columns) == 'string')
				this.columns = JSON.parse(this.columns)

      if(typeof(this.rows) == 'string')
				this.rows = JSON.parse(this.rows)
			// // console.log(this.columns)

      // this.columns = this.format_timestamps(this.columns)

      // this.line.xAxis.data = this.format_timestamps(this.columns);
			this.line.series[0].data = this.rows;


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
</script>

<style scoped>
  .echarts {
    width: 800px;
    height: 300px;
  }
</style>
