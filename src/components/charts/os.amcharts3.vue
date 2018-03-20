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
    <div v-for="(stat, name) in $options.stats" :key="name" :class="stat.class" :id="name">
      <!-- {{name}} -->
    </div>

  </div>
</template>

<script>

import 'amcharts3'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/gauge'
import 'amcharts3/amcharts/themes/light';

import stats from './json/os.amcharts3'
import net_stats from './json/net.amcharts3'

export default {
  // name: 'App',
  name: 'osamcharts',

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
  net_stats: net_stats,

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
    // ////console.log(AmCharts)
    Object.each(this.$options.stats, function(stat, name){
      // ////console.log(name)

      // require('amcharts3/amcharts/'+stat.option.type)
      this.$set(this.stats, name, {lastupdate: 0, data: []})
      stat.option.dataProvider = this.stats[name].data
      this.$set(this.charts, name, AmCharts.makeChart(name, stat.option))

      if(stat.init)
        stat.init(this.charts[name], this.stats[name])

    }.bind(this))

    // ////console.log('this.networkInterfaces',this.networkInterfaces)

    // Object.each(this.$networkInterfaces, function(stat, name){
    //
    //   this.$set(this.stats, name, {lastupdate: 0, data: []})
    //   stat.option.dataProvider = this.stats[name].data
    //   this.$set(this.charts, name, AmCharts.makeChart(name, stat.option))
    //
    //   if(stat.init)
    //     stat.init(this.charts[name], this.stats[name])
    //
    // }.bind(this))

  },
  // updated () {
  //   /**
  //   * networkInterfaces
  //   **/
  //   //console.log('this.networkInterfaces.ifaces', JSON.parse(JSON.stringify(this.networkInterfaces.value)))
  //   let ifaces = Object.keys(this.networkInterfaces.value)
  //   let properties = Object.keys(this.networkInterfaces.value[ifaces[0]])
  //   let messures = Object.keys(this.networkInterfaces.value[ifaces[0]][properties[1]])//properties[0] is "if", we want recived | transmited
  //
  //
  //   ////console.log('ifaces: ', ifaces)
  //   ////console.log('properties: ', properties)
  //   ////console.log('messures: ', messures)
  //
  //   /**
  //   * networkInterfaces
  //   **/
  // },
  watch: {
    'mem.percentage': function(val){
      if(this.stats.mem.lastupdate < Date.now() - this.$options.stats.mem.interval){
        val = val.toFixed(2)

        this.charts.mem.arrows[0].setValue(val);
        this.charts.mem.axes[0].setTopText(val + " %");

        // adjust darker band to new value
        this.charts.mem.axes[0].bands[1].setEndValue(val);

        this.stats.mem.lastupdate = Date.now()
      }
      // // ////console.log('recived doc via prop mem', val)
      //
      // if(this.stats.mem){
      //   let percentage = val.toFixed(1);
      //   // this.stats.mem.option.series[0].data = [{ 'value': percentage }]
      // }
    },
    'cpu.percentage': function(val){
      // ////console.log('recived doc via prop cpu',val)
      // //////console.log('recived doc via Event cpu', this.prev_cpu)
      if(this.stats.cpu.lastupdate < Date.now() - this.$options.stats.cpu.interval){

        val = val.toFixed(2)
        this.charts.cpu.arrows[0].setValue(val);
        this.charts.cpu.axes[0].setTopText(val + " %");

        // adjust darker band to new value
        this.charts.cpu.axes[0].bands[1].setEndValue(val);

        this.stats.cpu.lastupdate = Date.now()
      }

      // ////console.log('recived doc via prop cpu', this.stats.cpu.option.series[0].data)
		},
    'uptime.value': function(val){

      // ////console.log('recived doc via prop uptime',val)

      let data = this.stats.uptime.data
      data.push({
        value: this.uptime.value,
        date: new Date(this.uptime.timestamp),
      })
      let length = data.length

      this.stats.uptime.data.splice(
        -this.timestamps.length -1,
        length - this.timestamps.length
      )

      if(this.stats.uptime.lastupdate < Date.now() - this.$options.stats.uptime.interval){
        this.charts.uptime.validateData();

        this.stats.uptime.lastupdate = Date.now()
      }


    },
    'loadavg.value': function(val){
      // ////console.log('recived doc via prop loadavg',val)
      let data = this.stats.loadavg.data

      let values = { date: new Date(this.loadavg.timestamp) }

      Array.each(this.charts.loadavg.graphs, function(graph, index){
        let valueField = graph.valueField
        values[valueField] = this.loadavg.value[index]
      }.bind(this))

      data.push(values)

      let length = data.length

      this.stats.loadavg.data.splice(
        -this.timestamps.length -1,
        length - this.timestamps.length
      )

      if(this.stats.loadavg.lastupdate < Date.now() - this.$options.stats.loadavg.interval){
        // https://www.amcharts.com/kbase/preserving-zoom-serial-chart-across-data-updates/
        // "zoomed" will be called after data update so we need to ignore the next call for it
        this.charts.ignoreZoomed = true;

        this.charts.loadavg.validateData();

        this.stats.loadavg.lastupdate = Date.now()
      }

      // //console.log('recived doc via prop loadavg',this.charts.loadavg)


    },
    'networkInterfaces.value': function(val){
      let self = this

      let ifaces = Object.keys(val)
      let properties = Object.keys(val[ifaces[0]])
      let messures = Object.keys(val[ifaces[0]][properties[1]])//properties[0] is "if", we want recived | transmited


      // //console.log('ifaces: ', ifaces)
      // //console.log('properties: ', properties)
      // //console.log('messures: ', messures)

      Array.each(ifaces, function(iface){
        if(!self.networkInterfaces_stats[iface])
          self.$set(self.networkInterfaces_stats, iface, {})

        /**
        * turn data property->messure (ex: transmited { bytes: .. }),
        * to: messure->property (ex: bytes {transmited:.., recived: ... })
        **/
        Array.each(messures, function(messure){// "bytes" | "packets"
          if(!self.networkInterfaces_stats[iface][messure])
            self.networkInterfaces_stats[iface][messure] = { lastupdate: 0, data: [] }
            // self.$set(self.networkInterfaces_stats[iface], messure, { lastupdate: 0, data: [] } )
            // self.$set(self.networkInterfaces_stats[iface], messure, { lastupdate: 0, "recived" : [], "transmited": [] } )
            // self.$set(self.networkInterfaces_stats[iface], messure, self.$options.net_stats.option)
            // // self.networkInterfaces_stats[iface][messure] = self.$options.net_stats.option
            // // self.networkInterfaces_stats[iface][messure] =  { option: self.$options.net_stats.option }
            //
            // self.networkInterfaces_stats[iface][messure].title.text = iface
            // self.networkInterfaces_stats[iface][messure].title.subtext = messure
            // self.networkInterfaces_stats[iface][messure].xAxis[0].data = self.formated_timestamps

            // //console.log('self.networkInterfaces_stats', JSON.parse(JSON.stringify(self.networkInterfaces_stats)))

            Array.each(properties, function(property){// "recived" | "transmited"
              if(property == 'recived' || property == 'transmited'){

                let current = val[iface][property][messure]
                let prev = self.networkInterfaces.prev.value[iface][property][messure]
                let data = current - prev + 0

                if(messure == 'bytes')
                  data = data / 1024
                // let serie = {}

                // let copy = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure]))
                let copy = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].data))

                // //console.log('self.networkInterfaces_stats', val)
                // //console.log('self.networkInterfaces_stats', property)
                // //console.log('self.networkInterfaces_stats', iface)
                // //console.log('self.networkInterfaces_stats', JSON.parse(JSON.stringify(copy)))

                // copy[property].push(data)

                let value = copy.getLast()
                if(value == null){//no data yet
                  value = {}
                }

                // if(!value['date'])
                //   value['date'] = new Date(self.networkInterfaces.timestamp)
                //
                // if(!value[property])
                value[property] = data

                // if(Object.keys(value).length == 2)//date + a property
                //   copy.push(value)
                let timestamp = JSON.parse(JSON.stringify(self.networkInterfaces.timestamp + 0))

                if(!value['date'] || value['date'] != timestamp){
                  // if(!value['date']){
                    //console.log('---seting date---', iface, messure, property, timestamp)
                    value['date'] =  timestamp
                  // }

                  copy.push(value)
                }



                // let length = copy[property]
                //
                // copy[property].splice(
                //   -self.timestamps.length -1,
                //   length - self.timestamps.length
                // )
                let length = copy.length

                copy.splice(
                  -self.timestamps.length -1,
                  length - self.timestamps.length
                )

                self.networkInterfaces_stats[iface][messure].data = JSON.parse(JSON.stringify(copy))
                // if(property == 'recived'){
                //   copy.series[0].data.push(data)
                //   // option.series[0].data = option.series[0].data.slice(-self.seconds)
                //   // // serie = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].option.series[0]))
                // }
                // else{
                //   // option.series[1].data.push(data)
                //   // option.series[1].data = option.series[1].data.slice(-self.seconds)
                //   // // serie = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].option.series[1]))
                // }

                // self.networkInterfaces_stats[iface][messure] = option

                // if(messure == "bytes" && iface == 'brkvm'){
                //   ////console.log('self.networkInterfaces_stats iface', iface)
                //   ////console.log('self.networkInterfaces_stats messure', messure)
                //   ////console.log('self.networkInterfaces_stats property', property)
                //   ////console.log('self.networkInterfaces_stats value', current )
                //   ////console.log('self.networkInterfaces_stats prev', prev )
                //   ////console.log('self.networkInterfaces_stats DATA', data )
                //   ////console.log('self.networkInterfaces_stats SERIE', option )
                // }

              }
            })

            // if(self.networkInterfaces_charts[iface+'-'+messure]){
            //   // //console.log('---validatin---',self.networkInterfaces_charts[iface+'-'+messure])
            //   self.networkInterfaces_charts[iface+'-'+messure].validateData()
            // }

        })

      })


      // if(self.networkInterfaces_charts.length == 0){
      //   Object.each(self.networkInterfaces_stats, function(stat, name){
      //     // this.$set(this.stats, name, {lastupdate: 0, data: []})
      //     stat.option.dataProvider = self.networkInterfaces_stats[name].data
      //     this.$set(this.networkInterfaces_charts, name, AmCharts.makeChart(name, self.$options.net_stats.option))
      //
      //     if(self.$options.net_stats.init)
      //       self.$options.net_stats.init(this.networkInterfaces_charts[name], this.networkInterfaces_stats[name])
      //
      //   }.bind(this))
      // }

      // if(Object.keys(this.networkInterfaces_charts).length < Object.keys(this.networkInterfaces_stats).length ){
      //
      //   //console.log('iface-messure',Object.keys(this.networkInterfaces_charts))
      //   //console.log('iface-messure',Object.keys(this.networkInterfaces_stats))

        Object.each(this.networkInterfaces_stats, function(stat, iface){
          Object.each(stat, function(value, messure){

            // this.$set(this.stats, name, {lastupdate: 0, data: []})
            // stat.option.dataProvider = this.stats[name].data

            if(document.getElementById(iface+'-'+messure)){

              if(!this.networkInterfaces_charts[iface+'-'+messure]){
                //console.log('---validatin---', iface+'-'+messure)

                let option = JSON.parse(JSON.stringify(this.$options.net_stats.option))
                Array.each(option.valueAxes, function(axis, index){
                  axis.id = iface+'-'+messure+'-'+axis.id
                  option.graphs[index].valueAxis = axis.id
                })

                this.$set(this.networkInterfaces_charts, iface+'-'+messure, AmCharts.makeChart(iface+'-'+messure, option))
                // this.networkInterfaces_charts[iface+'-'+messure] = AmCharts.makeChart(iface+'-'+messure, this.$options.net_stats.option)


                if(this.$options.net_stats.init)
                  this.$options.net_stats.init(this.networkInterfaces_charts[iface+'-'+messure], this.networkInterfaces_stats[iface][messure])
              }
              // else{

              if(value.lastupdate < Date.now() - this.$options.net_stats.interval){
                this.networkInterfaces_charts[iface+'-'+messure].dataProvider = value.data
                this.networkInterfaces_charts[iface+'-'+messure].validateData()

                value.lastupdate = Date.now()
              }



              // }
                // if(self.networkInterfaces_charts[iface+'-'+messure]){
                //   // //console.log('---validatin---',self.networkInterfaces_charts[iface+'-'+messure])
                //   self.networkInterfaces_charts[iface+'-'+messure].validateData()
                // }
            }

          }.bind(this))
        }.bind(this))
      // }

      //console.log('self.networkInterfaces', self.networkInterfaces)
      //console.log('self.networkInterfaces_stats', self.networkInterfaces_stats)
      //console.log('self.networkInterfaces_charts', self.networkInterfaces_charts)

    },
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

        // //////console.log('---timestamps---',formated)
      })

      // //////console.log('---timestamps---',formated)
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
.gauge {
  width: 400px;
  height: 400px;
}
</style>
