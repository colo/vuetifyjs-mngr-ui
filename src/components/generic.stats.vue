<template>
  <div>
      <!-- <router-view :columns="columns"/> -->
      <!-- <div v-for="(iface, name) in networkInterfaces" :key="name">
        <chart-rainfall-waterfall
          :title="name"
          :columns="timestamps"
          :series="[iface.recived.bytes.serie, iface.transmited.bytes.serie]"
        />
        <chart-rainfall-waterfall
          :title="name"
          :columns="timestamps"
          :series="[iface.recived.packets.serie, iface.transmited.packets.serie]"
        />
      </div>
      <chart-line title="Load" :columns="timestamps" :series="loadavg"/>
      <chart-line title="Uptime" :columns="timestamps" :series="uptime"/>
       <gauge :columns="mem.columns"/>
       <gauge :columns="cpu.columns"/> -->
       <!-- <div v-for="(stat, name) in $options.stats" :key="name" :class="stat.class"> -->
       <!-- <template v-for="(stat, name) in stats">
         <template v-if="stat.length">
           <div v-for="(internalstat, index) in stat"
           :key="name + '-'+ index"
           :class="internalstat.class"
           >
             <IEcharts :option="internalstat.option"
             />
           </div>
         </template>
         <template v-else>
           <div :key="name" :class="stat.class">
           <IEcharts
             :option="stat.option"
           />
          </div>
         </template>
       </template> -->
       <template v-for="(stat, iface) in networkInterfaces"><!-- each iface has stats  -->
         <template v-for="(prop_value, property) in iface"><!-- stats maybe "recived" | "transmited" -->
           <template v-for="(messure_value, messure) in prop_value"><!--  those maybe "packets" | "bytes" -->
             <div v-if="property != 'if'"
              :key="iface+'-'+property+'-'+messure"
              :class="$options.net_stats.class">
               <IEcharts
                 :option="iface.option"
               />
             </div>
          </template>
         </template>
      </template>

       <div v-for="(stat, name) in stats" :key="name" :class="stat.class">
         <IEcharts
           :option="stat.option"
         />
      </div>

  </div>
</template>

<script>

import IEcharts from 'vue-echarts-v3/src/full.js';
import stats from './json/os.stats.json'
import net_stats from './json/net.stats.json'

// import gauge from '@/components/charts/gauge'
// import chartLine from '@/components/charts/line'
// import chartRainfallWaterfall from '@/components/charts/rainfall.waterfall'

