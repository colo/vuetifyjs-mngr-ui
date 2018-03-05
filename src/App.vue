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
      <router-view :columns="columns"/>
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
						host:'192.168.0.180',
						// host:'127.0.0.1',
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
			//console.log('test filter', doc);
			let mem_doc = {totalmem: doc.totalmem, freemem: doc.freemem};

			next(mem_doc);
		}
	],
	output: [
		function(doc){
			doc = JSON.decode(doc)

			if(doc.totalmem){
				EventBus.$emit('mem', doc)
				console.log(doc)//update mem widget
			}

		}
	]
}))

export default {
  data () {
    return {
			/**
			* mem
			*/
			host: 'colo',
			columns: {'value': 100 },
			totalmem: 0,
			freemem: 0,
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
			console.log('recived doc via Event', doc)
			self.totalmem = doc.totalmem;
			self.freemem = doc.freemem;
		})
	},
  watch: {
		freemem: function(val){
			console.log('freemem update')

			let percentage = 100

			if(this.totalmem != 0)
				percentage -= this.freemem * 100 / this.totalmem;

			percentage = percentage.toFixed(1);

			this.columns = { 'value': percentage };
		}
	},
  name: 'App'
}
</script>
