<template>
    <v-container >
 <AdminNavbar />
    <!-- Display the admin users email -->
    <v-row>
    <v-col cols="12" s="12" sm="12" md="12" lg="12">
        <v-col class="mt-n4">
        <v-card outlined>
            <v-row>
            <v-col cols="12" md="4">
                <v-list-item>
                <v-list-item-content>
                <v-list-item-title class="overline grey--text">Admin</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-col>
            <v-col cols="12" md="8">
                <v-list-item>
                <v-list-item-content>
                <v-list-item-title class="subtitle-1" v-if="user">{{user.email}}</v-list-item-title>
                </v-list-item-content>
                </v-list-item>
            </v-col>
            </v-row>
        </v-card>
      </v-col>
        <!-- Card for User Records Search Bar -->
        <v-card outlined>
            <v-card-title class="text-uppercase grey--text text--darken-1">
            User Management
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="fa-search"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            </v-card-title>
        </v-card>
        <!-- Card for the Data Table -->
        <v-card outlined>
            <!-- Table -->
            <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            :items-per-page="10"
            class="elevation-1"
            >
            <!-- selector for the user role -->
            <template v-slot:[`item.role`]="{item}"> 
                <v-select 
                :key="item.id"
                v-model="item.currentRole"
                :items="items"
                item-text="roleName"
                item-value="value"
                @change="changeRole(item.id, $event)"
                ></v-select>                    
            </template>
            </v-data-table>
        </v-card>
    </v-col>
    </v-row>
    </v-container>
</template>
<script> // import the admin navbar as well as auth, db and functions from firebase
import AdminNavbar from '../components/Navbars/AdminNavbar'
import {auth, db, functions} from '../firebase'
export default {
  components: {
    AdminNavbar,
  },
    data() {
        return {
            users: [],
            user: null,
            search: '',
            headers: [
                { text: 'User Email', align: 'start', value: 'email' },
                { text: 'User Role  ', value: 'role', width: '300' },
            ],
           
            select: {roleName: 'Patient'},
            items : [
                { roleName: 'Patient', role:'patient', value: 'patient'},
                { roleName: 'Doctor', role: 'doctor', value: 'doctor'}
            ],
        };
    },
    created() {
        var self = this;
        auth.onAuthStateChanged(function(user) {
            self.user = user;
        });
        this.users = [];
        db.collection("roles").get().then(snap => {
            snap.forEach(doc => {
                var user = doc.data()
                user.id = doc.id
                user.currentRole = user.role.patient ? "patient" : "doctor"
                if (!user.role.admin) this.users.push(user)
            });
            console.log(this.users)
        });
    },
    methods: {
      // Update the role of the current user, used to update them from a patient to doctor
      changeRole(uid, event) {  
        // Fires of a call to the cloud functions to setUserRole
        var addMessage = functions.httpsCallable("setUserRole");
        var data = { uid: uid, role: { [event]: true } };
        addMessage(data)
            .then(function(result) {
                console.log(result);
            })
            .catch(function(error) {
                console.log(error);
            });
      },
    }
};
</script>
