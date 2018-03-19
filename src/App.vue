
<script>

// import osstats from '@/components/os.stats'
// import osstats from '@/components/generate.stats'
import osstats from '@/components/generate.stats_separated'

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

// let buffer = []
// let buffer_size = 5

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

			// if(buffer_size > 1){
			// 	if(buffer.length < buffer_size){
			// 		buffer.push([mem,cpu,timestamp,uptime,loadavg,networkInterfaces])
			// 	}
			// 	else{
			// 		Array.each(buffer, function(docs){
			// 			Array.each(docs, function(doc){
			// 				next(doc)
			// 			})
			// 		})
      //
			// 		buffer = []
			// 	}
			// }
			// else{
				next(mem);
				next(cpu);
				next(timestamp);
				next(uptime);
				next(loadavg);
				next(networkInterfaces);
			// }


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
</script>
