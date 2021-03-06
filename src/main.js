import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { auth } from './firebase'
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize'

Vue.config.productionTip = false

Vue.use(Vuelidate, VueTextareaAutosize)

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

    // Get the token of the user to see if they are admin or not
    auth.currentUser.getIdTokenResult().then( tokenResult=> {
      console.log(tokenResult.claims)
    })
    
    // User is signed in 
    store.dispatch('fetchUserProfile', user)
  }
})