<template>
  <div>
    <!-- each iface has stats  -->
    <template v-for="(stat, iface) in networkInterfaces_stats">
      <!-- each stat is an "option" obj, for eChart  -->
      <!-- <template v-if="iface == 'lo'"> -->
        <div
         v-for="(option, messure) in stat"
         v-if="messure == 'bytes' || messure == 'packets'"
         :id="iface+'-'+messure"
         :key="iface+'-'+messure"
         :class="$options.net_stats.class"
         >
         <!-- {{iface+'-'+messure}} -->
       </div>
     <!-- </template> -->
   </template>
   <!-- v-if="messure == 'packets'" -->
<!-- v-if="messure == 'bytes' || messure == 'packets'" -->

   <!-- stats -->

    <!--
    - Dynamic components:
    - https://forum.vuejs.org/t/render-components-with-dynamic-names/14153
    -->

    <template v-for="(stat, name) in $options.stats">
      <!-- {{name}} -->
      <stat.type v-bind="stat.option" :is="stat.type" :class="stat.class" :id="name" :ref="name" :data="stats[name].data"/>
    </template>

  </div>
</template>

<script>

import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import Vue from 'vue'

Vue.use(VueChartkick, { Chartkick })

import stats from './json/os.chartkick'
// import net_stats from './json/net.chartkick'

