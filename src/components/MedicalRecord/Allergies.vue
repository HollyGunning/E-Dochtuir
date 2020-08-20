<template>
      <!-- ANY ALLERGIES -->
      <v-col cols="12" md="12" lg="12">
      <v-card flat>
      <v-dialog v-model="dialogAllergies" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }"> 
       <v-card flat>
          <v-card-title class="overline">
            <v-spacer></v-spacer>
            <v-btn 
              small
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-plus</v-icon>
            Add Allergy
            </v-btn>
          </v-card-title>
        </v-card>
      </template>
      <v-card>
      <v-form @submit.prevent="saveAllergy()">
      <v-card-title class="primary lighten-1 white--text">Allergy
      <v-spacer></v-spacer>
        <v-btn class="mr-6" icon dark @click="cancelAllergy()"> 
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
              v-model.trim="allergyForm.allergyName"
              :counter="25"
              outlined
              required
              :error-messages="allergyNameErrors"
              @input="$v.allergyForm.allergyName.$touch()"
              @blur="$v.allergyForm.allergyName.$touch()"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
              v-model="allergyForm.selectedAllergyType"
              :items="allergyList"
              label="Allergy Type*"
              outlined
              required
              :error-messages="allergyTypeErrors"
              @input="$v.allergyForm.selectedAllergyType.$touch()"
              @blur="$v.allergyForm.selectedAllergyType.$touch()"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-textarea
              auto-grow
              rows="1"
              label="Details*"
              v-model="allergyForm.allergyDetails"
              :counter="150"
              :maxlength="150"
              outlined
              required
              :error-messages="allergyDetailsErrors"
              @input="$v.allergyForm.allergyDetails.$touch()"
              @blur="$v.allergyForm.allergyDetails.$touch()"
              ></v-textarea>
            </v-col>
              <v-col cols="12" sm="6">
                <v-select
                v-model="allergyForm.selectedSeverity"
                :items="severityList"
                label="Severity*"
                outlined
                required
                :error-messages="allergySeverityErrors"
                @input="$v.allergyForm.selectedSeverity.$touch()"
                @blur="$v.allergyForm.selectedSeverity.$touch()"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
        <v-col cols="12" class="mt-n6">
            <v-btn
            type="submit"
            block class="primary white--text"
            @click.prevent="saveAllergy()">
            <span>Add Allergy</span>
            </v-btn>
        </v-col>  
        </v-card-actions>
      </v-form>
        <v-snackbar 
        :color= "color"
        v-model="snackbar" 
        :timeout="timeout" 
        :multi-line="multiLine"
        > {{ snackbarText }} 
        </v-snackbar>
      </v-card>
      </v-dialog>
      </v-card>
      </v-col> <!-- allergies end -->
</template>

<script>
import {auth, db, fieldValue} from '../../firebase'
import { required } from 'vuelidate/lib/validators'

export default {
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
    },
    computed: {
    allergyNameErrors () {
      const errors = []
      if(!this.$v.allergyForm.allergyName.$dirty) return errors
        !this.$v.allergyForm.allergyName.required && errors.push('An Allergy Name Is Required')
      return errors
    },
    allergyTypeErrors () {
      const errors = []
      if(!this.$v.allergyForm.selectedAllergyType.$dirty) return errors
          !this.$v.allergyForm.selectedAllergyType.required && errors.push('Select The Type Of Allergy')
      return errors
    },
    allergyDetailsErrors () {
      const errors = []
      if(!this.$v.allergyForm.allergyDetails.$dirty) return errors
          !this.$v.allergyForm.allergyDetails.required && errors.push('Include Some Details About Your Allergy')
      return errors
    },
    allergySeverityErrors () {
      const errors = []
      if(!this.$v.allergyForm.selectedSeverity.$dirty) return errors
          !this.$v.allergyForm.selectedSeverity.required && errors.push('Select The Severity Of Your Allergy')
      return errors
    },        
    },
    data() {
        return {
            currentUser: null,
            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",

            dialogAllergies: false,
            allergyList: [
                { text: 'Drug Allergy', value: 'Drug Allergy'},
                { text: 'Food Allergy', value: 'Food Allergy'},
                { text: 'Pollen Allergy', value: 'Pollen Allergy'},
                { text: 'Insect Allergy', value: 'Insect Allergy'},
                { text: 'Latex Allergy', value: 'Latex Allergy'},
                { text: 'Other', value: 'Other'}, 
            ],
            severityList: [
                { text: 'Mild', value: 'Mild'},
                { text: 'Moderate', value: 'Moderate'},
                { text: 'Severe', value: 'Severe'},
                { text: 'Life Threatening', value: 'Life Threatening'},
                ],
            allergyForm: {
                allergyName: null,
                selectedAllergyType: null, // Value holds the allergy selected by the user
                allergyDetails: null, // Value holds user details
                selectedSeverity: null, // Value holds the severity selected by the user
            },
        }
    },
    validations: {
        allergyForm: {
        allergyName: { required },
        selectedAllergyType: { required },
        allergyDetails: { required },
        selectedSeverity: { required },
        },
    },
    methods: {
      triggerSnackbar (message, color) {
          this.snackbarText = message,
          this.color = color,
          this.snackbar = true
      },
      cancelAllergy() {
        this.snackbar = false
        this.dialogAllergies = false
        this.$v.$reset()
        this.allergyForm.allergyName = null
        this.allergyForm.selectedAllergyType = null
        this.allergyForm.allergyDetails = null
        this.allergyForm.selectedSeverity = null
      },
      saveAllergy () { 
        this.$v.$touch()
        this.formTouched = !this.$v.allergyForm.$anyDirty
        this.errors = this.$v.allergyForm.$anyError
            
        if(this.errors === false && this.formTouched === false){
            var addAllergy = {
            allergyName: this.allergyForm.allergyName,
            allergyType: this.allergyForm.selectedAllergyType,
            allergyDetails: this.allergyForm.allergyDetails,
            allergySeverity: this.allergyForm.selectedSeverity
            }
            var allergyRecord = { 
            allergy: fieldValue.arrayUnion(addAllergy)
            }
            this.triggerSnackbar("Allergy Was Successfully Added!", "success")
            db.collection("users").doc(this.currentUser).update(allergyRecord).then(() => {
            // Clear the form values
            this.$v.$reset()
            this.allergyForm.allergyName = null
            this.allergyForm.selectedAllergyType = null
            this.allergyForm.allergyDetails = null
            this.allergyForm.selectedSeverity = null
            }).catch(error => {
            console.log(error)
            }).then(() => {
              this.dialogAllergies = false
              this.snackbar = false
            })
        }else{
            this.triggerSnackbar("There Are Errors Preventing You From Submitting This Form", "error")
        }
      },
    },	
}
</script>