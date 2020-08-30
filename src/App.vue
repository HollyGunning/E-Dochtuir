<template>
  <v-app> <!-- Route Vuetify Component use only once to wrap everything else --> 


    <v-main class="mx-2 mb-4"> <!-- All page content will be loaded here --> 
       <router-view></router-view> <!-- This will load the specific route the user is on e.g. Home, About etc. -->
    </v-main>


  </v-app>
</template>

<script>

export default {
  name: 'App',
  
  data() {
    return {
      
    }
  },
  components: {

  },
  computed: {

  }
};
</script>
