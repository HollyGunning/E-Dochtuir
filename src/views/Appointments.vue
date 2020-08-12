<template>
<v-container >


  <v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">

     <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          
          <v-card flat>
            <v-card-title class="primary lighten-1 white--text">Appointments
            <v-spacer></v-spacer>
              <v-btn
              class="mx-2" 
              fab small
              dark color="primary"
              v-bind="attrs"
              v-on="on"
              >
              <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>


              <ViewAppointments />

          </v-card>

      



        </template>
        <v-card>
          
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Cancel</v-toolbar-title>
            
          </v-toolbar>
   
          <BookAppointment />

        </v-card>
      </v-dialog>



  </v-col></v-row>




</v-container>
</template>

<script>

import ViewAppointments from "../components/Appointments/ViewAppointments"
import BookAppointment from "../components/Appointments/BookAppointment"

export default {
   components: {
     ViewAppointments,
     BookAppointment,
    },
    computed: {
    },
    data () {
      return {
        showAppointments: true,
        showBookAppointment: false,
        dialog: false,
      
      }
    },
    created() {
    },
    methods: {
      toggleBookAppointment (){
        this.showAppointments =!this.showAppointments
        this.showBookAppointment =!this.showBookAppointment
      },
  }
}
</script>