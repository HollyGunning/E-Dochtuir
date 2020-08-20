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
                <v-autocomplete
                label="Search Condition Name"
                v-model="conditionForm.conditionName"
                :items="conditions"
                item-text="name"
                item-value="value"
                outlined
                :error-messages="conditionNameErrors"
                @input="$v.conditionForm.conditionName.$touch()"
                @blur="$v.conditionForm.conditionName.$touch()"
                ></v-autocomplete>
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
              <v-col cols="12" sm="6" md="6">
                <v-menu
                v-model="menu"
                :close-on-content-click="false"
                max-width="290"
                >
                <template v-slot:activator="{ on, attrs }">
                <v-text-field
                label="Select Date*"
                readonly
                :value="conditionForm.conditionDate"
                v-bind="attrs"
                v-on="on"
                required
                outlined
                :error-messages="conditionDateErrors"
                @input="$v.conditionForm.conditionDate.$touch()"
                @blur="$v.conditionForm.conditionDate.$touch()"
                @click:clear="conditionForm.conditionDate = null"
                
                ></v-text-field>
                </template>
                <v-date-picker 
                full-width
                scrollable
                show-current
                :max="getTodaysDate()"
                v-model="conditionForm.conditionDate" 
                @input="menu = false"
                >
                </v-date-picker>
                </v-menu>
              </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
          <v-col cols="12" class="mt-n6">
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
        conditionDateErrors () {
        const errors = []
        if(!this.$v.conditionForm.conditionDate.$dirty) return errors
            !this.$v.conditionForm.conditionDate.required && errors.push('Select Date Of Condition Diagnosis')
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
            menu: false,
            dialogCondition: false,
            conditions: [
              { name: 'Alzheimer`s Disease', value: 'Alzheimer`s Disease'},
              { name: 'Anemia', value: 'Anemia'},
              { name: 'Asthma', value: 'Asthma'},
              { name: 'Atopic Dermatitis', value: 'Atopic Dermatitis'},
              { name: 'Atrial Fibrillation', value: 'Atrial Fibrillation'},
              { name: 'Attention Deficit Hyperactivity Disorder', value: 'Attention Deficit Hyperactivity Disorder'},
              { name: 'Autism or Asperger`s Syndrome', value: 'Autism or Asperger`s Syndrome'},
              { name: 'Bipolar Mood Disorder', value: 'Bipolar Mood Disorder'},
              { name: 'Bronchiectasis', value: 'Bronchiectasis'},
              { name: 'Cancer', value: 'Cancer'},
              { name: 'Cardiac Failure', value: 'Cardiac Failure'},
              { name: 'Cardiomyopathy', value: 'Cardiomyopathy'},
              { name: 'Cerebral Palsy', value: 'Cerebral Palsy'},
              { name: 'Cerebrovascular Disease', value: 'Cerebrovascular Disease'},
              { name: 'Chronic Fatigue Syndrome', value: 'Chronic Fatigue Syndrome'},
              { name: 'Chronic Hepatitis', value: 'Chronic Hepatitis'},
              { name: 'Chronic Kidney Disease', value: 'Chronic Kidney Disease'},
              { name: 'Chronic Obstructive Pulmonary Disorder', value: 'Chronic Obstructive Pulmonary Disorder'},
              { name: 'Chronic Renal Disease', value: 'Chronic Renal Disease'},
              { name: 'Coeliac Disease', value: 'Coeliac Disease'},
              { name: 'Complex Regional Pain Syndrome', value: 'Complex Regional Pain Syndrome'},
              { name: 'Coronary Artery Disease', value: 'Coronary Artery Disease'},
              { name: 'Crohn`s Disease', value: 'Crohn`s Disease'},
              { name: 'Deafness & Hearing Impairment', value: 'Deafness & Hearing Impairment'},
              { name: 'Dermatological Conditions', value: 'Dermatological Conditions'},
              { name: 'Diabetes Insipidus', value: 'Diabetes Insipidus'},
              { name: 'Diabetes Mellitus Types 1 & 2', value: 'Diabetes Mellitus Types 1 & 2'},
              { name: 'Dysrhythmias', value: 'Dysrhythmias'},
              { name: 'Ehlers-Danlos Syndrome', value: 'Ehlers-Danlos Syndrome'},
              { name: 'Endometriosis', value: 'Endometriosis'},
              { name: 'Epilepsy', value: 'Epilepsy'},
              { name: 'Fetal Alcohol Spectrum Disorder', value: 'Fetal Alcohol Spectrum Disorder'},
              { name: 'Fibromyalgia', value: 'Fibromyalgia'},
              { name: 'Gestational Diabetes', value: 'Gestational Diabetes'},
              { name: 'Glaucoma  ', value: 'Glaucoma  '},
              { name: 'Haemophilia', value: 'Haemophilia'},
              { name: 'Hashimoto`s Thyroiditis / Hashimoto`s Disease', value: 'Hashimoto`s Thyroiditis / Hashimoto`s Disease'},
              { name: 'HIV/AIDS', value: 'HIV/AIDS'},
              { name: 'Huntington`s Disease', value: 'Huntington`s Disease'},
              { name: 'Hyperlipidaemia', value: 'Hyperlipidaemia'},
              { name: 'Hypertension', value: 'Hypertension'},
              { name: 'Hypothyroidism', value: 'Hypothyroidism'},
              { name: 'Ischemic Cardiomyopathy', value: 'Ischemic Cardiomyopathy'},
              { name: 'Mental Illness', value: 'Mental Illness'},
              { name: 'Migraines', value: 'Migraines'},
              { name: 'Multiple Sclerosis', value: 'Multiple Sclerosis'},
              { name: 'Myasthenia Gravis', value: 'Myasthenia Gravis'},
              { name: 'Narcolepsy', value: 'Narcolepsy'},
              { name: 'Obesity', value: 'Obesity'},
              { name: 'Osteoarthritis', value: 'Osteoarthritis'},
              { name: 'Osteoporosis', value: 'Osteoporosis'},
              { name: 'Parkinson`s Disease', value: 'Parkinson`s Disease'},
              { name: 'Periodontal Disease', value: 'Periodontal Disease'},
              { name: 'Polycystic Ovary Syndrome', value: 'Polycystic Ovary Syndrome'},
              { name: 'Postural Orthostatic Tachycardia Syndrome', value: 'Postural Orthostatic Tachycardia Syndrome'},
              { name: 'Post-Vasectomy Pain Syndrome', value: 'Post-Vasectomy Pain Syndrome'},
              { name: 'Pre-Diabetes', value: 'Pre-Diabetes'},
              { name: 'Psoriasis', value: 'Psoriasis'},
              { name: 'Relapsing Polychondritis', value: 'Relapsing Polychondritis'},
              { name: 'Rheumatoid Arthritis', value: 'Rheumatoid Arthritis'},
              { name: 'Schizophrenia', value: 'Schizophrenia'},
              { name: 'Sleep Apnea', value: 'Sleep Apnea'},
              { name: 'Substance Abuse Disorders', value: 'Substance Abuse Disorders'},
              { name: 'Systemic Lupus Erythematosus', value: 'Systemic Lupus Erythematosus'},
              { name: 'Thyroid Disease', value: 'Thyroid Disease'},
              { name: 'Ulcerative Colitis', value: 'Ulcerative Colitis'},
            ],
            conditionForm: {
            condtionName: null,
            conditionDetails: null,
            conditionDate: null,
            },
        }
    },
    validations: {
        conditionForm: {
        conditionName: { required },
        conditionDetails: { required },
        conditionDate: { required }
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
        this.conditionForm.conditionDate = null
      },
      getTodaysDate () {
        let today = new Date ()
        today.setDate(today.getDate())
        return today.toISOString()
      },
      saveCondition () {
          this.$v.$touch()
          this.formTouched = !this.$v.conditionForm.$anyDirty
          this.errors = this.$v.conditionForm.$anyError

          if(this.errors === false && this.formTouched === false){
              var addCondition = {
                conditionName: this.conditionForm.conditionName,
                conditionDetails: this.conditionForm.conditionDetails,
                conditionDate: this.conditionForm.conditionDate,
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
                  this.conditionForm.conditionDate = null
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