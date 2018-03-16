
<script>

import osechart from '@/components/charts/os.echart'
// import chartLine from '@/components/charts/line'
// import chartRainfallWaterfall from '@/components/charts/rainfall.waterfall'

export default {
  // name: 'App',
  name: 'osstats',

  components: {
    osechart
  },
  template: '<div><osechart v-bind:mem="mem"/></div>',
  props: {
    EventBus: {
      type: [Object],
       default: () => ({})
    },
    /*name: {
      type: [String],
       default: () => ('usage')
    },*/
  },
  data () {
    return {

			/**
			* mem
			*/
      mem: {
        total: 0,
        free: 0,
        prev: {
          total: 0,
          free: 0,
          percentage: 0
        },
        percentage: 0
      },
      timestamps: [],
      uptime: [],
      // loadavg: [],
      networkInterfaces: {
        current: {},
        prev: {}
      },
      networkInterfaces_stats: {},
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
			// //console.log('recived doc via Event timestamp', doc)
      self.timestamps.push( doc );
      // self.timestamps = self.timestamps.slice(-self.seconds)
      let length = self.timestamps.length
      self.timestamps.splice(
        -self.seconds -1,
        length - self.seconds
      )

		})

    this.EventBus.$on('networkInterfaces', doc => {
			// //console.log('recived doc via Event networkInterfaces', doc)

      self.networkInterfaces.prev = JSON.parse(JSON.stringify(self.networkInterfaces.current))
      if(Object.keys(self.networkInterfaces.prev) == 0)
        self.networkInterfaces.prev = JSON.parse(JSON.stringify(doc))

      self.networkInterfaces.current = doc;

		})



    this.EventBus.$on('loadavg', doc => {
			//console.log('recived doc via Event loadavg', doc)

      // self.loadavg.push( doc );
      // self.loadavg = self.loadavg.slice(-this.seconds)

      // self.stats.loadavg.option.xAxis.data = self.format_timestamps(self.timestamps);

      /**
      * UI
      **/
      if(self.stats.loadavg){
        //three series of data, each for a load messure
        Array.each(doc, function (load, index) {
          // let data = JSON.parse(JSON.stringify(self.stats.loadavg.option.series[index].data))
          // data.push({ 'value': load });
          // self.stats.loadavg.option.series[index].data = data.slice(-self.seconds)
          let data = self.stats.loadavg.option.series[index].data
          data.push({ 'value': load })

          let length = data.length
          self.stats.loadavg.option.series[index].data.splice(
            -self.seconds -1,
            length - self.seconds
          )
        })

        self.stats.loadavg.option.xAxis.data = this.formated_timestamps; //columns
        // //console.log('---loadavg---',self.stats.loadavg.option.series)
      }
		})

    this.EventBus.$on('uptime', doc => {
			//console.log('recived doc via Event uptime', doc)

      // self.uptime.push( doc );
      // self.uptime = self.uptime.slice(-this.seconds)

      /**
      * UI
      **/
      if(self.stats.uptime){
        // let data = JSON.parse(JSON.stringify(self.stats.uptime.option.series[0].data))
        // data.push({ 'value': doc });
        let data = self.stats.uptime.option.series[0].data
        data.push({ 'value': doc })

        let length = data.length
        self.stats.uptime.option.series[0].data.splice(
          -self.seconds -1,
          length - self.seconds
        )
        // if(data.length > self.seconds)
          // self.stats.uptime.option.series[0].data = data.slice(-self.seconds)

        // console.log(JSON.parse(JSON.stringify(self.stats.uptime.option.series[0].data)));

        // self.stats.uptime.option.series[0].data = data
        self.stats.uptime.option.xAxis.data = this.formated_timestamps; //columns
      }
		})

		this.EventBus.$on('mem', doc => {
      console.log('recived doc via Event mem', doc)

      self.$set(self.mem, 'prev', {
        total: JSON.parse(JSON.stringify(self.mem.total)),
        free: JSON.parse(JSON.stringify(self.mem.free)),
        percentage: JSON.parse(JSON.stringify(self.mem.percentage)),
      })


      self.$set(self.mem, 'total', doc.totalmem)
      self.$set(self.mem, 'free', doc.freemem)

      let percentage = 100

			if(doc.totalmem != 0)
				percentage -= doc.freemem * 100 / doc.totalmem;

      self.$set(self.mem, 'percentage', percentage)

      /**
      * UI
      **/
      // percentage = percentage.toFixed(1);
      // if(self.stats.mem)
      //   self.stats.mem.option.series[0].data = [{ 'value': percentage }]


      console.log(self.mem)
		})

    this.prev_cpu = {total: 0, idle: 0 , timestamp: 0};

    this.EventBus.$on('cpu', doc => {
      // console.log('recived doc via Event cpu', doc)

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
    'networkInterfaces.current': function(val){
      let self = this

      let ifaces = Object.keys(val)
      let properties = Object.keys(val[ifaces[0]])
      let messures = Object.keys(val[ifaces[0]][properties[1]])//properties[0] is "if", we want recived | trasmited


      // console.log('ifaces: ', ifaces)
      // console.log('properties: ', properties)
      // console.log('messures: ', messures)

      Array.each(ifaces, function(iface){
        if(!self.networkInterfaces_stats[iface])
          self.$set(self.networkInterfaces_stats, iface, {})

        /**
        * turn data property->messure (ex: transmited { bytes: .. }),
        * to: messure->property (ex: bytes {trasmited:.., recived: ... })
        **/
        Array.each(messures, function(messure){// "bytes" | "packets"
          if(!self.networkInterfaces_stats[iface][messure])
            self.$set(self.networkInterfaces_stats[iface], messure, self.$options.net_stats.option)
            // self.networkInterfaces_stats[iface][messure] = self.$options.net_stats.option
            // self.networkInterfaces_stats[iface][messure] =  { option: self.$options.net_stats.option }

            self.networkInterfaces_stats[iface][messure].title.text = iface
            self.networkInterfaces_stats[iface][messure].title.subtext = messure
            self.networkInterfaces_stats[iface][messure].xAxis[0].data = self.formated_timestamps


            Array.each(properties, function(property){// "recived" | "transmited"
              if(property == 'recived' || property == 'transmited'){

                let current = val[iface][property][messure]
                let prev = self.networkInterfaces.prev[iface][property][messure]
                let data = current - prev + 0

                if(messure == 'bytes')
                  data = data / 1024
                // let serie = {}

                let option = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure]))

                if(property == 'recived'){
                  option.series[0].data.push(data)
                  option.series[0].data = option.series[0].data.slice(-self.seconds)
                  // serie = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].option.series[0]))
                }
                else{
                  option.series[1].data.push(data)
                  option.series[1].data = option.series[1].data.slice(-self.seconds)
                  // serie = JSON.parse(JSON.stringify(self.networkInterfaces_stats[iface][messure].option.series[1]))
                }

                self.networkInterfaces_stats[iface][messure] = option

                // if(messure == "bytes" && iface == 'brkvm'){
                //   console.log('self.networkInterfaces_stats iface', iface)
                //   console.log('self.networkInterfaces_stats messure', messure)
                //   console.log('self.networkInterfaces_stats property', property)
                //   console.log('self.networkInterfaces_stats value', current )
                //   console.log('self.networkInterfaces_stats prev', prev )
                //   console.log('self.networkInterfaces_stats DATA', data )
                //   console.log('self.networkInterfaces_stats SERIE', option )
                // }

              }
            })

        })

      })


      console.log('self.networkInterfaces_stats', self.networkInterfaces_stats)

    },
		// 'mem.free': function(val){
		// 	// //console.log('freemem update')
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

      // console.log('recived doc via Event cpu',this.cpu)
      // //console.log('recived doc via Event cpu', this.prev_cpu)

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

      if(this.stats.cpu)//UI
		    this.stats.cpu.option.series[0].data = [{ 'value': percentage }]

        console.log('recived doc via Event cpu', this.stats.cpu.option.series[0].data)
		},
    // timestamps: function (val){
    //   // this.formated_timestamps.push('')
    //   this.formated_timestamps = this.format_timestamps(this.timestamps)
    // }
	},


}
</script>
