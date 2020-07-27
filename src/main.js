import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
// import vuelidateErrorExtractor, { templates } from "vuelidate-error-extractor";
import './registerServiceWorker'
import router from './router'
import store from './store'
import { auth } from './firebase'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.use(Vuelidate)

// Vue.use(vuelidateErrorExtractor),{
//   template: templates.singleErrorExtractor.foundation6, // you can also pass your own custom template
//   messages: { required: "The {attribute} field is required" }, // error messages to use
//   attributes: { // maps form keys to actual field names
//     email: "Email",
//     firstname: "First name",
//     surname: "Surname"
//   }
// }

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