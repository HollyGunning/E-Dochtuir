<template>
<v-container>
<Navbar />
    <v-row><v-col cols="12">
   

     <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <!-- Viewing of appointments occurs here --> 
          <v-card flat>
            <v-card-title class="primary lighten-1 white--text">Prescriptions
            <v-spacer></v-spacer>
              <v-btn
              class="mx-2" 
              fab small
              dark color="primary darken-1"
              v-bind="attrs"
              v-on="on"
              >
              <v-icon>fa-plus</v-icon>
              </v-btn>
            </v-card-title>
              <!-- View Prescriptions Component is imported here, makes it easier to keep the code tidier --> 
              <!-- <ViewAppointments /> -->
          </v-card>
        </template>
        <!-- Book appointment starts here -->
        <v-card>   
        <v-card-title class="primary white--text">
          Request Prescription
          <v-spacer></v-spacer>
          <v-btn class="mr-4" icon dark @click="cancel()"> 
          <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
          <span>Cancel</span>
          </v-btn>
        </v-card-title>
        <v-divider class="mx4"></v-divider>
        <v-form @submit.prevent="requestPrescription">
        <v-card-text>
          <v-row>     
              
            <!-- Date Options -->
            <v-col cols="12" sm="4" md="4">
                <v-select   
                label="Gender for Treatment"
                v-model="genderOption"
                :items="chooseGenderOptions"
                outlined
                @change="setGenderOption(genderOption)"



                ></v-select>
            </v-col>

            <v-col cols="12" sm="4" md="4" v-if="showFemaleT">
                <v-select
                label="Female Treatments"
                v-model="chosenOption"
                :items="femaleTreatments"
                outlined
                @change="setTreatmentOption(chosenOption)"



                ></v-select>
            </v-col>

            <v-col cols="12" sm="4" md="4" v-if="showMaleT">
                <v-select
                label="Male Treatments"
                v-model="chosenOption"
                :items="maleTreatments"
                outlined
                @change="setTreatmentOption(chosenOption)"



                ></v-select>
            </v-col>

            <!-- TEST -->
            <v-col cols="12">

            </v-col>







         
            <v-col cols="12">
                <!-- Asthma -->
                <v-card v-if="showAsthma">
                    <v-card-title class="primary lighten-1 white--text">Asthma Treatment</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                Label
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- Adrenaline -->
                <v-card v-if="showAdrenaline">
                    <v-card-title class="primary lighten-1 white--text">Adrenaline Pen Treatment</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
                <!-- Contraception -->
                <v-card v-if="showContraception">
                    <v-card-title class="primary lighten-1 white--text">Contraception Pill & Patch</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Choose a contraceptive</v-subheader>
                                <v-select
                                label="Contraceptive Type"
                                v-model="contraceptives.contraceptiveType"
                                :items="contraceptiveList"
                                outlined
                                :error-messages="contraceptiveTypeError"
                                @input="$v.contraceptives.contraceptiveType.$touch()"
                                @blur="$v.contraceptives.contraceptiveType.$touch()"
                                >
                                </v-select>   
                            </v-col>
                            <v-col cols="6" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Regulated Periods?</v-subheader>
                                <v-btn-toggle
                                    v-model="contraceptives.periodsRegular" 
                                    color="primary" 
                                    group 
                                    mandatory
                                    >
                                    <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                                    <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="6" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Previous Usage?</v-subheader>
                                <v-btn-toggle
                                    v-model="contraceptives.previoulyTaken" 
                                    color="primary" 
                                    group 
                                    mandatory
                                    
                                    >
                                    <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                                    <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="6" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Any Side Effects?</v-subheader>
                                <v-btn-toggle
                                    v-model="contraceptives.sideEffects" 
                                    color="primary" 
                                    group 
                                    mandatory
                                    
                                    >
                                    <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                                    <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="12" md="6" lg="6">
                                <v-textarea
                                label="Describe side effects"
                                v-model="contraceptives.sideEffectDescription"
                                outlined
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- Periods -->
                <v-card v-if="showPeriodDelay">
                    <v-card-title class="primary lighten-1 white--text">Period Delay Pill</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
                <!-- STI Test Kit -->
                <v-card v-if="showSTIKit">
                    <v-card-title class="primary lighten-1 white--text">STI Test Kit</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
                <!-- Thrush -->
                <v-card v-if="showThrush">
                    <v-card-title class="primary lighten-1 white--text">Thrush Treatment</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
                <!-- ErecDys -->
                <v-card v-if="showErecDys">
                    <v-card-title class="primary lighten-1 white--text">Erectile Dysfunction Treatment</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
                <!-- PreEj -->
                <v-card v-if="showPreE">
                    <v-card-title class="primary lighten-1 white--text">Premature Ejaculation Treatment</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
            </v-col>
        
           


          </v-row>
          <v-card-actions>
          <v-row>
              <v-btn
              type="submit"
              block class="primary white--text"
              @click.prevent="requestPrescription()">
              <span>Request Prescription</span>
              </v-btn>
                <v-snackbar
                  :color="color"
                  v-model="snackbar"
                  :timeout="timeout"
                  :multi-line="multiLine"
                >{{ snackbarText }}
                </v-snackbar>
          </v-row>
          </v-card-actions>
        </v-card-text>
        </v-form>
        </v-card> <!-- End of book appointment form within dialog --> 
      </v-dialog> 







    </v-col></v-row>
