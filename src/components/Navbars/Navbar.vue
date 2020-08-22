<template>
    <nav>
        <!-- Toolbar -->
        <v-app-bar app class="primary">
            <v-app-bar-nav-icon large class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="grey--text text-uppercase">E-Dochtúir</v-toolbar-title> 
        <v-spacer></v-spacer> <!-- Anything after the spacer will align to the right of the page -->
        <v-btn depressed class="primary grey--text" @click="logout()">
            <span>Log Out</span>
            <v-icon right> exit_to_app </v-icon>
        </v-btn>
        </v-app-bar>
        <!-- Navigation Drawer -->
        <v-navigation-drawer app v-model="drawer" temporary class="teal darken-3">
            <v-list>
                <v-list-item   route-link :to="{ name: 'profile'}">
                    <!-- <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                    </v-list-item-avatar> -->
                    <v-list-item-icon>
                        <v-icon left class="white--text">fa-user-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">My Profile</v-list-item-title>
                    </v-list-item-content>
                    
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-item-icon>
                        <v-icon left class="white--text">{{ link.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{ link.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
export default {
data(){
    return{
        drawer: false,
        links: [
            { icon: 'dashboard', text: 'Dashboard', route: '/' },
            { icon: 'fa-book-medical', text: 'Medical Record', route: '/medicalRecord'},
            { icon: 'fa-pills', text: 'Medication', route: '/medication' },
            { icon: 'fa-stethoscope', text: 'Appointments', route: '/appointments' },
        ]
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