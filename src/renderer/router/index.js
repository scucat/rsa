import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'file-upload',
      component: require('@/components/file-upload/file-upload').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
