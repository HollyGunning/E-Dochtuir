<template>
  <v-app> <!-- Route Vuetify Component --> 

    <!-- Navigation will be loaded above content --> 
    <Navbar v-if="showNavbar"/>

    <v-main class="mx-2 mb-4"> <!-- All page content will be loaded here --> 
       <router-view></router-view> <!-- This will load the specific route the user is on e.g. Home, About etc. -->
    </v-main>


  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from './components/Navbar'

export default {
  name: 'App',
  data: () => ({
    //
  }),
  components: {
    Navbar,
  },
  computed: {
    ...mapState(['userProfile']),
    showNavbar(){
      return Object.keys(this.userProfile).length > 1
    }
  }
};
</script>
