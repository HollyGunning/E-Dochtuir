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
                  
                  <v-col cols="12">
                    <v-tabs v-model="tab">
                      <v-tab v-for="tab in tabs" :key="tab.tabName">{{ tab.tabName }}</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                      <v-tab-item> <!-- ALLERGIES -->
                        <v-card >
                            <!-- Import Component -->
                            <Allergies />
                              <v-col cols="12" md="12">
                              <v-card outlined class="mt-2" v-for="(allergy, index) in allergies" :key="index">
                                <v-card-title class="primary lighten-1 white--text">
                                  <v-icon class="mr-4 white--text">fa-allergies</v-icon>
                                  {{ allergy.allergyName }}
                                
                                <v-subheader class="overline primary lighten-1 white--text">
                                {{ allergy.allergyType }}
                                </v-subheader>
                                  <v-spacer></v-spacer>
                                  <!--  DELETE  ALLERGY -->
                                  <v-icon right @click="deleteAllergy(allergy)">fa-trash</v-icon>
                                </v-card-title>
                                  <v-card-text>
                                        <v-row>
                                          <v-col cols="12" sm="6" md="6">
                                            <v-list>
                                              <v-list-item>
                                                <v-list-item-content>
                                                  <v-list-item-title 
                                                  class="overline grey--text mb-4">Severity
                                                  </v-list-item-title>
                                                  <h3>{{ allergy.allergySeverity }}</h3>
                                                </v-list-item-content>
                                              </v-list-item>
                                            </v-list>
                                          </v-col>
                                          <v-col cols="12" sm="6" md="6">
                                            <v-list>
                                              <v-list-item>
                                                <v-list-item-content>
                                                  <v-list-item-title 
                                                  class="overline grey--text mb-4">Descirption
                                                  </v-list-item-title>
                                                  <h3>{{ allergy.allergyDetails }}</h3> 
                                                </v-list-item-content>
                                              </v-list-item>
                                            </v-list>
                                          </v-col></v-row>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              </v-card>
                      </v-tab-item>
                      <v-tab-item> <!-- CONDITIONS -->
                        <v-card>
                          <!-- Import Component -->
                          <Conditions />
                            <v-col cols="12" md="12">
                              <v-card outlined class="mt-2" v-for="(condition, index) in conditions" :key="index">
                                <v-card-title class="primary lighten-1 white--text">
                                  <v-icon class="mr-4 white--text">fa-file-medical-alt</v-icon>
                                  {{ condition.conditionName }}
                                  <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
                                  <v-spacer></v-spacer>
                                  <!--  DELETE  CONDITION -->
                                  <v-icon right @click="deleteCondition(condition)">fa-trash</v-icon>
                                </v-card-title>
                                  <v-card-text>
                                    <v-row>
                                      <v-col cols="12" sm="6" md="6">
                                        <v-list>
                                          <v-list-item>
                                            <v-list-item-content>
                                              <v-list-item-title 
                                              class="overline grey--text mb-4">Date of Diagnosis
                                              </v-list-item-title>
                                              <h3>{{ condition.conditionDate }}</h3>
                                            </v-list-item-content>
                                          </v-list-item>
                                        </v-list>
                                      </v-col>
                                      <v-col cols="12" sm="6" md="6">
                                        <v-list>
                                          <v-list-item>
                                            <v-list-item-content>
                                              <v-list-item-title 
                                              class="overline grey--text mb-4">Description
                                              </v-list-item-title>
                                              <h3>{{ condition.conditionDetails }}</h3>
                                            </v-list-item-content>
                                          </v-list-item>
                                        </v-list>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item><!-- immunisations --> 
                        <v-card>
                          <immunisations />
                            <v-col cols="12" md="12">
                            <v-card outlined class="mt-2" v-for="(immunisation, index) in immunisations" :key="index">
                              <v-card-title class="primary lighten-1 white--text">
                                <v-icon class="mr-4 white--text">fa-syringe</v-icon>
                                {{ immunisation.immunisationName }}
                                <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
                                <v-spacer></v-spacer>
                                <!--  DELETE  IMMUNISATION -->
                                  <v-icon right @click="deleteImmunisation(immunisation)">fa-trash</v-icon>
                              </v-card-title>
                                <v-card-text>
                                  <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-list>
                                        <v-list-item>
                                          <v-list-item-content>
                                            <v-list-item-title 
                                            class="overline grey--text mb-4">Date Received
                                            </v-list-item-title>
                                            <h3>{{ immunisation.immunisationDate }}</h3>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-list>
                                        <v-list-item>
                                          <v-list-item-content>
                                            <v-list-item-title 
                                            class="overline grey--text mb-4">Reaction
                                            </v-list-item-title>
                                            <h3>{{ immunisation.immunisationsReaction }}</h3>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-list>
                                        <v-list-item>
                                          <v-list-item-content>
                                            <v-list-item-title 
                                            class="overline grey--text mb-4">Additional Details
                                            </v-list-item-title>
                                            <h3>{{ immunisation.immunisationDetails }}</h3>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-col>
                                  </v-row>
                                </v-card-text>
                              </v-card>
                            </v-col>
                        </v-card>
                      </v-tab-item>


                    </v-tabs-items>
                  </v-col>
                  <v-snackbar
                    :color="color"
                    v-model="snackbar"
                    :timeout="timeout"
                    :multi-line="multiLine"
                  >{{ snackbarText }}
                  </v-snackbar>
    
                    

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
import { auth, db, fieldValue } from '../firebase'
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
            // Set the patient info for the data table
            let patient = {
              id: patientRecord.id,
              name: patientRecord.firstname + ' ' + patientRecord.surname,
              dob: patientRecord.date,
              gender: patientRecord.gender,
              ppsn: patientRecord.ppsn
            }
            this.patients.push(patient) // Store the patient info to the patients array
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
      currentUser: null, // Used to store the current logged in user
      patientID: null, // Store the patient ID when doctor clicks on actions
      dialog: false,
      snackbar: false,
      color: null,
      multiLine: true,
      timeout: 5000,
      snackbarText: "",

      patients: [], // Patients array for data table
      patient: null, // Individual patient info
      search: '', // Search bar 
      /// Headers define the labels for the data table and the values take the values from patient
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
      allergies: [], // Store allergies here to display to user
      conditions: [], // Store conditions here to display to user
      immunisations: [], // Store immunisations here to display to user
      // Tabs for upcoming and past
      tab: null,
      tabs: [
      { tabName: 'Allergies' },
      { tabName: 'Conditions' },
      { tabName: 'Immunisations' },
      ],
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
      db.collection("users").doc(this.patientID).onSnapshot(doc => {
        let patientInfo = doc.data()
        patientInfo.id = doc.id
        // Populate these values to display patient medical record fields that are currently holding info
        this.gender = patientInfo.gender
        this.selectedBlood = patientInfo.bloodType
        this.weight = patientInfo.weight
        this.height = patientInfo.height
        this.pulse = patientInfo.pulse
        this.systolic = patientInfo.systolic
        this.diastolic = patientInfo.diastolic
        this.bloodGlucoseLevel = patientInfo.bloodGlucoseLevel
        this.cholesterol = patientInfo.cholesterol
        this.cholesterolLDL = patientInfo.cholesterolLDL
        this.cholesterolHDL = patientInfo.cholesterolHDL
        this.cholesterolTriglycerides = patientInfo.cholesterolTriglycerides
        // Populate the arrays with corresponding data from users record
        this.allergies = patientInfo.allergy
        this.conditions = patientInfo.condition
        this.immunisations = patientInfo.immunisation
      })
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
      // Access the users collection then update pulse of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(pulse != null){
          db.collection("users").doc(this.patientID).update({
            pulse: pulse
          })
        }
      })
    },
    onSystolicChange (systolic) {
      // Access the users collection then update systolic of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(systolic != null){
          db.collection("users").doc(this.patientID).update({
            systolic: systolic
          })
        }
      })
    },
    onDiastolicChange (diastolic) {
      // Access the users collection then update diastolic of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(diastolic != null){
          db.collection("users").doc(this.patientID).update({
            diastolic: diastolic
          })
        }
      })
    },
    onLevelChange (bloodGlucoseLevel) {
      // Access the users collection then update bloodGlucoseLevel of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(bloodGlucoseLevel != null){
          db.collection("users").doc(this.patientID).update({
            bloodGlucoseLevel: bloodGlucoseLevel
          })
        }
      })
    },
    onTotalCholChange (cholesterol) {
      // Access the users collection then update cholesterol of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterol != null){
          db.collection("users").doc(this.patientID).update({
            cholesterol: cholesterol
          })
        }
      })
    },
    onLDLChange (cholesterolLDL) {
      // Access the users collection then update cholesterolLDL of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterolLDL != null){
          db.collection("users").doc(this.patientID).update({
            cholesterolLDL: cholesterolLDL
          })
        }
      })
    },
    onHDLChange (cholesterolHDL) {
      // Access the users collection then update cholesterolHDL of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterolHDL != null){
          db.collection("users").doc(this.patientID).update({
            cholesterolHDL: cholesterolHDL
          })
        }
      })
    },
    onTriglyceridesChange (cholesterolTriglycerides) {
      // Access the users collection then update cholesterolTriglycerides of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterolTriglycerides != null){
          db.collection("users").doc(this.patientID).update({
            cholesterolTriglycerides: cholesterolTriglycerides
          })
        }
      })
    },
    deleteAllergy(allergy){
      // Use arrayRemove to remove all instances of the record
      db.collection("users").doc(this.patientID).update({
        allergy: fieldValue.arrayRemove(allergy)
      })
    },

    deleteCondition (condition) {
        // Use arrayRemove to remove all instances of the record
        db.collection("users").doc(this.patientID).update({
          condition: fieldValue.arrayRemove(condition)
      })
    },

    deleteImmunisation (immunisation) {
      // Use arrayRemove to remove all instances of the record
      db.collection("users").doc(this.patientID).update({
        immunisation: fieldValue.arrayRemove(immunisation)
      })
    },
  },
};
</script>