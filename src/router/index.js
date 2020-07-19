import Vue from 'vue'
import VueRouter from 'vue-router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Dashboard from '@/views/Dashboard.vue'
import Medication from '@/views/Medication.vue'
import Appointments from '@/views/Appointments.vue'
// import Signup from '@/views/Signup.vue'
import Login from '@/views/Login.vue'

import { auth } from '../firebase'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/medication',
    name: 'Medication',
    component: Medication,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: Appointments,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // {
  //   path: '/signup',
  //   name: 'Signup',
  //   component: Signup
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// navigation guard to check for logged in users
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})


export default router