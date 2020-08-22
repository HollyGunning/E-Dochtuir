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
            :items="patients"
            v-bind="attrs"
            v-on="on"
            @click="storeID(item.id)"
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
            <!-- ALL MEDICAL RECORD FIELDS HERE -->
            <v-card flat class="mt-n5">
              <v-form @submit.prevent="updateMedicalRecord">
              <v-card-text>
                  <v-row>
                  <!-- GENDER -->
                  <v-col cols="12" sm="6" md="6" lg="3">
                  <v-card flat>
                      <v-card-title class="overline">
                        <v-subheader class="overline ml-n5">Gender
                        <v-divider></v-divider>
                        </v-subheader>
                      </v-card-title>
                      <v-card-text>
                        <v-btn-toggle 
                        v-model="gender" 
                        color="primary" 
                        group 
                        mandatory
                        @change="onGenderChange(gender)"
                        >
                          <v-btn depressed x-large color="primary--text darken-1" value="Female">
                          <v-icon class="mr-2">fa-venus</v-icon>Female
                          </v-btn>
                          <v-btn depressed x-large color="primary--text darken-1" value="Male">
                          <v-icon class="mr-2">fa-mars</v-icon>Male
                          </v-btn>
                        </v-btn-toggle>
                      </v-card-text>
                  </v-card>
                  </v-col>
                  <!-- BLOODS -->
                  <v-col cols="12" sm="6" md="6" lg="3">
                  <v-card flat>
                      <v-card-title class="overline">
                        <v-subheader  class="overline ml-n5">Blood Type
                        <v-divider></v-divider>
                        </v-subheader>
                      </v-card-title>
                      <v-card-text>
                            <v-select
                            v-model="selectedBlood"
                            :items="bloods"
                            label="Blood Type"
                            prepend-icon="fa-syringe"
                            outlined
                            @change="onBloodsChange(selectedBlood)"
                          ></v-select>
                      </v-card-text>
                  </v-card>
                  </v-col>

                  <!-- WEIGHT AND HEIGHT -->
                  <v-col cols="12" sm="6" md="6" lg="3">
                  <v-card flat>
                    <v-card-title>                   
                      <v-subheader class="overline ml-n5">Weight & Height
                        <v-divider></v-divider>
                      </v-subheader>
                    </v-card-title>
                    <v-card-text>
                      <v-text-field
                      label="Weight"
                      v-model="weight"
                      outlined 
                      prepend-icon="fa-weight"
                      :maxlength="3"
                      suffix="lbs"
                      @change="onWeightChange(weight)"
                      :error-messages="weightError"
                      @input="$v.weight.$touch(weight)"
                      @blur="$v.weight.$touch(weight)"
                      ></v-text-field>
                    </v-card-text>
                  </v-card> 
                  </v-col>
                  <v-col cols="12" sm="6" md="6" lg="3">
                    <v-card flat>
                    <v-card-title>                   
                      <v-subheader  class="overline ml-n5">
                        <v-divider></v-divider>
                      </v-subheader>
                    </v-card-title>
                      <v-card-text>
                        <v-text-field 
                          label="Height"
                          v-model="height"
                          outlined 
                          prepend-icon="fa-ruler-vertical"
                          :maxlength="3"
                          suffix="inches"
                          @change="onHeightChange(height)"
                          :error-messages="heightError"
                          @input="$v.height.$touch(height)"
                          @blur="$v.height.$touch(height)"
                          ></v-text-field>
                      </v-card-text>
                    </v-card>
                  </v-col>
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
import Allergies from '../components/MedicalRecord/Allergies'
import Conditions from '../components/MedicalRecord/Conditions'
import Immunisations from '../components/MedicalRecord/Immunisations'
import { auth, db } from '../firebase'
import { numeric } from 'vuelidate/lib/validators'

