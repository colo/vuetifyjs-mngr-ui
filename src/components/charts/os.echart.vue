<template>
  <div>


       <!-- each iface has stats  -->
       <!-- <template v-for="(stat, iface) in networkInterfaces_stats"> -->
         <!-- each stat is an "option" obj, for eChart  -->
         <!-- <template v-if="iface == 'lo'"> -->
         <!-- <div
          v-for="(option, messure) in stat"
          v-if="messure == 'bytes' || messure == 'packets'"
          :key="iface+'-'+messure"
          :class="$options.net_stats.class"
          >
           <IEcharts
             :option="option"
           />
        </div>
      </template> -->
      <!-- </template> -->

     <div v-for="(stat, name) in stats" :key="name" :class="stat.class">
       <IEcharts
         :option="stat.option"
       />
     </div>

  </div>
</template>

<script>

import IEcharts from 'vue-echarts-v3/src/full.js';

import stats from './json/os.echart.json'
import net_stats from './json/net.echart.json'

export default {
  // name: 'App',
  name: 'osechart',

  net_stats: net_stats,
  components: {
    IEcharts
  },
  props: {
    mem: {
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
      stats: stats,
      seconds: 300, //define the N timestamps to show
      formated_timestamps: [],
    }
  },
  watch: {
    mem: function(val){
      console.log('recived doc via prop mem', val)

      if(this.stats.mem)
        this.stats.mem.option.series[0].data = [{ 'value': val.percentage }]
    }
  },
  // computed: {
  //   'stats.mem.option': function(){
  //     return { series: [ { data: [{ 'value': this.mem.percentage }] } ] }
  //   }
  // },
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
