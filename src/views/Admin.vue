<template>
    <section>
        <div class="ui middle aligned center aligned grid">
            <div class="column">
                <h1>Admin</h1>
                <p v-if="user">User:{{user.email}}</p>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td data-label="Name">{{user.email}}</td>
                            <select @change="changeRole(user.id, $event)">
                                <option :selected="user.role.patient" value="patient">Patient</option>
                                <option :selected="user.role.doctor" value="doctor">Doctor</option>
                            </select>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

<!-- 
<v-card flat>
      <v-card-title>
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
      <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      :items-per-page="5"
      class="elevation-1"
      >
   
      <template v-slot:items="{ items }"> 
          <v-select 
          :key="user.id"
          v-model="select"
          :items="items"
          item-text="roleName"
          item-value="role"
          @change="changeRole(user.id, $event)"
          >
        
        
      </template>
      </v-data-table>
    </v-card> -->

    </section>
</template>
<script>
import firebase from "firebase";
export default {
    data() {
        return {
            users: [],
            user: null,

          


            search: '',
                headers: [
                    { text: 'User Email', align: 'start', value: 'email' },
                    
                    { text: 'User Role  ', value: 'items', width: '300' },
                ],
           
        
           
            setSelect: null,
            fetchValue: '',

           select: {roleName: 'Patient'},
            items : [
                { roleName: 'Patient', role:'patient', value: 'patient'},
                { roleName: 'Doctor', role: 'doctor', value: 'doctor'}
            ],






        };
    },
    created() {
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            self.user = user;
        });
        this.users = [];
        firebase
            .firestore()
            .collection("roles")
            .get()
            .then(snap => {
                snap.forEach(doc => {
                    var user = doc.data();
                    user.id = doc.id;
                  
                    console.log(doc.data());
                    console.log(user)
                    if (!user.role.admin) this.users.push(user);
               
                });
            });
    },
    methods: {
     
        changeRole(uid, event) {
            var addMessage = firebase.functions().httpsCallable("setUserRole");
            var data = { uid: uid, role: { [event.target.value]: true } };
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