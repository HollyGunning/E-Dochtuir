import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    userProfile: {},
    user: {},
    registerError: {},
    loginError: {},
    loading: false,

  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setUser(state, payload){
      state.user = payload
    },
    setRegisterError(state, payload){
      state.registerError = payload
    },
    setLoginError(state,payload){
      state.loginError = payload
    },
    setLoading(state, payload){
      state.loading = payload
    },
  },
  actions: {
    // SIGNUP
    async signup({ commit }, payload) {
      commit('setLoading', true)
      await fb.auth.createUserWithEmailAndPassword(payload.email, payload.password).then(cred => {
        return fb.usersCollection.doc(cred.user.uid).set({
          firstname: payload.firstname,
          surname: payload.surname,
          date: payload.date,
          ppsn: payload.ppsn,
          email: payload.email,
          mobile: payload.mobile,
        });

      }).then(user => {

        // commit('setUser', {email: cred.user.email})
        commit('setLoading', false)
        // fetch user profile and set in state
        commit('fetchUserProfile', user)
      }).catch(registerError => {
        console.log(registerError.message)
        commit('setRegisterError', registerError.message)
        commit('setLoading', false)
      })


      // fb.usersCollection.doc(user.uid).set({
      //       firstname: payload.firstname,
      //       surname: payload.surname,
      //       date: payload.date,
      //       ppsn: payload.ppsn,
      //       email: payload.email,
      //       mobile: payload.mobile,
      // }).then(user => {
      //   commit('setUser', {email: user.email})
      //   commit('setLoading', false)
      //   router.push('/dashboard')
      // }).catch(error => {
      //   commit('setError', error.message)
      //   alert("Error")
      //   commit('setLoading', false)
      // })








    // async signup({ dispatch }, form) {
      // this.errorMsgReg = ''
      // try {
      //   // create user using the email and password
      //   const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
      //   // create user profile object in userCollections
      //   await fb.usersCollection.doc(user.uid).set({
      //     firstname: form.firstname,
      //     surname: form.surname,
      //     date: form.date,
      //     ppsn: form.ppsn,
      //     email: form.email,
      //     mobile: form.mobile,
      //   })
      //   // fetch user profile and set in state
      //   dispatch('fetchUserProfile', user)


      // } catch (error) {
      //   // alert any error that occurred in the process
      //   alert(error)
      //   this.errorMsgReg = error.message
      // }
    },
    // LOGIN
    async login({ commit }, payload) {
      commit('setLoading', true)
      // sign user in
      await fb.auth.signInWithEmailAndPassword(payload.email, payload.password).then( cred => {
        commit('setUser', cred.user.email)
        commit('setLoading', false)
        commit('setLoginError', {})
       
      }).catch(loginError => {
        console.log(loginError.message)
        commit('setLoginError', loginError.message)
        commit('setLoading', false)
      })

  
     
    },
    // async login({ dispatch }, form) {
    //   // sign user in
    //   const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
  
    //   // fetch user profile and set in state
    //   dispatch('fetchUserProfile', user)
    // },


    async logout({ commit  }){
      await fb.auth.signOut()
      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login')
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()
  
      // set user profile in state
      commit('setUserProfile', userProfile.data())
      
      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/')
      } 
    },

  },
  modules: {
  }
})