import Vue from 'vue'
import VueRouter from 'vue-router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import {auth} from '../firebase'
import Admin from '@/views/Admin.vue'
import Doctor from '@/views/Doctor.vue'
import DoctorAppointment from '@/views/DoctorAppointment.vue'
import DoctorPrescription from '@/views/DoctorPrescription.vue'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/Profile.vue'
import MedicalRecord from '@/views/MedicalRecord.vue'
import Medication from '@/views/Medication.vue'
import Appointments from '@/views/Appointments.vue'
import Prescriptions from '@/views/Prescriptions.vue'
import Chat from '@/views/Chat.vue'
import DoctorRooms from '@/views/DoctorRooms.vue'
import Login from '@/views/Login.vue'
import NotFound from '../components/404.vue'

Vue.use(VueRouter)
// Each of the individual page routes
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: {
      requiresAuth: true, 
    }
  },
  {
    path: '/doctor',
    name: 'doctor',
    component: Doctor,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/doctorAppointment',
    name: 'doctorAppointment',
    component: DoctorAppointment,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/doctorPrescription',
    name: 'doctorPrescription',
    component: DoctorPrescription,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/medicalRecord',
    name: 'medicalRecord',
    component: MedicalRecord,
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
    path: '/prescriptions',
    name: 'Prescriptions',
    component: Prescriptions,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/doctorRooms',
    name: 'DoctorRooms',
    component: DoctorRooms,
    meta: {
      requiresAuth: true
    }
  },
  { 
    path: '*', 
    name: 'NotFound',
    component: NotFound 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Check for requiredAuth and current user
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
  // if auth state is authenticated user then do checks for different roles otherwise redirect to login
  auth.onAuthStateChanged(user => {
    if (user != null && user != undefined ) {
      auth.currentUser.getIdTokenResult()
        .then(function ({claims}) {
          if (claims.patient) {
            if (to.path != '/profile' && to.path != '/appointments' && to.path != '/prescriptions' && to.path != '/chat' && to.path != '/medication' && to.path != '/medicalRecord')
              return next ({
                path: './'
              })
          } else if (claims.admin) {
            if (to.path != '/admin')
              return next ({
                path: './admin'
              })
          } else if (claims.doctor) {
            if (to.path != '/doctor' && to.path != '/doctorAppointment' && to.path != '/doctorPrescription' && to.path != '/doctorRooms')
            return next ({
              path: './doctor'
            })
          }
        })
    } 
    else {
      if (to.matched.some(record => record.meta.auth)) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      } 
    }
  })
})

export default router