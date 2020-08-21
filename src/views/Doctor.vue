<template>
<v-container>
<DoctorNavbar />
  <v-col cols="12" s="12" sm="12" md="12" lg="12">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <!-- Card for Patient Records Search Bar -->
        <v-card outlined>
          <v-card-title class="text-uppercase grey--text text--darken-1">Patients
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
          <v-data-table
          :headers="headers"
          :items="patients"
          :search="search"
          :items-per-page="5"
          class="elevation-1"
          >
          <template v-slot:[`item.actions`]="{ item }">
            <v-col cols="12" s="12" sm="12" md="12" lg="12">
            <v-icon
            class="mr-2"
            :key="item.id"
            v-bind="attrs"
            v-on="on"
            >fa-notes-medical
            </v-icon>
            </v-col>
            
          </template>
          </v-data-table>
        </v-card>

      </template>
      <!-- Dialog opens this card where the doctor can update the patients medical record-->
      <v-card>
        <v-card-title class="primary white--text">Update Medical Record
          <v-spacer></v-spacer>
          <v-btn class="mr-4" icon dark @click="dialog = false"> 
          <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
          <span>Return to Patients</span>
          </v-btn>
        </v-card-title>
          <v-row>
            <v-col cols="12" md="12" lg="12">
              <DoctorUpdates />
            </v-col>
          </v-row>
      </v-card>
    </v-dialog>

  </v-col>
</v-container>
</template>

<script>
import DoctorNavbar from '../components/Navbars/DoctorNavbar'
import DoctorUpdates from '../components/MedicalRecord/DoctorUpdates'
import { auth, db } from '../firebase'

export default {
  components: {
    DoctorNavbar,
    DoctorUpdates,
  },
  created () {
    var user = auth.currentUser
      if(user){
        this.currentUser = auth.currentUser.uid // Get current users ID

        db.collection("roles").get().then(snap => {
        snap.forEach(doc => {
          let user = doc.data()
          // if user is not doctor or admin retrieve the record
          if (!user.role.admin && !user.role.doctor) {
            // Then set user.id to the doc.id to refer back to their record in users
            user.id = doc.id
            db.collection("users").doc(user.id).onSnapshot(doc => {
                let patientRecord = doc.data()
                patientRecord.id = doc.id
                
                let patient = {
                  id: patientRecord.id,
                  name: patientRecord.firstname + ' ' + patientRecord.surname,
                  dob: patientRecord.date,
                  gender: patientRecord.gender,
                  ppsn: patientRecord.ppsn
                }
                this.patients.push(patient)
            })
          }
        })
        })
        
      }else{
        console.log("User has logged out")
      }
    


  },
  computed: {

  },
  data() {
    return {
      currentUser: null,
      dialog: false,

      patients: [],
      patient: null,
      search: '',

      headers: [
        // { text: 'Patient ID', align: 'start',  sortable: false, value: 'id' },
        { text: 'Patient Name', value: 'name' },
        { text: 'DoB', value: 'dob'},
        { text: 'Gender', value: 'gender' },
        { text: 'PPSN', value: 'ppsn' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

     
    
    }
  },
};
</script>