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
        <v-card-title class="primary white--text">
          <v-btn class="ml-0" icon dark @click="dialog = false"> 
          <v-icon class="ml-0" fab dark color="white--text darken-1 ">fa-long-arrow-alt-left</v-icon>
          </v-btn>
          <span class="ml-10">Update Medical Record</span>
        </v-card-title>
          <v-row>
            <v-col cols="12" md="12" lg="12">
              <!-- <DoctorUpdates /> -->
            <v-card flat class="mt-n5">
              <v-form @submit.prevent="updateMedicalRecord">
              <v-card-text>
                  <v-row>
                      <!-- Pulse -->
                      <v-col cols="12" sm="4" md="4" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">Pulse
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="Pulse"
                          v-model="pulse"
                          outlined 
                          prepend-icon="fa-heartbeat"
                          suffix="bpm"
                          @change="onPulseChange(pulse)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>
                      <!-- Blood Pressure & Pulse -->
                      <v-col cols="12" sm="4" md="4" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">Blood Pressure
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="Systolic"
                          v-model="systolic"
                          outlined 
                          @change="onSystolicChange(systolic)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>
                      <v-col cols="12" sm="4" md="4" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="Diastolic"
                          v-model="diastolic"
                          outlined 
                          @change="onDiastolicChange(diastolic)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>
                      <!-- Blood Glucose Level -->
                      <v-col cols="12" sm="4" md="4" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">Blood Glucose Level
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="Level"
                          v-model="bloodGlucoseLevel"
                          outlined 
                          suffix="mmol/l"
                          @change="onLevelChange(bloodGlucoseLevel)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>

                      <!-- Cholesterol -->
                      <v-col cols="12" sm="6" md="6" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">Cholesterol
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="Total Cholesterol"
                          v-model="cholesterol"
                          outlined
                          suffix="mmol/l" 
                          prepend-icon="fa-heart-broken"
                          @change="onTotalCholChange(cholesterol)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>

                      <v-col cols="12" sm="6" md="6" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="LDL"
                          v-model="cholesterolLDL"
                          outlined
                          suffix="mmol/l" 
                          @change="onLDLChange(cholesterolLDL)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>

                      <v-col cols="12" sm="6" md="6" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="HDL"
                          v-model="cholesterolHDL"
                          outlined
                          suffix="mmol/l" 
                          @change="onHDLChange(cholesterolHDL)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>

                      <v-col cols="12" sm="6" md="6" lg="3">
                      <v-card flat>
                          <v-card-title>
                          <v-subheader class="overline ml-n5">
                              <v-divider></v-divider>
                          </v-subheader>
                          </v-card-title>
                          <v-card-text>
                          <v-text-field
                          label="Triglycerides"
                          v-model="cholesterolTriglycerides"
                          outlined
                          suffix="mmol/l" 
                          @change="onTriglyceridesChange(cholesterolTriglycerides)"
                          ></v-text-field>
                          </v-card-text>
                      </v-card>
                      </v-col>
                    

                        </v-row>
                      </v-card-text>
                      </v-form>
                    </v-card>























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

     
        pulse: null,
        systolic: null,
        diastolic: null,
        bloodGlucoseLevel: null,
        cholesterol: null,
        cholesterolLDL: null,
        cholesterolHDL: null,
        cholesterolTriglycerides: null,
    
    }
  },
  validations: {

  },
  methods: {
    onPulseChange (pulse) {
      db.collection("users").doc(id).get().then(()=> {
          if(pulse != null){
              db.collection("users").doc(id).update({
                  pulse: pulse
              })
          }
      })
  },
  onSystolicChange (systolic) {
      db.collection("users").doc(id).get().then(()=> {
          if(systolic != null){
              db.collection("users").doc(id).update({
                  systolic: systolic
              })
          }
      })
  },
  onDiastolicChange (diastolic) {
      db.collection("users").doc(id).get().then(()=> {
          if(diastolic != null){
              db.collection("users").doc(id).update({
                  diastolic: diastolic
              })
          }
      })
  },
  onLevelChange (bloodGlucoseLevel) {
      db.collection("users").doc(id).get().then(()=> {
          if(bloodGlucoseLevel != null){
              db.collection("users").doc(id).update({
                  bloodGlucoseLevel: bloodGlucoseLevel
              })
          }
      })
  },
  onTotalCholChange (cholesterol) {
      db.collection("users").doc(id).get().then(()=> {
          if(cholesterol != null){
              db.collection("users").doc(id).update({
                  cholesterol: cholesterol
              })
          }
      })
  },
  onLDLChange (cholesterolLDL) {
      db.collection("users").doc(id).get().then(()=> {
          if(cholesterolLDL != null){
              db.collection("users").doc(id).update({
                  cholesterolLDL: cholesterolLDL
              })
          }
      })
  },
  onHDLChange (cholesterolHDL) {
      db.collection("users").doc(id).get().then(()=> {
          if(cholesterolHDL != null){
              db.collection("users").doc(id).update({
                  cholesterolHDL: cholesterolHDL
              })
          }
      })
  },
  onTriglyceridesChange (cholesterolTriglycerides) {
      db.collection("users").doc(id).get().then(()=> {
          if(cholesterolTriglycerides != null){
              db.collection("users").doc(id).update({
                  cholesterolTriglycerides: cholesterolTriglycerides
              })
          }
      })
  }
  },
};
</script>