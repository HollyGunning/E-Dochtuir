<template>
    <!-- Any Conditions -->
    <v-col cols="12" md="12" lg="12">
      <v-card flat>
      <v-dialog v-model="dialogCondition" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }"> 
       <v-card flat>
          <v-card-title class="overline">
            <v-spacer></v-spacer>
            <v-btn 
              small
              v-bind="attrs"
              v-on="on"
            ><v-icon>mdi-plus</v-icon>
            Add Condition
            </v-btn>
          </v-card-title>
        </v-card>
      </template>

        <v-card>
        <v-form @submit.prevent="saveCondition()">
        <v-card-title class="primary lighten-1 white--text">Condition
        <v-spacer></v-spacer>
          <v-btn class="mr-6" icon dark @click="cancelCondition()"> 
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
                  v-model.trim="conditionForm.conditionName"
                  :counter="25"
                  outlined
                  required
                  :error-messages="conditionNameErrors"
                  @input="$v.conditionForm.conditionName.$touch()"
                  @blur="$v.conditionForm.conditionName.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-textarea
                auto-grow
                rows="1"
                label="Details*"
                v-model.trim="conditionForm.conditionDetails"
                :counter="150"
                :maxlength="150"
                outlined
                required
                :error-messages="conditionDetailsErrors"
                @input="$v.conditionForm.conditionDetails.$touch()"
                @blur="$v.conditionForm.conditionDetails.$touch()"
                ></v-textarea>
              </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
          <v-col cols="12">
              <v-btn
              
              block class="primary white--text"
              @click.prevent="saveCondition()">
              <span>Add Condition</span>
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
      </v-col> <!-- conditions end -->
</template>

<script>
import {auth, db, fieldValue} from '../../firebase'
import { required } from 'vuelidate/lib/validators'

export default {
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
    },
    computed: {
        conditionNameErrors () {
        const errors = []
        if(!this.$v.conditionForm.conditionName.$dirty) return errors
            !this.$v.conditionForm.conditionName.required && errors.push('A Condition Name Is Required')
        return errors
        },
        conditionDetailsErrors () {
        const errors = []
        if(!this.$v.conditionForm.conditionDetails.$dirty) return errors
            !this.$v.conditionForm.conditionDetails.required && errors.push('Include Some Details About Your Condition')
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

            dialogCondition: false,
            conditionForm: {
            condtionName: null,
            conditionDetails: null,
      },
        }
    },
    validations: {
        conditionForm: {
        conditionName: { required },
        conditionDetails: { required },
        },
    },
    methods: {
      triggerSnackbar (message, color) {
        this.snackbarText = message,
        this.color = color,
        this.snackbar = true
      },
      cancelCondition() {
        this.snackbar = false
        this.dialogCondition = false
        this.$v.$reset()
        this.conditionForm.conditionName = null
        this.conditionForm.conditionDetails = null
      },
      saveCondition () {
          this.$v.$touch()
          this.formTouched = !this.$v.conditionForm.$anyDirty
          this.errors = this.$v.conditionForm.$anyError

          if(this.errors === false && this.formTouched === false){
              var addCondition = {
              conditionName: this.conditionForm.conditionName,
              conditionDetails: this.conditionForm.conditionDetails
              }
              var conditionRecord = {
              condition: fieldValue.arrayUnion(addCondition)
              }
              this.triggerSnackbar("Condition Was Successfully Added!", "success")
              db.collection("users").doc(this.currentUser).update(conditionRecord).then(() => {
                  // Clear the form values
                  this.$v.$reset()
                  this.conditionForm.conditionName = null
                  this.conditionForm.conditionDetails = null
              }).catch(error => {
              console.log(error)
              }).then(() =>{
                  this.dialogCondition = false
                  this.snackbar = false
              })
          }
          else{
              this.triggerSnackbar("There Are Errors Preventing You From Submitting This Form", "error")
          }
      },   
    }
}
</script>