import Vue from 'vue'
import Router from 'vue-router'
import MemGauge from '@/components/MemGauge'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      //name: 'MemGauge',
      component: MemGauge,
      props: true //https://stackoverflow.com/questions/37937262/passing-props-to-vue-js-components-instantiated-by-vue-router
    }
  ]
})
