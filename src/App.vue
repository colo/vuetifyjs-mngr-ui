<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <!-- <router-view :columns="columns"/> -->
      <mem-gauge :columns="mem.columns"/>
      <mem-gauge :columns="cpu.columns"/>

    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>

import Pipeline from 'node-mngr-worker/lib/pipeline'
//import InputPollerHttpOS from './libs/input.poller.http.os'
// not working -> import InputPollerCradleOS from './libs/input.poller.cradle.os'
import InputPollerCouchDBOS from './libs/input.poller.couchdb.os'


import Vue from 'vue';

/**
* https://alligator.io/vuejs/global-event-bus/
* vue events as message bus
*/
const EventBus = new Vue();

const pipelines = []
pipelines.push(new Pipeline({
	input: [
		{
			poll: {
				id: "input.os.cradle",
				conn: [
					{
						scheme: 'http',
						// host:'192.168.0.180',
						host:'127.0.0.1',
						port: 5984,
						//module: require('./lib/os.stats'),
						module: InputPollerCouchDBOS,
						//load: ['apps/info/os/']
					}
				],
				connect_retry_count: 5,
				connect_retry_periodical: 1000,
				requests: {
					periodical: 1000,
				},
			},
		}
	],
	filters: [
		function(doc, opts, next){
			console.log('test filter', doc.data.cpus);

			let mem = {totalmem: doc.data.totalmem, freemem: doc.data.freemem};
      let cpu = { total: 0, idle: 0, timestamp: doc.metadata.timestamp };

      // let core = doc.data.cpus[0];//test

      Array.each(doc.data.cpus, function(core){
        Object.each(core.times, function(value, key){

          if(key == 'idle')
            cpu.idle += value

          cpu.total += value


        });
      });

      next(mem);
      next(cpu);
		}
	],
	output: [
		function(doc){
			doc = JSON.decode(doc)

			if(doc.totalmem){
				// console.log(doc)
				EventBus.$emit('mem', doc) //update mem widget
			}

      if(doc.idle){
        // console.log(doc)
				EventBus.$emit('cpu', doc) //update cpu widget
			}

		}
	]
}))

import MemGauge from '@/components/MemGauge'

export default {
  components: { MemGauge },
  data () {
    return {
			/**
			* mem
			*/
			// host: 'colo',
			mem: {
        columns: {'value': 100 },
        total: 0,
	      free: 0,
      },
      cpu: {
        columns: {'value': 100 },
        total: 0,
        idle: 0,
        timestamp: 0,
      },
			/** **/
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  mounted: function(){
    let self = this;
		EventBus.$on('mem', doc => {
			// console.log('recived doc via Event mem', doc)
			self.mem.total = doc.totalmem;
			self.mem.free = doc.freemem;
		})

    this.prev_cpu = {total: 0, idle: 0 , timestamp: 0};

    EventBus.$on('cpu', doc => {
      if(doc.total != self.cpu.total){

        //use +0 to copy value, not Observer
        this.prev_cpu.total = self.cpu.total + 0;
        this.prev_cpu.idle = self.cpu.idle + 0;
        this.prev_cpu.timestamp = self.cpu.timestamp + 0;

  			self.cpu.total = doc.total;
  			self.cpu.idle = doc.idle;
        self.cpu.timestamp = doc.timestamp;


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
			// console.log('cpu update')
      console.log('recived doc via Event cpu', this.cpu)
      console.log('recived doc via Event cpu', this.prev_cpu)

      let diff_time = this.cpu.timestamp - this.prev_cpu.timestamp;
      let diff_total = this.cpu.total - this.prev_cpu.total;
      let diff_idle = this.cpu.idle - this.prev_cpu.idle;

      //algorithm -> https://github.com/pcolby/scripts/blob/master/cpu.sh
      let percentage =  (diff_time * (diff_total - diff_idle) / diff_total ) / 10;
      percentage = (percentage.toFixed(2) > 100) ? 100 : percentage.toFixed(2);

      // console.log('cpu update', diff_time);
      // console.log('cpu update', diff_total);
      // console.log('cpu update', diff_idle);

      console.log('cpu update', percentage);

      //
			// let percentage = 100
      //
			// if(this.cpu.total != 0)
			// 	percentage -= this.cpu.idle * 100 / this.cpu.total;
      //
			// percentage = percentage.toFixed(1);
      //
			this.cpu.columns = { 'value': percentage };
		}
	},
  name: 'App'
}
</script>
