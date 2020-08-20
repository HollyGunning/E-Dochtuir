<template>
    <v-container >
 <AdminNavbar />

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
     

        <v-card shaped>
            <!--Title and Search -->
            <v-card-title class="text-uppercase grey--text text--darken-1">
            User Management
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            </v-card-title>
            
            <!-- Table -->
            <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            :items-per-page="5"
           class="elevation-8"
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
<script>
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
                var user = doc.data();
                user.id = doc.id;
                user.currentRole = user.role.patient ? "patient" : "doctor";
                if (!user.role.admin) this.users.push(user);
            });
            console.log(this.users)
        });
    },
    methods: {
      changeRole(uid, event) {  
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

<style scoped>
   .mobile {
      color: #333;
    }
    @media screen and (max-width: 768px) {
      .mobile table.v-table tr {
        max-width: 100%;
        position: relative;
        display: block;
      }
      .mobile table.v-table tr:nth-child(odd) {
        border-left: 6px solid deeppink;
      }
      .mobile table.v-table tr:nth-child(even) {
        border-left: 6px solid cyan;
      }
      .mobile table.v-table tr td {
        display: flex;
        width: 100%;
        border-bottom: 1px solid #f5f5f5;
        height: auto;
        padding: 10px;
      }
      .mobile table.v-table tr td ul li:before {
        content: attr(data-label);
        padding-right: .5em;
        text-align: left;
        display: block;
        color: #999;
      }
      .v-datatable__actions__select
      {
        width: 50%;
        margin: 0px;
        justify-content: flex-start;
      }
      .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
        background: transparent;
      }
    }
    .flex-content {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    .flex-item {
      padding: 5px;
      width: 50%;
      height: 40px;
      font-weight: bold;
    }
</style>