export default {
  components: {
    DoctorNavbar,
    Allergies,
    Conditions,
    Immunisations,
  },
  created () {

        this.currentUser = auth.currentUser.uid // Get current users ID

        // Gets the patients through roles by filtering only patient roles IDs
        db.collection("roles").get().then(snap => {
        snap.forEach(doc => {
          let user = doc.data()
          // if user is not doctor or admin retrieve the record
          if (!user.role.admin && !user.role.doctor) {
            // Then set user.id to the doc.id to refer back to their record in users
            user.id = doc.id
            db.collection("users").doc(user.id).get().then(doc => {
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
 
  },
  computed: {
    weightError () {
      const errors = []
      if(!this.$v.weight.$dirty) return errors
          !this.$v.weight.numeric && errors.push('Only Numeric Values Will Save')
      return errors
    },
    heightError () {
      const errors = []
      if(!this.$v.height.$dirty) return errors
          !this.$v.height.numeric && errors.push('Only Numeric Values Will Save')
      return errors
    },
  },
  data() {
    return {
      patientID: null,
      dialog: false,

      currentUser: null,
     

      patients: [],
      patient: null,
      search: '',

      headers: [
        { text: 'Patient Name', value: 'name' },
        { text: 'DoB', value: 'dob'},
        { text: 'Gender', value: 'gender' },
        { text: 'PPSN', value: 'ppsn' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
        gender: null, // Gender value passes from db to buttons and highlights active one
        weight: null, // Used to store weight
        height: null, // Used to store height
        selectedBlood: null, // Used to store the selected blood type
        bloods: [
          {text: 'None'},
          {text: 'A Positive'},
          {text: 'A Negative'},
          {text: 'B Positive'},
          {text: 'B Negative'},
          {text: 'O Positive'},
          {text: 'O Negative'},
          {text: 'AB Positive'},
          {text: 'AB Negative'},
        ],
        pulse: null,  // Used to store pulse
        systolic: null, // Used to store systolic
        diastolic: null, // Used to store diastolic
        bloodGlucoseLevel: null, // Used to store bloodGlucoseLevel
        cholesterol: null, // Used to store cholesterol
        cholesterolLDL: null, // Used to store cholesterolLDL
        cholesterolHDL: null, // Used to store cholesterolHDL
        cholesterolTriglycerides: null, // Used to store cholesterolTriglycerides
    
    }
  },
  validations: {
    weight: { numeric },
    height: { numeric }
  },
  methods: {
    storeID (id) {
      // Store the ID of the record of which the action is pressed on
      this.patientID = id
    },
    onGenderChange (gender) {
      // Access the users collection then update gender value of patient
      db.collection("users").doc(this.patientID).get().then(() =>{
        if(gender != null){
          db.collection("users").doc(this.patientID).update({
            gender: gender
          })
        }
      })
    },
      onBloodsChange(selectedBlood) {
      // Access the users collection then update blood type of patient
      db.collection("users").doc(this.patientID).get().then(() =>{
        if(selectedBlood != null){
          db.collection("users").doc(this.patientID).update({
            bloodType: selectedBlood
          })
        }
      })
    },
    onWeightChange (weight) {
      // Check to see if entered data is dirty before updating the db
      this.$v.$touch()
      this.formTouched = !this.$v.$anyDirty
      this.errors = this.$v.$anyError
      if(this.errors === false && this.formTouched === false){
         db.collection("users").doc(this.patientID).get().then(() =>{
        // Access the users collection then update weight of patient if not null
        if(weight != null){
          db.collection("users").doc(this.patientID).update({
            weight: weight
          })
        }
      })
      }
    },
    onHeightChange (height) {
      // Check to see if entered data is dirty before updating the db
      this.$v.$touch()
      this.formTouched = !this.$v.$anyDirty
      this.errors = this.$v.$anyError
      if(this.errors === false && this.formTouched === false){
        // Access the users collection then update height of patient if not null
        db.collection("users").doc(this.patientID).get().then(() =>{
          if(height != null){
            db.collection("users").doc(this.patientID).update({
              height: height
            })
          }
        })
      }
    },    

    onPulseChange (pulse) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(pulse != null){
              db.collection("users").doc(this.patientID).update({
                  pulse: pulse
              })
          }
      })
  },
  onSystolicChange (systolic) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(systolic != null){
              db.collection("users").doc(this.patientID).update({
                  systolic: systolic
              })
          }
      })
  },
  onDiastolicChange (diastolic) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(diastolic != null){
              db.collection("users").doc(this.patientID).update({
                  diastolic: diastolic
              })
          }
      })
  },
  onLevelChange (bloodGlucoseLevel) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(bloodGlucoseLevel != null){
              db.collection("users").doc(this.patientID).update({
                  bloodGlucoseLevel: bloodGlucoseLevel
              })
          }
      })
  },
  onTotalCholChange (cholesterol) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(cholesterol != null){
              db.collection("users").doc(this.patientID).update({
                  cholesterol: cholesterol
              })
          }
      })
  },
  onLDLChange (cholesterolLDL) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(cholesterolLDL != null){
              db.collection("users").doc(this.patientID).update({
                  cholesterolLDL: cholesterolLDL
              })
          }
      })
  },
  onHDLChange (cholesterolHDL) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(cholesterolHDL != null){
              db.collection("users").doc(this.patientID).update({
                  cholesterolHDL: cholesterolHDL
              })
          }
      })
  },
  onTriglyceridesChange (cholesterolTriglycerides) {
      db.collection("users").doc(this.patientID).get().then(()=> {
          if(cholesterolTriglycerides != null){
              db.collection("users").doc(this.patientID).update({
                  cholesterolTriglycerides: cholesterolTriglycerides
              })
          }
      })
  },





  },


};
</script>