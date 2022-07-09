import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: ()=> import('../components/functions/Login.vue'),
    },
    {
      path: '/index',
      component: ()=> import('@/components/Index'),
      name: 'index',
      redirect:{name:"class"},
      children:[
        {
        path: '/class',
        component: () => import('../components/functions/Class.vue'),
        name: 'class',
        },{
        path: '/teacher',
        component: () => import('../components/functions/Teacher.vue'),
        name: 'teacher',
        },{
        path: '/student',
        component: () => import('../components/functions/Student.vue'),
        name: 'student',
        },{
        path: '/course',
        component: () => import('../components/functions/Course.vue'),
        name: 'course',
        },{
        path: '/paper',
        component: () => import('../components/functions/Paper.vue'),
        name: 'paper',
        },{
        path: '/question',
        component: () => import('../components/functions/Question.vue'),
        name: 'question',
        },{
        path: '/grade',
        component: () => import('../components/functions/Grade.vue'),
        name: 'grade',
        }
      ]
    }
  ]
})
