<template>
<v-container>
<Navbar /> <!-- Import Patient Nav toolbar & drawer -->
<v-row><v-col cols="12" md="12" lg="12">
  <v-card flat>
    <v-card-title class="primary lighten-1 white--text">Medical Record
    <v-spacer></v-spacer>
    </v-card-title>
      <v-row>  
      <!-- Gender Field -->
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
            
            @change="onGenderChange(gender)" 
            > <!-- onGenderChange method method carries over selected value -->
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
      <!-- Blood Type Field -->
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
              ></v-select> <!-- onBloodsChange method carries over selected value -->
          </v-card-text>
      </v-card>
      </v-col>

      <!-- Weight & Height Field -->
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
          ></v-text-field> <!-- onWeightChange method carries over inputted value -->
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
              ></v-text-field> <!-- onHeightChange method carries over inputted value -->
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Pulse Field (readonly) -->
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
          readonly
          ></v-text-field>
        </v-card-text>
      </v-card>
      </v-col>
      <!-- Blood Pressure & Pulse Fields (readonly) -->
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
          readonly
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
          readonly
          ></v-text-field>
        </v-card-text>
      </v-card>
      </v-col>
      <!-- Blood Glucose Level Field (readonly) -->
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
          readonly
          ></v-text-field>
        </v-card-text>
      </v-card>
      </v-col>
      <!-- Cholesterol Fields (readonly) -->
      <v-col cols="12" sm="6" md="6" lg="3">
      <v-card flat>
        <v-card-title>
          <v-subheader class="overline ml-n5">Cholesterol
            <v-divider></v-divider>
          </v-subheader>
        </v-card-title>
        <v-card-text>
          <v-text-field
          label="Overall Cholesterol"
          v-model="cholesterol"
          outlined
          readonly
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
          readonly 
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
          readonly 
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
          readonly 
          ></v-text-field>
        </v-card-text>
      </v-card>
      </v-col>
    <!-- Tabs for Allergies, Conditions & Immunisations -->
    <v-col cols="12">
      <v-tabs v-model="tab">
        <v-tab v-for="tab in tabs" :key="tab.tabName">{{ tab.tabName }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item> <!-- ALLERGIES -->
          <v-card >
              <Allergies /> <!-- Import Allergies Component -->
                <v-col cols="12" md="12">
                <!-- For every allergy in the allergies array, recognised seperately by index position -->
                <v-card outlined class="mt-2" v-for="(allergy, index) in allergies" :key="index">
                  <v-card-title class="primary lighten-1 white--text">
                    <v-icon class="mr-4 white--text">fa-allergies</v-icon>
                    {{ allergy.allergyName }}
                  <v-subheader class="overline primary lighten-1 white--text">
                  {{ allergy.allergyType }}
                  </v-subheader>
                    <v-spacer></v-spacer> <!-- deleteAllergy method called on click of icon -->
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
            <Conditions /> <!-- Import Conditions Component -->
               <v-col cols="12" md="12">
                <!-- For every condition in the conditions array, recognised seperately by index position -->
                <v-card outlined class="mt-2" v-for="(condition, index) in conditions" :key="index">
                  <v-card-title class="primary lighten-1 white--text">
                    <v-icon class="mr-4 white--text">fa-file-medical-alt</v-icon>
                    {{ condition.conditionName }}
                    <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
                    <v-spacer></v-spacer> <!-- deleteCondition method called on click of icon -->
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
            <immunisations /> <!-- Import Immunisations Component -->
              <v-col cols="12" md="12">
              <!-- For every immunisation in the immunisations array, recognised seperately by index position -->
              <v-card outlined class="mt-2" v-for="(immunisation, index) in immunisations" :key="index">
                <v-card-title class="primary lighten-1 white--text">
                  <v-icon class="mr-4 white--text">fa-syringe</v-icon>
                  {{ immunisation.immunisationName }}
                  <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
                  <v-spacer></v-spacer> <!-- deleteImmunisation method called on click of icon -->
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
    <!-- Snackbar to display any success or error messages -->
    <v-snackbar
      :color="color"
      v-model="snackbar"
      :timeout="timeout"
      :multi-line="multiLine"
    >{{ snackbarText }}
    </v-snackbar>
    </v-row>
  </v-card>

</v-col></v-row> <!-- End of display -->
</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import Allergies from '../components/MedicalRecord/Allergies'
import Conditions from '../components/MedicalRecord/Conditions'
import Immunisations from '../components/MedicalRecord/Immunisations'
import { auth, db, fieldValue } from '../firebase'
import { numeric } from 'vuelidate/lib/validators'
export default {
  components: {
    Navbar,
    Allergies,
    Conditions,
    Immunisations,
  },
  created() {
    this.currentUser = auth.currentUser.uid // Get current users ID
    // Realtime listen to the patients medical record fields in the users collection
    db.collection("users").doc(this.currentUser).onSnapshot(doc => {
      let storedRecord = doc.data() // store the doc.data() into a value to get each field
      storedRecord.id = doc.id
      // Populate these values to display to the user what fields are currently holding info
      this.gender = storedRecord.gender
      this.selectedBlood = storedRecord.bloodType
      this.weight = storedRecord.weight
      this.height = storedRecord.height
      this.pulse = storedRecord.pulse
      this.systolic = storedRecord.systolic
      this.diastolic = storedRecord.diastolic
      this.bloodGlucoseLevel = storedRecord.bloodGlucoseLevel
      this.cholesterol = storedRecord.cholesterol
      this.cholesterolLDL = storedRecord.cholesterolLDL
      this.cholesterolHDL = storedRecord.cholesterolHDL
      this.cholesterolTriglycerides = storedRecord.cholesterolTriglycerides
      // Populate arrays for allergies, conditions & immunisations
      this.allergies = storedRecord.allergy
      this.conditions = storedRecord.condition
      this.immunisations = storedRecord.immunisation
    })
  },
  computed: {
    // Validation Errors
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
      currentUser: null,
      // Snackbar fields
      snackbar: false,
      color: null,
      multiLine: true,
      timeout: 5000,
      snackbarText: "",
      // Tabs to switch between allergies, conditions & immunisations
      tab: null,
      tabs: [
      { tabName: 'Allergies' },
      { tabName: 'Conditions' },
      { tabName: 'Immunisations' },
      ],
      gender: null, // Gender value passes from db to buttons and highlights active one
      weight: null, // Used to store weight
      height: null, // Used to store height
      selectedBlood: null, // Used to store the selected blood type
      // Blood choices
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
      // Arrays
      allergies: [], // Store allergies here to display to user
      conditions: [], // Store conditions here to display to user
      immunisations: [], // Store immunisations here to display to user
    }
  },
  validations: {
    // numeric values only
    weight: { numeric },
    height: { numeric }
  },
  methods: {
    // Error and success messages
    triggerSnackbar (message, color) {
      this.snackbarText = message,
      this.color = color,
      this.snackbar = true
    },
    // Gender button changed
    onGenderChange (gender) {
      // Access the users collection then update gender value
      db.collection("users").doc(this.currentUser).get().then(() =>{
        // so long as gender is not null
        if(gender != null){
          db.collection("users").doc(this.currentUser).update({
            gender: gender
          })
        }
      })
    },
    // Blood selection changed
    onBloodsChange(selectedBlood) {
      // Access the users collection then update blood type
      db.collection("users").doc(this.currentUser).get().then(() =>{
        // so long as blood type is not null
        if(selectedBlood != null){
          db.collection("users").doc(this.currentUser).update({
            bloodType: selectedBlood
          })
        }
      })
    },
    // Weight value changed
    onWeightChange (weight) {
      // Check to see if entered data is dirty before updating the db
      this.$v.$touch()
      this.formTouched = !this.$v.$anyDirty
      this.errors = this.$v.$anyError
      // if no errors and no dirty values
      if(this.errors === false && this.formTouched === false){
         db.collection("users").doc(this.currentUser).get().then(() =>{
        // Access the users collection then update weight if not null
        if(weight != null){
          db.collection("users").doc(this.currentUser).update({
            weight: weight
          })
        }
      })
      }
    },
    // Height value changed
    onHeightChange (height) {
      // Check to see if entered data is dirty before updating the db
      this.$v.$touch()
      this.formTouched = !this.$v.$anyDirty
      this.errors = this.$v.$anyError
      if(this.errors === false && this.formTouched === false){
        // Access the users collection then update height if not null
        db.collection("users").doc(this.currentUser).get().then(() =>{
          if(height != null){
            db.collection("users").doc(this.currentUser).update({
              height: height
            })
          }
        })
      }
    },
    // NB. fieldValue - a sentinel value that can be used to tell server to remove
    //                  given elements from any array value that exists on the server
    // NB. arrayRemove - removes the exact item specified from the array
    
    // Delete an allergy
    deleteAllergy(allergy){
      db.collection("users").doc(this.currentUser).update({
        // remove the allergy from the object allergies from array
        allergy: fieldValue.arrayRemove(allergy)
      })
      
    },
    // Delete a condition
    deleteCondition (condition) {
       db.collection("users").doc(this.currentUser).update({
        // remove the condition from the object conditions from array
        condition: fieldValue.arrayRemove(condition)
      })
    },
    // Delete an immunisation
    deleteImmunisation (immunisation) {
      db.collection("users").doc(this.currentUser).update({
        // remove the immunisation from the object immunisations from array
        immunisation: fieldValue.arrayRemove(immunisation)
      })
    },
  },
};
</script>