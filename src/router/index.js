import Vue from 'vue'
import Router from 'vue-router'
import OSStats from '@/components/os.stats'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      template: '<div>root</div>'
    },
    {
      path: '/osstats',
      name: 'osstats',
      component: OSStats,
      props: true //https://stackoverflow.com/questions/37937262/passing-props-to-vue-js-components-instantiated-by-vue-router
    }
  ]
})
