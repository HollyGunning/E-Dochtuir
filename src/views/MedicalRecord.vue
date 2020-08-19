<template>
<v-container>
<Navbar />

<v-row><v-col cols="12" md="12" lg="12">

  <v-card flat>
    <v-card-title class="primary lighten-1 white--text">Medical Record
    <v-spacer></v-spacer>
    </v-card-title>
      <v-row>

        
      <!-- GENDER -->
      <v-col cols="12" sm="6" md="6" lg="3">
       <v-card flat>
          <v-card-title class="overline">
            <v-subheader  class="overline ml-n5">Gender
            <v-divider></v-divider>
            </v-subheader>
          </v-card-title>
          <v-card-text>
            <v-btn-toggle 
            v-model="gender" 
            color="primary" 
            group 
            @change="onGenderChange(gender)"
            >
              <v-btn depressed x-large color="primary--text darken-1" value="female">
              <v-icon class="mr-2">fa-venus</v-icon>Female
              </v-btn>
              <v-btn depressed x-large color="primary--text darken-1" value="male">
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
            <v-subheader  class="overline ml-n5">Bloods
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
          <v-subheader  class="overline ml-n5">Weight & Height
            <v-divider></v-divider>
          </v-subheader>
        </v-card-title>
        <v-card-text>
          <v-text-field
          label="Weight"
          type="number"
          v-model="weight"
          outlined 
          prepend-icon="fa-weight"
          suffix="lbs"
          @change="onWeightChange(weight)"
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
              type="number"
              v-model="height"
              outlined 
              prepend-icon="fa-ruler-vertical"
              suffix="inches"
              @change="onHeightChange(height)"
              ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>




      <!-- ANY ALLERGIES -->
      <v-col cols="12" md="6" lg="6">
      <v-card >
      <v-dialog v-model="dialogAllergies" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }"> 
       <v-card flat>
          <v-card-title class="overline">
            <v-subheader class="overline ml-n5">Allergies
              <v-divider></v-divider>
            </v-subheader>
            <v-spacer></v-spacer>
            <v-btn 
              small
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-plus</v-icon>
            Add Allergy
            </v-btn>
          </v-card-title>
          <v-card-text>     

            <v-card outlined class="mt-2" v-for="(allergy, index) in allergies" :key="index">
              <v-card-title class="primary lighten-1 white--text">
                <v-icon class="mr-4 white--text">fa-allergies</v-icon>
                {{ allergy.allergyName }}
                <v-spacer></v-spacer>
              <v-subheader class="overline primary lighten-1 white--text">
              {{ allergy.allergyType }}
              </v-subheader>
              </v-card-title>

              <v-card-text class="mt-4">
                <v-row class="mt-n4">
                  <v-col cols="12" md="4">
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title 
                          class="overline grey--text mb-4">Severity

                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>

              
                <!-- v-Severity: {{ allergy.allergySeverity }}
                <v-spacer></v-spacer>
                Descirption: {{ allergy.allergyDetails }} -->
              </v-card-text>
            </v-card>

          </v-card-text>
        </v-card>
      </template>
      
        <v-card>
        <v-form @submit.prevent="saveAllergy()">
        <v-card-title class="primary lighten-1 white--text">Allergy
        <v-spacer></v-spacer>
          <v-btn class="mr-6" icon dark @click="dialogAllergies = false"> 
          <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
          <span>Cancel</span>
          </v-btn>
        </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Allergen Name*"
                  v-model="allergyName"
                  :counter="25"
                  outlined
                  required
                  :error-messages="allergyNameErrors"
                  @input="$v.allergyName.$touch()"
                  @blur="$v.allergyName.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select
                v-model="selectedAllergyType"
                :items="allergyList"
                label="Allergy Type*"
                outlined
                required
                :error-messages="allergyTypeErrors"
                @input="$v.selectedAllergyType.$touch()"
                @blur="$v.selectedAllergyType.$touch()"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-textarea
                auto-grow
                rows="1"
                label="Details*"
                v-model="allergyDetails"
                :counter="150"
                :maxlength="150"
                outlined
                required
                :error-messages="allergyDetailsErrors"
                @input="$v.allergyDetails.$touch()"
                @blur="$v.allergyDetails.$touch()"
                ></v-textarea>
              </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                  v-model="selectedSeverity"
                  :items="severityList"
                  label="Severity*"
                  outlined
                  required
                  :error-messages="allergySeverityErrors"
                  @input="$v.selectedSeverity.$touch()"
                  @blur="$v.selectedSeverity.$touch()"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
          <v-col cols="12">
              <v-btn
              type="submit"
              block class="primary white--text"
              @click.prevent="saveAllergy()">
              <span>Add Allergy</span>
              </v-btn>
          </v-col>
          </v-card-actions>
        </v-form>
        </v-card>
        
      </v-dialog>
      </v-card>
      </v-col> <!-- allergies end -->





      <!-- ANY CONDITIONS -->
      <v-col cols="12" md="6" lg="6">
      <v-card >
      <v-dialog v-model="dialogCondition" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }"> 
       <v-card flat>
          <v-card-title class="overline">
            <v-subheader class="overline ml-n5">Conditions
              <v-divider></v-divider>
            </v-subheader>
            <v-spacer></v-spacer>
            <v-btn 
              small
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-plus</v-icon>
            Add Condition
            </v-btn>
          </v-card-title>
          <v-card-text>     

            <v-card outlined class="mt-2" v-for="(condition, index) in conditions" :key="index">
              <v-card-title class="primary lighten-1 white--text">
                <v-icon class="mr-4 white--text">fa-star-of-life</v-icon>
                {{ condition.conditionName }}
                <v-spacer></v-spacer>
         
              </v-card-title>
              <v-card-text>
                Descirption: {{ condition.conditionDetails }}
             
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </template>

        <v-card>
        <v-form @submit.prevent="saveCondition()">
        <v-card-title class="primary lighten-1 white--text">Condition
        <v-spacer></v-spacer>
          <v-btn class="mr-6" icon dark @click="dialogCondition = false"> 
          <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
          <span>Cancel</span>
          </v-btn>
        </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Condition Name*"
                  v-model="condtionName"
                  :counter="25"
                  outlined
                  required
                  :error-messages="conditionNameErrors"
                  @input="$v.condtionName.$touch()"
                  @blur="$v.condtionName.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-textarea
                auto-grow
                rows="1"
                label="Details*"
                v-model="conditionDetails"
                :counter="150"
                :maxlength="150"
                outlined
                required
                :error-messages="conditionDetailsErrors"
                @input="$v.conditionDetails.$touch()"
                @blur="$v.conditionDetails.$touch()"
                ></v-textarea>
              </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
          <v-col cols="12">
              <v-btn
              type="submit"
              block class="primary white--text"
              @click.prevent="saveCondition()">
              <span>Add Condition</span>
              </v-btn>
          </v-col>
          </v-card-actions>
        </v-form>
        </v-card>
        
      </v-dialog>
      </v-card>
      </v-col> <!-- conditions end -->



    </v-row>
  </v-card>
