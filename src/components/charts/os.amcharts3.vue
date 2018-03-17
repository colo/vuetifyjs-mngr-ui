<template>
  <!-- <div id="chartdiv" style="width: 100%; height: 400px;"></div> -->
  <div>
    <div v-for="(stat, name) in $options.stats" :key="name" :class="stat.class" :id="name">
      <!-- {{name}} -->
    </div>
  </div>
</template>

<script>

import 'amcharts3'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/themes/light';

import stats from './json/os.amcharts3'
// import net_stats from './json/net.echart.json'

export default {
  // name: 'App',
  name: 'osamcharts',

  uptime_chart: null,
  // net_stats: net_stats,
  components: {
    // IEcharts
  },
  props: {
    timestamps: {
      type: [Array],
      default: () => ([])
    },
    mem: {
      type: [Object],
      default: () => ({})
    },
    cpu: {
      type: [Object],
       default: () => ({})
    },
    uptime: {
      type: [Object],
      default: () => ({})
    },
    loadavg: {
      type: [Object],
      default: () => ({})
    },
    networkInterfaces: {
      type: [Object],
      default: () => ({})
    }
  },

  stats: stats,

  data () {
    return {
      charts : {},
      stats: {},
      // networkInterfaces_stats: {},
      // uptime_stats: []
    }
  },
  created () {
    // console.log(AmCharts)
    Object.each(this.$options.stats, function(stat, name){
      // console.log(name)

      // require('amcharts3/amcharts/'+stat.option.type)
      this.$set(this.stats, name, [])
      stat.option.dataProvider = this.stats[name]
      this.$set(this.charts, name, AmCharts.makeChart(name, stat.option))

      if(stat.init)
        stat.init(this.charts[name], this.stats[name])

    }.bind(this))

    // console.log('charts', this.charts)


  },
  watch: {
    // 'mem.percentage': function(val){
    //   // console.log('recived doc via prop mem', val)
    //
    //   if(this.stats.mem){
    //     let percentage = val.toFixed(1);
    //     // this.stats.mem.option.series[0].data = [{ 'value': percentage }]
    //   }
    // },
    // 'cpu.percentage': function(val){
    //
    //   // console.log('recived doc via prop cpu',this.cpu)
    //   // //console.log('recived doc via Event cpu', this.prev_cpu)
    //
    //   if(this.stats.cpu){//UI
		//     // this.stats.cpu.option.series[0].data = [{ 'value': val }]
    //   }
    //   // console.log('recived doc via prop cpu', this.stats.cpu.option.series[0].data)
		// },
    'uptime.value': function(val){

      // console.log('recived doc via prop uptime',val)

      let data = this.stats.uptime
      data.push({
        value: this.uptime.value,
        date: new Date(this.uptime.timestamp),
      })
      let length = data.length

      this.stats.uptime.splice(
        -this.timestamps.length -1,
        length - this.timestamps.length
      )

      this.charts.uptime.validateData();

      // console.log('recived doc via prop uptime',this.charts.uptime)

      //
      // // if(this.stats.uptime){
      //   // let data = JSON.parse(JSON.stringify(this.stats.uptime.option.series[0].data))
      //   // data.push({ 'value': doc });
      //   let data = this.stats.uptime.option.series[0].data
      //   data.push({ 'value': val })
      //
      //   let length = data.length
      //   this.stats.uptime.option.series[0].data.splice(
      //     -this.timestamps.length -1,
      //     length - this.timestamps.length
      //   )
      //   // if(data.length > this.timestamps.length)
      //     // this.stats.uptime.option.series[0].data = data.slice(-this.timestamps.length)
      //
      //   // console.log(JSON.parse(JSON.stringify(this.stats.uptime.option.series[0].data)));
      //
      //   // this.stats.uptime.option.series[0].data = data
      //   this.stats.uptime.option.xAxis.data = this.formated_timestamps; //columns
      // // }
    },
    'loadavg.value': function(val){
      // console.log('recived doc via prop loadavg',val)
      let data = this.stats.loadavg

      let values = { date: new Date(this.loadavg.timestamp) }

      Array.each(this.charts.loadavg.graphs, function(graph, index){
        let valueField = graph.valueField
        values[valueField] = this.loadavg.value[index]
      }.bind(this))
      
      data.push(values)

      let length = data.length

      this.stats.loadavg.splice(
        -this.timestamps.length -1,
        length - this.timestamps.length
      )


      this.charts.loadavg.validateData();

      console.log('recived doc via prop uptime',this.charts.uptime)

      // if(this.stats.loadavg){
      //   //three series of data, each for a load messure
      //   Array.each(val, function (load, index) {
      //
      //     let data = this.stats.loadavg.option.series[index].data
      //     data.push({ 'value': load })
      //
      //     let length = data.length
      //     this.stats.loadavg.option.series[index].data.splice(
      //       -this.timestamps.length -1,
      //       length - this.timestamps.length
      //     )
      //   }.bind(this))
      //
      //   this.stats.loadavg.option.xAxis.data = this.formated_timestamps; //columns
      //   // //console.log('---loadavg---',this.stats.loadavg.option.series)
      // }
    },
    // 'networkInterfaces.value': function(val){
    //   let self = this
    //
    //   let ifaces = Object.keys(val)
    //   let properties = Object.keys(val[ifaces[0]])
    //   let messures = Object.keys(val[ifaces[0]][properties[1]])//properties[0] is "if", we want recived | trasmited
    //
    //
    //   // console.log('ifaces: ', ifaces)
    //   // console.log('properties: ', properties)
    //   // console.log('messures: ', messures)
    //
    //   Array.each(ifaces, function(iface){
    //     if(!self.networkInterfaces_stats[iface])
    //       self.$set(self.networkInterfaces_stats, iface, {})
    //
    //     /**
    //     * turn data property->messure (ex: transmited { bytes: .. }),
    //     * to: messure->property (ex: bytes {trasmited:.., recived: ... })
    //     **/
    //     Array.each(messures, function(messure){// "bytes" | "packets"
    //       if(!self.networkInterfaces_stats[iface][messure])
    //         self.$set(self.networkInterfaces_stats[iface], messure, self.$options.net_stats.option)
    //         // self.networkInterfaces_stats[iface][messure] = self.$options.net_stats.option
    //         // self.networkInterfaces_stats[iface][messure] =  { option: self.$options.net_stats.option }
    //
    //         self.networkInterfaces_stats[iface][messure].title.text = iface
    //         self.networkInterfaces_stats[iface][messure].title.subtext = messure
    //         self.networkInterfaces_stats[iface][messure].xAxis[0].data = self.formated_timestamps
    //
    //
    //         Array.each(properties, function(property){// "recived" | "transmited"
    //           if(property == 'recived' || property == 'transmited'){
    //
    //             let current = val[iface][property][messure]
    //             let prev = self.networkInterfaces.prev.value[iface][property][messure]
    //             let data = current - prev + 0
    //
    //             if(messure == 'bytes')
    //               data = data / 1024
    //             // let serie = {}
    //
    //             let option = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure]))
    //
    //             if(property == 'recived'){
    //               option.series[0].data.push(data)
    //               option.series[0].data = option.series[0].data.slice(-self.seconds)
    //               // serie = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].option.series[0]))
    //             }
    //             else{
    //               option.series[1].data.push(data)
    //               option.series[1].data = option.series[1].data.slice(-self.seconds)
    //               // serie = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].option.series[1]))
    //             }
    //
    //             self.networkInterfaces_stats[iface][messure] = option
    //
    //             // if(messure == "bytes" && iface == 'brkvm'){
    //             //   console.log('self.networkInterfaces_stats iface', iface)
    //             //   console.log('self.networkInterfaces_stats messure', messure)
    //             //   console.log('self.networkInterfaces_stats property', property)
    //             //   console.log('self.networkInterfaces_stats value', current )
    //             //   console.log('self.networkInterfaces_stats prev', prev )
    //             //   console.log('self.networkInterfaces_stats DATA', data )
    //             //   console.log('self.networkInterfaces_stats SERIE', option )
    //             // }
    //
    //           }
    //         })
    //
    //     })
    //
    //   })
    //
    //
    //   // console.log('self.networkInterfaces_stats', self.networkInterfaces_stats)
    //
    // },
  },
  computed: {
    formated_timestamps: function(){
      return this.format_timestamps(this.timestamps)
    }
  },
  methods: {
    format_timestamps(timestamps){

      let formated = []
      Array.each(timestamps, function(timestamp, index){

        let start = '';
        let end = '';
        let date = new Date(timestamp);

        // if(index == 0 || index == this.columns.length - 1){
        if(index == 0 || index == timestamps.length - 1){
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

        // //console.log('---timestamps---',formated)
      })

      // //console.log('---timestamps---',formated)
      return formated;

    }

  },
}
</script>

<style scoped>
/* #chartdiv {
	width	: 100%;
	height	: 500px;
} */
.line {
  width: '80%';
  height: 300px;
}

</style>
