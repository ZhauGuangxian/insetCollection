import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home';
import NotFound from '@/views/404';
import LabHome from '@/views/lab/labHome';
import ThreeLab from '@/views/lab/children/threelab';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path:'*',
      name:'notFound',
      component:NotFound
    },
    {
      path:'/lab',
      name:'lab',
      component:LabHome,
      children:[
        {
          path:'',
          component:ThreeLab
        },
        {
          path:'threelab',
          name:'threelab',
          component:ThreeLab
        }
      ]
    }
  ]
})
