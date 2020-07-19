<template>
  <v-app> <!-- Route Vuetify Component --> 

    <!-- Navigation will be loaded above content --> 
    <Navbar />

    <v-main class="mx-2 mb-4"> <!-- All page content will be loaded here --> 
       <router-view></router-view> <!-- This will load the specific route the user is on e.g. Home, About etc. -->
    </v-main>


  </v-app>
</template>

<script>
import Navbar from './components/Navbar'

export default {
  name: 'App',

  components: {
    Navbar,
  },

  data: () => ({
    //
  }),
};
</script>
