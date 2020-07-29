import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { auth } from './firebase'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.use(Vuelidate)


let app
// wait for auth to init before creating the app
auth.onAuthStateChanged(user => {
  // init app if not already created
  if(!app){
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
  }

})