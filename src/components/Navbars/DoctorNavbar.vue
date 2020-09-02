<template>
    <nav>
        <!-- Toolbar -->
        <v-app-bar app class="primary">
            <v-app-bar-nav-icon large class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="grey--text text-uppercase">E-Dochtúir - Doctor Portal</v-toolbar-title> 
        <v-spacer></v-spacer>
        <v-btn depressed class="primary grey--text" @click="logout()">
            <span>Log Out</span>
            <v-icon right> exit_to_app </v-icon>
        </v-btn>
        </v-app-bar>
          <!-- Navigation Drawer -->
        <v-navigation-drawer app v-model="drawer" temporary class="teal darken-3">
            <v-list>  
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
                { icon: 'fa-user-injured', text: 'Patient Database', route: '/doctor'},
                { icon: 'fa-calendar', text: 'Appointments', route: '/doctorAppointment' },
                { icon: 'fa-file-prescription', text: 'Prescription Requests', route: '/doctorPrescription' },
                { icon: 'fa-comment-medical', text: 'Patient Chat', route: '/doctorRooms' },
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