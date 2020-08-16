<template>
<v-container>

<v-row><v-col cols="12" md="12" lg="12">

  <v-card flat>
    <v-card-title class="primary lighten-1 white--text">Medical Record
    <v-spacer></v-spacer>
    </v-card-title>
      <v-row>

      <v-col cols="12" md="6" lg="6">
       <v-card flat>
          <v-card-title class="overline">
            <v-subheader  class="overline ml-n5">Gender
            <v-divider></v-divider>
            </v-subheader>
          </v-card-title>
          <v-card-text>
            <v-btn-toggle v-model="gender" color="primary" group @change="onGenderChange(gender)">
            <v-btn x-large value="female">
            <v-icon class="mr-2">fa-venus</v-icon>Female
            </v-btn>
            <v-btn x-large value="male">
            <v-icon class="mr-2">fa-mars</v-icon>Male
            </v-btn>
            </v-btn-toggle>
          </v-card-text>
      </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="6">
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

      <v-col cols="12" md="12" lg="12">
      <v-card flat>
        <v-card-title >                   
          <v-subheader  class="overline ml-n5">Weight & Height
            <v-divider></v-divider>
          </v-subheader>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" lg="6">
              <v-select 
              v-model="measuringUnit"
              :items="units"
              label="Unit of Measurements"
              prepend-icon="fa-ruler-combined"
              @change="onMeasurementChange(measuringUnit)"
              outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" lg="6">
              <v-card flat v-if="showMetric">
              <v-text-field label="Weight" 
              outlined 
              hint="Weight in kg"
              prepend-icon="fa-weight"
              ></v-text-field>
              <v-text-field 
              label="Height" 
              outlined 
              hint="Height in cm"
              prepend-icon="fa-ruler-vertical"
              ></v-text-field>
              </v-card>
              <v-card flat v-if="showUS">
              <v-text-field label="Weight" 
              outlined hint="Weight in lbs"
              prepend-icon="fa-weight"
              ></v-text-field>
              <v-text-field label="Height" 
              outlined 
              hint="Height in inches"
              prepend-icon="fa-ruler-vertical"
              ></v-text-field>
              </v-card> 
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      </v-col>

      <!-- ANY ALLERGIES -->
      <v-col cols="12" md="6" lg="6">
      <v-card flat>
      <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }"> 
       <v-card flat>
          <v-card-title class="overline">
            <v-subheader  class="overline ml-n5">Allergies
              <v-divider></v-divider>
            </v-subheader>
            <v-spacer></v-spacer>
            <v-btn
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-plus</v-icon>
            Add Allergy
            </v-btn>
          </v-card-title>
          <v-card-text>     

            <v-card outlined>
              <p>Info here</p>
            </v-card>


          </v-card-text>
        </v-card>
      </template>
      
      <v-card>
      <v-form @submit.prevent="saveAllergy()">
      <v-card-title class="primary lighten-1 white--text">Allergy
      <v-spacer></v-spacer>
      </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Allergen Name"
                v-model="allergyName"
                :counter="25"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
              v-model="selectedAllergyType"
              :items="allergyList"
              label="Allergy Type"
              outlined
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Details"
                v-model="allergyDetails"
                :counter="50"
                outlined
              ></v-text-field>
            </v-col>
              <v-col cols="12" sm="6">
                <v-select
                v-model="selectedSeverity"
                :items="severityList"
                label="Severity"
                outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          
        <v-btn left color="primary" text @click="dialog = false">Cancel</v-btn>
         <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveAllergy()">Save</v-btn>
        </v-card-actions>
      </v-form>
      </v-card>
      
      </v-dialog>


</v-card>
      </v-col>






      <v-col cols="12" md="6" lg="6">
       <v-card flat>
          <v-card-title class="overline">
            <v-subheader  class="overline ml-n5">Conditions
            <v-divider></v-divider>
            </v-subheader>
          </v-card-title>
          <v-card-text>


          </v-card-text>
      </v-card>
      </v-col>



    </v-row>
  </v-card>
</v-col></v-row>

</v-container>
</template>

<script>
import {auth, db} from '../firebase'

export default {
components: {
 
  },
  data() {
    return {

      gender: null,

      measuringUnit: null,
      units: [
        { text: 'Metric', value: 'metric' },
        { text: 'US', value: 'us' },
      ],

      showMetric: false,
      showUS: false,

      
      weight: null,
      height: null,

      selectedBlood: null,
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
        
      dialog: false,
      allergyName: null,
      selectedAllergyType: null,
      allergyList: [
        { text: 'None', value: 'none'},
        { text: 'Drug Allergy', value: 'drugAllergy'},
        { text: 'Food Allergy', value: 'foodAllergy'},
        { text: 'Pollen Allergy', value: 'pollenAllergy'},
        { text: 'Insect Allergy', value: 'insectAllergy'},
        { text: 'Latex Allergy', value: 'latexAllergy'},
        { text: 'Other', value: 'other'},

      ],
      allergyDetails: null,
      selectedSeverity: null,
      severityList: [
        { text: 'Mild', value: 'mild'},
        { text: 'Moderate', value: 'moderate'},
        { text: 'Severe', value: 'severe'},
        { text: 'Life Threatening', value: 'lifeThreatening'},
      ],
    }
  },
  methods: {
    onGenderChange (gender) {
      var currentUser = auth.currentUser.uid

      db.collection("medicalRecords").doc(currentUser).set({
        gender: gender
      })
    },
    onBloodsChange(selectedBlood) {
      console.log(selectedBlood)
    },
    onMeasurementChange (measuringUnit) {
      if(measuringUnit == "metric"){
        this.showUS = false
        this.showMetric = true
      }
      else if(measuringUnit == "us"){
        this.showMetric = false
        this.showUS = true
      }
      else{
        this.showMetric = false
        this.showUS = false
      }
      
    },

    saveAllergy () {
      var currentUser = auth.currentUser.uid

      db.collection("medicalRecords").doc().set({
        patientID: currentUser,
        allergyName: this.allergyName,
        allergyType: this.selectedAllergyType,
        allergyDetails: this.allergyDetails,
        allergySeverity: this.selectedSeverity
      })
    },
  },

};
</script>