export default {
  // name: 'App',
  name: 'oschartkick',

  // uptime_chart: null,
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
  // net_stats: net_stats,

  data () {
    return {
      charts : {},
      stats: {},
      networkInterfaces_stats: {},
      networkInterfaces_charts: {},
      // uptime_stats: []
    }
  },
  created () {
    Object.each(this.$options.stats, function(stat, name){
        this.$set(this.stats, name, {lastupdate: 0, data: [] })

    }.bind(this))
  },
  mounted () {
    Object.each(this.$options.stats, function(stat, name){
      console.log(this.stats[name].data)


      // if(document.getElementById(name)){
      // this.$set(this.$refs[name][0], 'data', this.stats[name].data)
      //   // this.$refs[name][0].data = []
        console.log(this.$refs[name])
      //
      // }
    }.bind(this))

    // this.stats.cpu.data.push(['Blueberry', 44], ['Strawberry', 23])
    //
    // // console.log(this.$children)
    // this.stats.uptime.data = {'2017-05-13': 2, '2017-05-14': 5}
    // this.$refs['uptime'][0].data = {'2017-05-13': 2, '2017-05-14': 5}
    // document.getElementById('uptime').data = {'2017-05-13': 2, '2017-05-14': 5}

    // Object.each(this.$options.stats, function(stat, name){
    //   // ////console.log(name)
    //
    //   // require('amcharts3/amcharts/'+stat.option.type)
    //   this.$set(this.stats, name, {lastupdate: 0, data: []})
    //   stat.option.dataProvider = this.stats[name].data
    //   this.$set(this.charts, name, AmCharts.makeChart(name, stat.option))
    //
    //   if(stat.init)
    //     stat.init(this.charts[name], this.stats[name])
    //
    // }.bind(this))


  },

  watch: {
    'mem.percentage': function(val){
      // if(this.stats.mem.lastupdate < Date.now() - this.$options.stats.mem.interval){

        val = val.toFixed(2)
        this.stats.mem.data = [['Used', val], ['Free', 100 - val]]

      //
      //   this.charts.mem.arrows[0].setValue(val);
      //   this.charts.mem.axes[0].setTopText(val + " %");
      //
      //   // adjust darker band to new value
      //   this.charts.mem.axes[0].bands[1].setEndValue(val);
      //
      //   this.stats.mem.lastupdate = Date.now()
      // }
    },
    'cpu.percentage': function(val){

      // if(this.stats.cpu.lastupdate < Date.now() - this.$options.stats.cpu.interval){
      //

        val = val.toFixed(2)
        this.stats.cpu.data = [['Used', val], ['Free', 100 - val]]

      //   this.charts.cpu.arrows[0].setValue(val);
      //   this.charts.cpu.axes[0].setTopText(val + " %");
      //
      //   // adjust darker band to new value
      //   this.charts.cpu.axes[0].bands[1].setEndValue(val);
      //
      //   this.stats.cpu.lastupdate = Date.now()
      // }


		},
    'uptime.value': function(val){

      let data = this.stats.uptime.data
      data.push([new Date(this.uptime.timestamp), val])
      let length = data.length

      this.stats.uptime.data.splice(
        -this.timestamps.length -1,
        length - this.timestamps.length
      )
      //
      // if(this.stats.uptime.lastupdate < Date.now() - this.$options.stats.uptime.interval){
      //   // this.charts.uptime.validateData();
      //   this.queueDataUpdate(this.charts.uptime)//no need to pass data param
      //
      //   this.stats.uptime.lastupdate = Date.now()
      // }


    },
    'loadavg.value': function(val){

      let data = this.stats.loadavg.data

      // let values = { date: new Date(this.loadavg.timestamp) }

      // Array.each(this.charts.loadavg.graphs, function(graph, index){
      //   let valueField = graph.valueField
      //   values[valueField] = this.loadavg.value[index]
      // }.bind(this))

      Array.each(val, function(loadavg, index){

        let load = data[index]
        if(!load){
          load = { data: [] }
        }

        load.data.push([new Date(this.loadavg.timestamp), loadavg])

        let length = load.data.length
        load.data.splice(
          -this.timestamps.length -1,
          length - this.timestamps.length
        )

        Vue.set(data, index, load)
      }.bind(this))




      // this.stats.loadavg.data.splice(
      //   -this.timestamps.length -1,
      //   length - this.timestamps.length
      // )

      // if(this.stats.loadavg.lastupdate < Date.now() - this.$options.stats.loadavg.interval){
      //   // https://www.amcharts.com/kbase/preserving-zoom-serial-chart-across-data-updates/
      //   // "zoomed" will be called after data update so we need to ignore the next call for it
      //   this.charts.ignoreZoomed = true;
      //
      //   // this.charts.loadavg.validateData();
      //   this.queueDataUpdate(this.charts.loadavg)//no need to pass data param
      //
      //   this.stats.loadavg.lastupdate = Date.now()
      // }



    },
    'networkInterfaces.value': function(val){
      // let self = this
      //
      // let ifaces = Object.keys(val)
      // let properties = Object.keys(val[ifaces[0]])
      // let messures = Object.keys(val[ifaces[0]][properties[1]])//properties[0] is "if", we want recived | transmited
      //
      //
      // Array.each(ifaces, function(iface){
      //   if(!self.networkInterfaces_stats[iface])
      //     self.$set(self.networkInterfaces_stats, iface, {})
      //
      //   /**
      //   * turn data property->messure (ex: transmited { bytes: .. }),
      //   * to: messure->property (ex: bytes {transmited:.., recived: ... })
      //   **/
      //   Array.each(messures, function(messure){// "bytes" | "packets"
      //     if(!self.networkInterfaces_stats[iface][messure])
      //       self.networkInterfaces_stats[iface][messure] = { lastupdate: 0, data: [] }
      //
      //       Array.each(properties, function(property){// "recived" | "transmited"
      //         if(property == 'recived' || property == 'transmited'){
      //
      //           let current = val[iface][property][messure]
      //           let prev = self.networkInterfaces.prev.value[iface][property][messure]
      //           let data = current - prev + 0
      //
      //           if(messure == 'bytes')
      //             data = data / 1024
      //           // let serie = {}
      //
      //           // let copy = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure]))
      //           let copy = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].data))
      //
      //           let value = copy.getLast()
      //           if(value == null){//no data yet
      //             value = {}
      //           }
      //
      //           value[property] = data
      //
      //           let timestamp = JSON.parse(JSON.stringify(self.networkInterfaces.timestamp + 0))
      //
      //           if(!value['date'] || value['date'] != timestamp){
      //             value['date'] =  timestamp
      //             copy.push(value)
      //           }
      //
      //           let length = copy.length
      //
      //           copy.splice(
      //             -self.timestamps.length -1,
      //             length - self.timestamps.length
      //           )
      //
      //           self.networkInterfaces_stats[iface][messure].data = JSON.parse(JSON.stringify(copy))
      //
      //         }
      //       })
      //
      //
      //   })
      //
      // })
      //
      //
      //
      //   Object.each(this.networkInterfaces_stats, function(stat, iface){
      //     Object.each(stat, function(value, messure){
      //
      //
      //       if(document.getElementById(iface+'-'+messure)){
      //
      //         if(!this.networkInterfaces_charts[iface+'-'+messure]){
      //           //console.log('---validatin---', iface+'-'+messure)
      //
      //           let option = JSON.parse(JSON.stringify(this.$options.net_stats.option))
      //           Array.each(option.valueAxes, function(axis, index){
      //             axis.id = iface+'-'+messure+'-'+axis.id
      //             option.graphs[index].valueAxis = axis.id
      //           })
      //
      //           this.$set(this.networkInterfaces_charts, iface+'-'+messure, AmCharts.makeChart(iface+'-'+messure, option))
      //
      //           if(this.$options.net_stats.init)
      //             this.$options.net_stats.init(this.networkInterfaces_charts[iface+'-'+messure], this.networkInterfaces_stats[iface][messure])
      //         }
      //         // else{
      //
      //         if(value.lastupdate < Date.now() - this.$options.net_stats.interval){
      //           // this.networkInterfaces_charts[iface+'-'+messure].dataProvider = value.data
      //           // this.networkInterfaces_charts[iface+'-'+messure].validateData()
      //           this.queueDataUpdate(this.networkInterfaces_charts[iface+'-'+messure], value.data)
      //
      //           value.lastupdate = Date.now()
      //         }
      //       }
      //
      //     }.bind(this))
      //   }.bind(this))

    },
  },
  computed: {
    // formated_timestamps: function(){
    //   return this.format_timestamps(this.timestamps)
    // }
  },
  methods: {


    // format_timestamps(timestamps){
    //
    //   let formated = []
    //   Array.each(timestamps, function(timestamp, index){
    //
    //     let start = '';
    //     let end = '';
    //     let date = new Date(timestamp);
    //
    //     // if(index == 0 || index == this.columns.length - 1){
    //     if(index == 0 || index == timestamps.length - 1){
    //       date = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    //     }
    //     // else if(){
    //     //   date = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    //     // }
    //     else{
    //       let seconds = date.toLocaleTimeString([], {second:'2-digit'})
    //       if(seconds == '0'){
    //         date = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    //       }
    //       else{
    //         date = seconds
    //       }
    //
    //     }
    //
    //     formated[index] = date;
    //
    //     // //////console.log('---timestamps---',formated)
    //   })
    //
    //   // //////console.log('---timestamps---',formated)
    //   return formated;
    //
    // }

  },
}
</script>

<style scoped>

.line {
  width: '80%';
  height: 300px;
}
.gauge {
  width: 200px;
  height: 200px;
}
</style>