</v-col></v-row>

</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import { auth, db, fieldValue } from '../firebase'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    Navbar,
  },
  computed: {
    allergyNameErrors () {
      const errors = []
      if(!this.$v.allergyName.$dirty) return errors
        !this.$v.allergyName.required && errors.push('Provide a name for allergy')
      return errors
    },
    allergyDetailsErrors () {
      const errors = []
      if(!this.$v.allergyDetails.$dirty) return errors
          !this.$v.allergyDetails.required && errors.push('This field is required')
      return errors
    },
    allergyTypeErrors () {
      const errors = []
      if(!this.$v.selectedAllergyType.$dirty) return errors
          !this.$v.selectedAllergyType.required && errors.push('Please select an allergy type')
      return errors
    },
    allergySeverityErrors () {
      const errors = []
      if(!this.$v.selectedSeverity.$dirty) return errors
          !this.$v.selectedSeverity.required && errors.push('Please select a severity')
      return errors
    },
    conditionNameErrors () {
    const errors = []
      if(!this.$v.conditionName.$dirty) return errors
          !this.$v.conditionName.required && errors.push('Please select a condition name')
      return errors
    },
    conditionDetailsErrors () {
    const errors = []
      if(!this.$v.conditionDetails.$dirty) return errors
          !this.$v.conditionDetails.required && errors.push('This field is required')
      return errors
    },

  },
  validations: {
    allergyName: { required },
    selectedAllergyType: { required },
    allergyDetails: { required },
    selectedSeverity: { required },

    conditionName: { required },
    conditionDetails: { required },
  },
  data() {
    return {
      currentUser: null,

      gender: null,

      measuringUnit: null, // Pass to the method onMeasurementChange() to determine which gets displayed
      units: [
        { text: 'Metric', value: 'metric' },
        { text: 'US', value: 'us' },
      ],
      // Toggle between the two views for weight and height
      showMetric: false,
      showUS: false,
      weight: null, // Used to store weight
      height: null, // Used to store height

      selectedBlood: null, // Used to store the selected blood type
      bloods: [
        {text: 'None'},
        {text: 'A+'},
        {text: 'A-'},
        {text: 'B+'},
        {text: 'B-'},
        {text: 'O+'},
        {text: 'O-'},
        {text: 'AB+'},
        {text: 'AB-'},
      ],
        
      dialogAllergies: false,

      allergyName: null,
      selectedAllergyType: null, // Value holds the allergy selected by the user
      allergyList: [
        { text: 'Drug Allergy', value: 'Drug Allergy'},
        { text: 'Food Allergy', value: 'Food Allergy'},
        { text: 'Pollen Allergy', value: 'Pollen Allergy'},
        { text: 'Insect Allergy', value: 'Insect Allergy'},
        { text: 'Latex Allergy', value: 'Latex Allergy'},
        { text: 'Other', value: 'Other'},
      ],
      allergyDetails: null, // Value holds user details
      selectedSeverity: null, // Value holds the severity selected by the user
      severityList: [
        { text: 'Mild', value: 'mild'},
        { text: 'Moderate', value: 'moderate'},
        { text: 'Severe', value: 'severe'},
        { text: 'Life Threatening', value: 'lifeThreatening'},
      ],
      allergies: [], // Store allergies here to display to user

      dialogCondition: false,
      condtionName: null,
      conditionDetails: null,
      conditions: [],
    }
  },
  created() {
    this.currentUser = auth.currentUser.uid // Get current users ID
    
    // Realtime listen to the patients record in the users collection
    db.collection("users").doc(this.currentUser).onSnapshot(doc => {
      let storedRecord = doc.data()
      storedRecord.id = doc.id
    
      this.gender = storedRecord.gender
      this.selectedBlood = storedRecord.bloodType
      this.weight = storedRecord.weight
      this.height = storedRecord.height
      this.allergies = storedRecord.allergy
    })


  },
  methods: {
    onGenderChange (gender) {
      // Access the users collection then update gender value
      db.collection("users").doc(this.currentUser).get().then(() =>{
        if(gender != null){
          db.collection("users").doc(this.currentUser).update({
            gender: gender
          })
        }
      })

    },
    onBloodsChange(selectedBlood) {
      // Access the users collection then update blood type
      db.collection("users").doc(this.currentUser).get().then(() =>{
        if(selectedBlood != null){
          db.collection("users").doc(this.currentUser).update({
            bloodType: selectedBlood
          })
        }
      })
    },
    onWeightChange (weight) {
      db.collection("users").doc(this.currentUser).get().then(() =>{
        // Access the users collection then update weight
        if(weight != null){
          db.collection("users").doc(this.currentUser).update({
            weight: weight
          })
        }
      })
    },
    onHeightChange (height) {
      // Access the users collection then update height
      db.collection("users").doc(this.currentUser).get().then(() =>{
        if(height != null){
          db.collection("users").doc(this.currentUser).update({
            height: height
          })
        }
      })
    },

    saveAllergy () { 
    var addAllergy = {
        allergyName: this.allergyName,
        allergyType: this.selectedAllergyType,
        allergyDetails: this.allergyDetails,
        allergySeverity: this.selectedSeverity
    }

     var allergyRecord = { 
      allergy: fieldValue.arrayUnion(addAllergy)
     }

      this.$v.$touch()
      this.formTouched = !this.$v.$anyDirty
      this.errors = this.$v.$anyError

      if(this.errors === false && this.formTouched === false){
        db.collection("users").doc(this.currentUser).update(allergyRecord).then(() => {
          console.log("Allergy added")
        }).catch(error => {
          console.log(error)
        })
      }
  
    },

    saveCondition () {
      
      this.$v.$touch()
      this.formTouched = !this.$v.$anyDirty
      this.errors = this.$v.$anyError

      if(this.errors === false && this.formTouched === false){
        console.log("Condtion will be entered")
      }

  
    },

  },

};
</script>

<style scoped>

</style>