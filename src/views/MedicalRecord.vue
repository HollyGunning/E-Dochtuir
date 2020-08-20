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
                    <v-spacer></v-spacer>
                  <v-subheader class="overline primary lighten-1 white--text">
                  {{ allergy.allergyType }}
                  </v-subheader>
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
                    <v-icon class="mr-4 white--text">fa-allergies</v-icon>
                    {{ condition.conditionName }}
                    <v-spacer></v-spacer>
                  <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
                  </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-list>
                            <v-list-item>
                              <v-list-item-content>
                                <v-list-item-title 
                                class="overline grey--text mb-4">Descirption
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
        <v-tab-item><!-- immunisationS --> 
          <v-card>
            <immunisations />
              <v-col cols="12" md="12">
              <v-card outlined class="mt-2" v-for="(immunisation, index) in immunisations" :key="index">
                <v-card-title class="primary lighten-1 white--text">
                  <v-icon class="mr-4 white--text">fa-allergies</v-icon>
                  {{ immunisation.immunisationName }}
                  <v-spacer></v-spacer>
                <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
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
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
          </v-card>
        </v-tab-item>


      </v-tabs-items>
    </v-col>

    <v-snackbar 
    :color= "color"
    v-model="snackbar" 
    :timeout="timeout" 
    :multi-line="multiLine"
    > {{ snackbarText }} </v-snackbar>

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

import { auth, db } from '../firebase'


export default {
  components: {
    Navbar,
    Allergies,
    Conditions,
    Immunisations,
  },
  data() {
    return {
      currentUser: null,

      snackbar: false,
      color: null,
      multiLine: true,
      timeout: 5000,
      snackbarText: "",

      // Tabs for upcoming and past
      tab: null,
      tabs: [
      { tabName: 'Allergies' },
      { tabName: 'Conditions' },
      { tabName: 'Immunisations' },
      ],


      gender: null, // Gender value passes from db to buttons and highlights active one
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
      
      allergies: [], // Store allergies here to display to user
      conditions: [], // Store conditions here to display to user
      immunisations: [], // Store immunisations here to display to user
    }
  },
  validations: {

  },
  created() {
    this.currentUser = auth.currentUser.uid // Get current users ID
    // Realtime listen to the patients record in the users collection
    db.collection("users").doc(this.currentUser).onSnapshot(doc => {
      let storedRecord = doc.data()
      storedRecord.id = doc.id
    
      // Populate these values to display to the user what fields are currently holding info
      this.gender = storedRecord.gender
      this.selectedBlood = storedRecord.bloodType
      this.weight = storedRecord.weight
      this.height = storedRecord.height

      // Populate the arrays with corresponding data from users record
      this.allergies = storedRecord.allergy
      this.conditions = storedRecord.condition
      this.immunisations = storedRecord.immunisation
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

    triggerSnackbar (message, color) {
      this.snackbarText = message,
      this.color = color,
      this.snackbar = true
    },





  },
};
</script>