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
  import lineMixin from '@/components/charts/line.mixin'

  export default {

    name: 'chart-line',
    mixins: [lineMixin]
  };

</script>

<style scoped>
  .echarts {
    width: '80%';
    height: 300px;
  }
</style>