export default {
  // name: 'App',
  name: 'osstats',

  net_stats: net_stats,

  components: {
    // gauge,
    // chartLine,
    // chartRainfallWaterfall
    IEcharts
  },
  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    name: {
      type: [String],
       default: () => ('usage')
    },
  },
  data () {
    return {
      stats: stats,
      seconds: 61, //define the N timestamps to show
			/**
			* mem
			*/
      timestamps: [],
      formated_timestamps: [],
      uptime: [],
      // loadavg: [],
      networkInterfaces: {},
			// mem: {
      //   columns: {'value': 0 },
      //   total: 0,
	    //   free: 0,
      // },
      cpu: {
        columns: {'value': 0 },
        total: 0,
        idle: 0,
        timestamp: 0,
      },
			/** **/

    }
  },
  mounted: function(){
    let self = this;

    this.EventBus.$on('timestamp', doc => {
			// console.log('recived doc via Event timestamp', doc)
      self.timestamps.push( doc );
      self.timestamps = self.timestamps.slice(-self.seconds)

		})

    this.EventBus.$on('networkInterfaces', doc => {
			console.log('recived doc via Event networkInterfaces', doc)

      // self.networkInterfaces = doc;

      Object.each(doc, function(iface, name){
        if(!self.networkInterfaces[name]){
          // self.networkInterfaces[name] = {}
          self.$set(self.networkInterfaces, name, { option: self.$options.net_stats }) //copy the net_stats template
        }

        Object.each(iface, function(values, property){
          if(!self.networkInterfaces[name][property]){
            // self.networkInterfaces[name][property] = {}
            self.$set(self.networkInterfaces[name], property, {})
          }

          if(property == 'recived' || property == 'transmited'){
            Object.each(values, function(value, messure){
              if(!self.networkInterfaces[name][property][messure]){
                // let template = {
                //   prev: 0,
                //   values: [],
                //   // serie: {
                //   //   data: [],//rows
                //   //   type: 'line',
                //   //   smooth: true,
                //   //   showSymbol: true,
                //   //   hoverAnimation: false,
                //   //   xAxisIndex: (property == 'transmited') ? 1 : 0,
                //   //   yAxisIndex: (property == 'transmited') ? 1 : 0,
                //   // }
                // }

                // self.networkInterfaces[name][property][messure] = template
                self.$set(self.networkInterfaces[name][property], messure, {prev: 0, values: []})
              }

              /**
              * avoid "reactivity" of components, or it will end up with a lot of updates and values on .data
              **/

              let copy = JSON.parse(JSON.stringify(self.networkInterfaces[name][property][messure]))

              //send difference from prev to current
              let data = value - copy.prev
              copy.prev = value
              if(messure == 'bytes')//send KB
                data = data / 1024

              copy.values[copy.values.length] = data

              copy.values = copy.values.slice(-self.seconds)
              self.networkInterfaces[name][property][messure] = copy
              /**
              *
              **/
            })
          }
          else{
            self.networkInterfaces[name][property] = values
          }
        })

        self.networkInterfaces[name].option.xAxis.data = self.formated_timestamps;
      })
      // self.networkInterfaces.data.push( doc );
      // self.networkInterfaces.data = self.networkInterfaces.data.slice(-this.seconds)

      // self.stats.loadavg.option.xAxis.data = this.formated_timestamps; //columns

      console.log('self.networkInterfaces', self.networkInterfaces)
		})



    this.EventBus.$on('loadavg', doc => {
			console.log('recived doc via Event loadavg', doc)

      // self.loadavg.push( doc );
      // self.loadavg = self.loadavg.slice(-this.seconds)

      // self.stats.loadavg.option.xAxis.data = self.format_timestamps(self.timestamps);

      //three series of data, each for a load messure
      Array.each(doc, function (load, index) {
        let data = JSON.parse(JSON.stringify(self.stats.loadavg.option.series[index].data))
        data.push({ 'value': load });
        self.stats.loadavg.option.series[index].data = data.slice(-self.seconds)
      })

      self.stats.loadavg.option.xAxis.data = this.formated_timestamps; //columns
      // console.log('---loadavg---',self.stats.loadavg.option.series)
		})

    this.EventBus.$on('uptime', doc => {
			console.log('recived doc via Event uptime', doc)

      // self.uptime.push( doc );
      // self.uptime = self.uptime.slice(-this.seconds)

      let data = JSON.parse(JSON.stringify(self.stats.uptime.option.series[0].data))
      data.push({ 'value': doc });
      self.stats.uptime.option.series[0].data = data.slice(-self.seconds)

      self.stats.uptime.option.xAxis.data = this.formated_timestamps; //columns
		})

		this.EventBus.$on('mem', doc => {
			// console.log('recived doc via Event mem', doc)

      /**
      * old method
      * self.mem.total = doc.totalmem;
			* self.mem.free = doc.freemem;
      **/

      let percentage = 100

			if(doc.totalmem != 0)
				percentage -= doc.freemem * 100 / doc.totalmem;

			percentage = percentage.toFixed(1);

      self.stats.mem.option.series[0].data = [{ 'value': percentage }]

		})

    this.prev_cpu = {total: 0, idle: 0 , timestamp: 0};

    this.EventBus.$on('cpu', doc => {
      if(doc.total != self.cpu.total){

        //use +0 to copy value, not Observer
        this.prev_cpu.total = self.cpu.total + 0;
        this.prev_cpu.idle = self.cpu.idle + 0;
        this.prev_cpu.timestamp = self.cpu.timestamp + 0;

  			self.cpu.total = doc.total;
  			self.cpu.idle = doc.idle;
        self.cpu.timestamp = self.timestamps.getLast();


      }
		})
	},
  watch: {
		// 'mem.free': function(val){
		// 	// console.log('freemem update')
    //
		// 	let percentage = 100
    //
		// 	if(this.mem.total != 0)
		// 		percentage -= this.mem.free * 100 / this.mem.total;
    //
		// 	percentage = percentage.toFixed(1);
    //
    //   /**
    //   * old method
    //   * this.mem.columns = { 'value': percentage };
    //   **/
    //   this.stats.mem.option.series[0].data = [{ 'value': percentage }]
		// },
    'cpu.total': function(val){

      // console.log('recived doc via Event cpu', this.cpu)
      // console.log('recived doc via Event cpu', this.prev_cpu)

      let diff_time = this.cpu.timestamp - this.prev_cpu.timestamp;
      let diff_total = this.cpu.total - this.prev_cpu.total;
      let diff_idle = this.cpu.idle - this.prev_cpu.idle;

      //algorithm -> https://github.com/pcolby/scripts/blob/master/cpu.sh
      let percentage =  (diff_time * (diff_total - diff_idle) / diff_total ) / 10;
      percentage = (percentage.toFixed(2) > 100) ? 100 : percentage.toFixed(2);

      /**
      * old method
      * this.cpu.columns = { 'value': percentage };
      **/
			this.stats.cpu.option.series[0].data = [{ 'value': percentage }]
		},
    timestamps: function (val){
      this.formated_timestamps = this.format_timestamps(this.timestamps)
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

        // console.log('---timestamps---',formated)
      })

      // console.log('---timestamps---',formated)
      return formated;

    }

  },

}
</script>

<style scoped>
  .gauge{
    width: 400px;
    height: 400px;
  }

  .line {
    width: '80%';
    height: 300px;
  }

  .rain-water-fall {
    width: '80%';
    height: 300px;
  }
</style>
