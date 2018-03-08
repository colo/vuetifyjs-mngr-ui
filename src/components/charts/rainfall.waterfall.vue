<template>
  <div class="echarts">
    <IEcharts
      :option="line"
    />
			<!--
			:loading="loading"
      @ready="onReady"
      @click="onClick"
      -->
  </div>
</template>

<script type="text/babel">
  // import IEcharts from 'vue-echarts-v3/src/full.js';
  import lineMixin from '@/components/charts/line.mixin'

  export default {
    name: 'chart-rainfall-waterfall',
    mixins: [lineMixin],
    // components: {
    //   IEcharts
    // },
    data: () => ({
      line: {
        legend: {
          data:['-','-'],
          x: 'left'
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        grid: [
          {
            left: 100,
            right: 50,
            height: '35%'
          },
          {
            left: 100,
            right: 50,
            top: '55%',
            height: '35%'
          }
        ],
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: [] //columns
          },
          {
            gridIndex: 1,
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: true},
            data: [],
            position: 'top'
          }
        ],
        yAxis : [
          {
            name : 'y name',
            type : 'value',
            // max : 500
          },
          {
            gridIndex: 1,
            name : 'y name2',
            type : 'value',
            inverse: true
          }
        ],
        series: []

  		}
    }),
  };

</script>

<style scoped>
  .echarts {
    width: 800px;
    height: 300px;
  }
</style>
