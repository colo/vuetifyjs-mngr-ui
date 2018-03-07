<template>
  <div>
      <!-- <router-view :columns="columns"/> -->
      <div v-for="(iface, name) in networkInterfaces" :key="name">
        <chart-line :title="name" :columns="timestamps" :series="[iface.recived.bytes, iface.transmited.bytes]"/>
      </div>
      <chart-line title="Load" :columns="timestamps" :series="loadavg"/>
      <chart-line title="Uptime" :columns="timestamps" :series="uptime"/>
       <gauge :columns="mem.columns"/>
       <gauge :columns="cpu.columns"/>
  </div>
</template>

<script>

import gauge from '@/components/charts/gauge'
import chartLine from '@/components/charts/line'

export default {
  name: 'osstats',
  components: { gauge, chartLine },
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
      seconds: 10, //define the N timestamps to show
			/**
			* mem
			*/
      timestamps: [],
      uptime: [],
      loadavg: [],
      networkInterfaces: {},
			mem: {
        columns: {'value': 0 },
        total: 0,
	      free: 0,
      },
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
      self.timestamps = self.timestamps.slice(-this.seconds)

		})

    this.EventBus.$on('networkInterfaces', doc => {
			console.log('recived doc via Event networkInterfaces', doc)

      Object.each(doc, function(iface, name){
        if(!self.networkInterfaces[name])
          self.networkInterfaces[name] = {}

        Object.each(iface, function(values, property){
          if(!self.networkInterfaces[name][property])
            self.networkInterfaces[name][property] = {}

          if(property == 'recived' || property == 'transmited'){
            Object.each(values, function(value, messure){
              if(!self.networkInterfaces[name][property][messure]){
                let template = {
                    data: [],//rows
                    type: 'line',
                    smooth: true,
                    showSymbol: true,
                    hoverAnimation: false,
                }

                self.networkInterfaces[name][property][messure] = template
              }

              /**
              * avoid "reactivity" of components, or it will end up with a lot of updates and values on .data
              **/

              let copy = JSON.parse(JSON.stringify(self.networkInterfaces[name][property][messure]))
              copy.data[copy.data.length] = value
              copy.data = copy.data.slice(-self.seconds)
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

      })
      // self.networkInterfaces.data.push( doc );
      // self.networkInterfaces.data = self.networkInterfaces.data.slice(-this.seconds)

      console.log('self.networkInterfaces', self.networkInterfaces)
		})

    this.EventBus.$on('loadavg', doc => {
			console.log('recived doc via Event loadavg', doc)

      self.loadavg.push( doc );
      self.loadavg = self.loadavg.slice(-this.seconds)

		})

    this.EventBus.$on('uptime', doc => {
			console.log('recived doc via Event uptime', doc)

      self.uptime.push( doc );
      self.uptime = self.uptime.slice(-this.seconds)

		})

		this.EventBus.$on('mem', doc => {
			// console.log('recived doc via Event mem', doc)
			self.mem.total = doc.totalmem;
			self.mem.free = doc.freemem;
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
        self.cpu.timestamp = this.timestamps.getLast();


      }
		})
	},
  watch: {
		'mem.free': function(val){
			// console.log('freemem update')

			let percentage = 100

			if(this.mem.total != 0)
				percentage -= this.mem.free * 100 / this.mem.total;

			percentage = percentage.toFixed(1);

			this.mem.columns = { 'value': percentage };
		},
    'cpu.total': function(val){

      // console.log('recived doc via Event cpu', this.cpu)
      // console.log('recived doc via Event cpu', this.prev_cpu)

      let diff_time = this.cpu.timestamp - this.prev_cpu.timestamp;
      let diff_total = this.cpu.total - this.prev_cpu.total;
      let diff_idle = this.cpu.idle - this.prev_cpu.idle;

      //algorithm -> https://github.com/pcolby/scripts/blob/master/cpu.sh
      let percentage =  (diff_time * (diff_total - diff_idle) / diff_total ) / 10;
      percentage = (percentage.toFixed(2) > 100) ? 100 : percentage.toFixed(2);

      // console.log('cpu update', percentage);


			this.cpu.columns = { 'value': percentage };
		}
	},
  name: 'App'
}
</script>
