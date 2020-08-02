import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    userProfile: {},

    // user: {},
    registerError: {},
    loginError: {},
    loading: false,

  },


  mutations: {
    setUserProfile(state, payload) {
      state.userProfile = payload
    },

    // setUser(state, payload){
    //   state.user = payload
    // },
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
      await fb.auth.createUserWithEmailAndPassword(payload.email, payload.password).then(user => {
        commit('setLoading', false)
        
        // const newUser = {
        //   id: user.uid,
        //   name: user.displayName,
        //   email: user.email,
        //   photoURL: user.photoURL
        // }
        // commit('setUser', newUser)
        // fetch user profile and set in state
        commit('fetchUserProfile', user)

      

        // Store form data in a patients collection
        return fb.usersCollection.doc(user.user.uid).set({
          firstname: payload.firstname,
          surname: payload.surname,
          date: payload.date,
          ppsn: payload.ppsn,
          email: payload.email,
          mobile: payload.mobile,
        });

      }).catch(registerError => {
          console.log(registerError.message)
          commit('setRegisterError', registerError.message)
          commit('setLoading', false)
      })
    },
    // LOGIN
    async login({ commit }, payload) {
      commit('setLoading', true)
      // sign user in
      await fb.auth.signInWithEmailAndPassword(payload.email, payload.password).then( user => {
       
        commit('setLoading', false)
        console.log(user)
        // commit('setUser', user.user.uid)
        // const newUser = {
        //   id: user.uid,
        //   name: user.displayName,
        //   email: user.email,
        //   photoUrl: user.photoURL
        // }
        // commit('setUser', newUser)
       
        
        // change route to dashboard
        // if (router.currentRoute.path === '/login') {
        //   router.push('/')
        // } 

      }).catch(loginError => {
        console.log(loginError.message)
        commit('setLoginError', loginError.message)
        commit('setLoading', false)
      })

     
    },
   
    //   const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
  
    //   // fetch user profile and set in state
    //   dispatch('fetchUserProfile', user)
    // },
    // LOGOUT
    async logout({ commit  }){
      await fb.auth.signOut()
      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      commit('setUser', null)

      router.push('/login')
    },    

    // async autoSignIn ({commit}, payload) {
      
    //   commit('setUser', {
    //     id: payload.uid,
    //     name: payload.displayName,
    //     email: payload.email,
    //     photoUrl: payload.photoURL
    //   })

    //   if (router.currentRoute.path === '/login') {
    //     router.push('/')
    //   }
      
    // },

    async fetchUserProfile({ commit }, user){

      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()
  
      // set user profile in state
      commit('setUserProfile', userProfile.data())
      

      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/')
      } 


    },



    async updateProfile({ commit, dispatch }, user) {
      
      const userId = fb.auth.currentUser.uid
      commit('setLoading', true)
      // update user object
      await fb.usersCollection.doc(userId).update({
        
        firstname: user.firstname,
        surname: user.surname,
        date: user.date,
        ppsn: user.ppsn,
        mobile: user.mobile,
      }).catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
      commit('setLoading', false)
      dispatch('fetchUserProfile', { uid: userId })
      }


  }, // actions end

  getters: {
    user (state) {
      return state.user
    },
    userProfile (state) {
      return state.userProfile
    }
  },

  
  modules: {
  }
})