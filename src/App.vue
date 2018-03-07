
<script>

import osstats from '@/components/os.stats'

import Pipeline from 'node-mngr-worker/lib/pipeline'
//import InputPollerHttpOS from './libs/input.poller.http.os'
// not working -> import InputPollerCradleOS from './libs/input.poller.cradle.os'
import InputPollerCouchDBOS from './libs/input.poller.couchdb.os'

/**
* https://alligator.io/vuejs/global-event-bus/
* vue events as message bus
*/
import Vue from 'vue'
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
			// console.log('test filter', doc.data.cpus);

			let mem = {totalmem: doc.data.totalmem, freemem: doc.data.freemem};
      // let cpu = { total: 0, idle: 0, timestamp: doc.metadata.timestamp };
      let cpu = { total: 0, idle: 0 };
      let timestamp = { timestamp: doc.metadata.timestamp };
      let uptime = {uptime: doc.data.uptime }
			let loadavg = {loadavg: doc.data.loadavg }
			let networkInterfaces = {networkInterfaces: doc.data.networkInterfaces }
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
      next(timestamp);
      next(uptime);
			next(loadavg);
			next(networkInterfaces);

		}
	],
	output: [
		function(doc){
			doc = JSON.decode(doc)

			if(doc.totalmem){
				// console.log(doc)
				EventBus.$emit('mem', doc) //update mem widget
			}
			else if(doc.idle){
        // console.log(doc)
				EventBus.$emit('cpu', doc) //update cpu widget
			}
			else if(doc.timestamp){
        // console.log(doc)
				EventBus.$emit('timestamp', doc.timestamp) //update timestamp
			}
			else if(doc.uptime){
        // console.log(doc)
				EventBus.$emit('uptime', doc.uptime) //update uptime widget
			}
			else if(doc.loadavg){
        // console.log(doc)
				EventBus.$emit('loadavg', doc.loadavg) //update loadavg widget
			}
			else if(doc.networkInterfaces){
				EventBus.$emit('networkInterfaces', doc.networkInterfaces) //update loadavg widget
			}
		}
	]
}))

export default {
  data () {
    return {
      EventBus : EventBus
    }
  },
  // router,
  components: { osstats },
  template: '<div><osstats :EventBus="EventBus"/></div>'
}
// import gauge from '@/components/gauge'
//
// export default {
//   name: 'os-content',
//   components: { gauge },
//   props: {
//     // EventBus: {
//     //   type: [Object],
//     //    default: () => ({})
//     // },
//     name: {
//       type: [String],
//        default: () => ('usage')
//     },
//   },
//   data () {
//     return {
// 			/**
// 			* mem
// 			*/
// 			mem: {
//         columns: {'value': 0 },
//         total: 0,
// 	      free: 0,
//       },
//       cpu: {
//         columns: {'value': 0 },
//         total: 0,
//         idle: 0,
//         timestamp: 0,
//       },
// 			/** **/
//
//     }
//   },
//   mounted: function(){
//     let self = this;
//
// 		EventBus.$on('mem', doc => {
// 			// console.log('recived doc via Event mem', doc)
// 			self.mem.total = doc.totalmem;
// 			self.mem.free = doc.freemem;
// 		})
//
//     this.prev_cpu = {total: 0, idle: 0 , timestamp: 0};
//
//     EventBus.$on('cpu', doc => {
//       if(doc.total != self.cpu.total){
//
//         //use +0 to copy value, not Observer
//         this.prev_cpu.total = self.cpu.total + 0;
//         this.prev_cpu.idle = self.cpu.idle + 0;
//         this.prev_cpu.timestamp = self.cpu.timestamp + 0;
//
//   			self.cpu.total = doc.total;
//   			self.cpu.idle = doc.idle;
//         self.cpu.timestamp = doc.timestamp;
//
//
//       }
// 		})
// 	},
//   watch: {
// 		'mem.free': function(val){
// 			// console.log('freemem update')
//
// 			let percentage = 100
//
// 			if(this.mem.total != 0)
// 				percentage -= this.mem.free * 100 / this.mem.total;
//
// 			percentage = percentage.toFixed(1);
//
// 			this.mem.columns = { 'value': percentage };
// 		},
//     'cpu.total': function(val){
//
//       // console.log('recived doc via Event cpu', this.cpu)
//       // console.log('recived doc via Event cpu', this.prev_cpu)
//
//       let diff_time = this.cpu.timestamp - this.prev_cpu.timestamp;
//       let diff_total = this.cpu.total - this.prev_cpu.total;
//       let diff_idle = this.cpu.idle - this.prev_cpu.idle;
//
//       //algorithm -> https://github.com/pcolby/scripts/blob/master/cpu.sh
//       let percentage =  (diff_time * (diff_total - diff_idle) / diff_total ) / 10;
//       percentage = (percentage.toFixed(2) > 100) ? 100 : percentage.toFixed(2);
//
//       // console.log('cpu update', percentage);
//
//
// 			this.cpu.columns = { 'value': percentage };
// 		}
// 	},
//   name: 'App'
// }
</script>
