<template>
    <nav>
        <!-- Toolbar -->
        <v-app-bar app class="primary">
            <v-toolbar-title class="grey--text text-uppercase">E-Dochtúir</v-toolbar-title> 
        <v-spacer></v-spacer> <!-- Anything after the spacer will align to the right of the page -->
        <v-btn depressed class="primary grey--text" @click="logout()">
            <span>Log Out</span>
            <v-icon right> exit_to_app </v-icon>
        </v-btn>
        </v-app-bar>
  
    </nav>
</template>

<script>
export default {
data(){
    return{
    
    }
},
methods: {
    logout() {
        this.$store.dispatch('logout')
    }
}
}

</script>

<style>

</style>