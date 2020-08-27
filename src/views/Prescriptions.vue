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


            <!-- Contraceptive Form Info --> 
         
            <v-col cols="12">
                <!-- Asthma -->
                <v-card v-if="showAsthma">
                    <v-card-title class="primary lighten-1 white--text">Asthma Treatment</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
                <!-- Adrenaline -->
                <v-card v-if="showAdrenaline">
                    <v-card-title class="primary lighten-1 white--text">Adrenaline Pen Treatment</v-card-title>
                    <v-card-text></v-card-text>
                </v-card>
                <!-- Contraception -->
                <v-card v-if="showContraception">
                    <v-card-title class="primary lighten-1 white--text">Contraception Pill & Patch</v-card-title>
                    <v-card-text></v-card-text>
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
export default {
    components: {
        Navbar,
    },
    created() {
        
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
            
        }
    },
    validations: {

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
            this.dialog = false
            // this.$v.$reset()
            // this.appointmentSelected = null
            // this.chosenDoc = null
            // this.appointmentDate = null
            // this.additionalDetails = null
            // this.selectedTime = null
            this.snackbar = null
        },
        // Submit request form
        requestPrescription () {

        },
    },
    
}
</script>