</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import { auth, db } from '../firebase'
import { required } from "vuelidate/lib/validators"
export default {
    components: {
        Navbar,
    },
    computed: {
        contraceptiveTypeError () {
            const errors = []
            if(!this.$v.contraceptives.contraceptiveType.$dirty) return errors
            !this.$v.contraceptives.contraceptiveType.required && errors.push('Please Select A Contraceptive Type')
            return errors
        }
        // periodsRegular
        // previoulyTaken
        // sideEffects
        // sideEffectDescription
    },
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
    },
    data() {
        return {
            // Snackbar properties
            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",
            dialog: false, // Dialog for overall dialog panel


            genderOption: null,
            chooseGenderOptions: [
                { text: 'Male', value: 'Male'},
                { text: 'Female', value: 'Female' }
            ],
            showFemaleT: false,
            showMaleT: false,
            
            chosenOption: null,
            femaleTreatments: [
                { text: 'Adrenaline Pen Treatment', value: 'Adrenaline Pen Treatment'},
                { text: 'Asthma Treatment', value: 'Asthma Treatment'},
                { text:'Contraceptive Pill & Patch', value: 'Contraception' },
                { text:'Period Delay Pill', value: 'Period Delay' },
                { text:'STI Test Kit', value: 'STI Test Kit' },
                { text:'Thrush Treatment', value: 'Thrush Treatment' },    
            ],
            maleTreatments: [
                { text: 'Adrenaline Pen Treatment', value: 'Adrenaline Pen Treatment'},
                { text: 'Asthma Treatment', value: 'Asthma Treatment'},
                { text: 'Erectile Dysfunction Treatment', value: 'Erectile Dysfunction Treatment' },
                { text: 'Premature Ejaculation Treatment', value: 'Premature Ejaculation Treatment' },
                { text:'STI Test Kit', value: 'STI Test Kit' }, 
            ],


 
            // Showing different treatments
            showAdrenaline: false,
            showAsthma: false,
            showContraception: false,
            showPeriodDelay: false,
            showSTIKit: false,
            showThrush: false,
            showErecDys: false,
            showPreE: false,

            // Contraception Card
            contraceptives: {
                contraceptiveType: null,
                periodsRegular: null,
                previoulyTaken: null,
                sideEffects: null,
                sideEffectDescription: 'None'
            },
            
            contraceptiveList: [
                {text: 'Azalia', value: "Azalia" },
                {text: 'Cerazette', value: "Cerazette" },
                {text: 'Cilest', value: "Cilest" },
                {text: 'Elvina', value: "Elvina" },
                {text: 'Elvinette', value: "Elvinette" },
                {text: 'Evra Patches', value: "Evra Patches" },
                {text: 'Freedonel', value: "Freedonel" },
                {text: 'Leonore', value: "Leonore" },
                {text: 'Microlite', value: "Microlite" },
                {text: 'Yasmin', value: "Yasmin" },
                {text: 'Zoely ', value: "Zoely " },
            ],
           
        }
    },
    validations: {
        contraceptives: {
        contraceptiveType: { required },
        // periodsRegular: { required },
        // previoulyTaken: { required },
        // sideEffects: { required },
        // sideEffectDescription: { required },
        }


    },
    methods: {
        // Triggers the snackbar with the passed message and colour of the message
        triggerSnackbar (message, color) {
            this.snackbarText = message,
            this.color = color,
            this.snackbar = true
        },
        setGenderOption () {
            if(this.genderOption == 'Male'){
                this.hideAllTreatments()
                this.showFemaleT = false
                this.showMaleT = true
                this.chosenOption = null
            }
            else{
                this.hideAllTreatments()
                this.showMaleT= false
                this.showFemaleT = true
                this.chosenOption = null
            }
        },
        hideAllTreatments () {
            this.showAdrenaline = false,
            this.showAsthma = false,
            this.showContraception = false,
            this.showPeriodDelay = false,
            this.showSTIKit = false,
            this.showThrush = false,
            this.showErecDys = false,
            this.showPreE = false
        },
        setTreatmentOption () {
            if (this.chosenOption == 'Adrenaline Pen Treatment'){
                this.hideAllTreatments()
                this.showAdrenaline = true
            }
            else if(this.chosenOption == 'Asthma Treatment'){
                this.hideAllTreatments()
                this.showAsthma = true
            }
            else if(this.chosenOption == 'Contraception'){
                this.hideAllTreatments()
                this.showContraception = true
            }
            else if(this.chosenOption == 'Period Delay'){
                this.hideAllTreatments()
                this.showPeriodDelay = true
            }
            else if(this.chosenOption == 'STI Test Kit'){
                this.hideAllTreatments()
                this.showSTIKit = true
            }
            else if(this.chosenOption == 'Thrush Treatment'){
                this.hideAllTreatments()
                this.showThrush = true
            }
            else if(this.chosenOption == 'Erectile Dysfunction Treatment'){
                this.hideAllTreatments()
                this.showErecDys = true
            }
            else if(this.chosenOption == 'Premature Ejaculation Treatment'){
                this.hideAllTreatments()
                this.showPreE = true
            }
            else{
                this.hideAllTreatments()
                console.log("error selecting treatment!")
            }
        },
        // Cancel the page
        cancel () {
            // this.$v.$reset()
            this.dialog = false
            this.hideAllTreatments()
            this.clearForms()
            this.chosenOption = null
            this.genderOption = null

            this.snackbar = null
        },
        clearForms () {
            // Clear contraceptive
            this.contraceptiveType = null
            this.periodsRegular = null
            this.previoulyTaken = null
            this.sideEffects = null
            this.sideEffectDescription = null
        },
        // Submit request form
        requestPrescription () {
            if (this.chosenOption == 'Adrenaline Pen Treatment'){
                this.hideAllTreatments()
          
            }
            else if(this.chosenOption == 'Asthma Treatment'){
                this.hideAllTreatments()
            
            }
            else if(this.chosenOption == 'Contraception'){

                this.$v.$touch() // used to check the state of the form fields
                this.formTouched = !this.$v.contraceptives.$anyDirty
                this.errors = this.$v.contraceptives.$anyError
                // If the form does not have any errors or each individual field has no invalid data 
                if (this.errors === false && this.formTouched === false){

                let addPrescription ={
                    patientID: this.currentUser,
                    chosenType: this.chosenOption,
                    contraception: this.contraceptiveType,
                    periodRegulation: this.periodsRegular,
                    previousUsage: this.previoulyTaken,
                    sideEffects: this.sideEffects,
                    effectsDescription: this.sideEffectDescription,
                }
                db.collection("prescriptions").doc().set(addPrescription).then(()=>{
                    this.triggerSnackbar("Request Has Been Submitted", "success")
                }).then(() =>{
                    this.hideAllTreatments()
                    this.clearForms()
                }).catch(error => {
                    console.log("Prescription Error ", error)
                    this.triggerSnackbar("There Were Errors With The Form!", "error")
                })   


                }
                else{
                    this.triggerSnackbar("Could Not Submit Contraception Request!", "error")
                } 
                
            }
            else if(this.chosenOption == 'Period Delay'){
                this.hideAllTreatments()
                
            }
            else if(this.chosenOption == 'STI Test Kit'){
                this.hideAllTreatments()
               
            }
            else if(this.chosenOption == 'Thrush Treatment'){
                this.hideAllTreatments()
              
            }
            else if(this.chosenOption == 'Erectile Dysfunction Treatment'){
                this.hideAllTreatments()
                
            }
            else if(this.chosenOption == 'Premature Ejaculation Treatment'){
                this.hideAllTreatments()
               
            }
            else{
                this.hideAllTreatments()
                this.clearForms()
                this.triggerSnackbar("Error Submitting Any Treatment", "error")
            }
        },
    },
    
}
</script>