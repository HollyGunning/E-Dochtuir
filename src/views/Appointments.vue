<template>
<v-container >
  <v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">
    
    <!-- V-Dialog is used to encompass the view page so that when the appointment add button is 
    pressed a full dialog with the form opens --> 
     <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <!-- Viewing of appointments occurs here --> 
          <v-card flat>
            <v-card-title class="primary lighten-1 white--text">Appointments
            <v-spacer></v-spacer>
              <v-btn
              class="mx-2" 
              fab small
              dark color="primary"
              v-bind="attrs"
              v-on="on"
              >
              <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
              <!-- View Appointments Component import here --> 
              <ViewAppointments />
          </v-card>

        <!-- Book appointment form appears here -->
        </template>
        <v-card>   
        <v-card-title class="primary white--text">
          Book Appointment
            <v-spacer></v-spacer>

            <v-btn class="mr-4" icon dark @click="dialog = false">
              
              <v-icon>mdi-close</v-icon>
              <span>Cancel</span>
            </v-btn>
            

        </v-card-title>
        <v-divider class="mx4"></v-divider>
        <v-form @submit.prevent="bookAppointment">
        <v-card-text>
          <v-row>     
            <v-expansion-panels flat accordion v-model="panel">
              <!-- Personal Details -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-subheader  class="overline ml-n5">Personal Details
                    <v-divider></v-divider>
                  </v-subheader>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                  <!-- Firstname -->        
                  <v-col class="mt-n0" cols="12" md="4" lg="4">
                    <v-text-field 
                    type="text"
                    name="firstname"
                    label="First Name"  
                    v-model.trim="firstname" 
                    readonly
                    outlined  
                    ></v-text-field>
                  </v-col>
                  <!-- Surname --> 
                  <v-col class="mt-n0" cols="12" md="4" lg="4">
                    <v-text-field 
                    type="text"
                    name="surname"
                    label="Surname"
                    v-model.trim="surname"
                    readonly
                    outlined   
                    ></v-text-field>
                  </v-col>
                  <!-- Date of Birth -->
                  <v-col class="mt-n0" cols="12" md="4" lg="4">
                    <v-text-field
                    label="Date of Birth"
                    :value="formattedDate"
                    readonly         
                    outlined
                    ></v-text-field>
                  </v-col>
                  <!-- Email --> 
                  <v-col class="mt-n2" cols="12" md="4" lg="4">
                    <v-text-field 
                    type="email"
                    name="email"
                    label="Email"
                    v-model.trim="email"
                    readonly
                    outlined   
                    ></v-text-field>
                  </v-col>
                  <!-- PPSN -->
                  <v-col class="mt-n2" cols="12" md="4" lg="4">
                    <v-text-field 
                    type="text"
                    name="ppsn"
                    label="PPSN"
                    v-model.trim="ppsn"
                    readonly
                    outlined        
                    ></v-text-field>
                  </v-col>
                  <!-- Mobile -->
                  <v-col class="mt-n2" cols="12" md="4" lg="4">
                    <v-text-field 
                    type="text"
                    name="mobile"
                    label="Mobile"
                    v-model.trim="mobile"
                    readonly
                    outlined  
                    ></v-text-field>
                  </v-col> 
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              
              <!-- Account Details -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <v-subheader  class="overline ml-n5">Appointment Details
                  <v-divider></v-divider>
                  </v-subheader>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                <v-row>
                <!-- Appointment Doctor -->
                <v-col class="mt-n0" cols="12" md="6">
                    <v-select 
                    name="selectDoctor"
                    :items="doctors"
                    item-text="name"
                    item-value="value"

                    label="Select a Doctor"
                    
                    outlined
                    @change="onDropdownChanged($event)"
                    
                    ></v-select>  

                    <v-snackbar
                      color="error"
                      v-model="snackbar"
                      :timeout="timeout"
                      :multi-line="multiLine"
                    >{{ snackbarText }}
                    </v-snackbar>

                </v-col>
                <!-- Appointment Date -->
                <v-col class="mt-n0" cols="12" md="6">
                <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                max-width="290"
               
                >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                  label="Select Date"
                  :error-messages="selectDateError"
                  readonly
                  :value="formattedAppointmentDate"
                  v-bind="attrs"
                  v-on="on"
                  required
                  outlined
                  @input="$v.appointmentDate.$touch()"
                  @blur="$v.appointmentDate.$touch()"
                  @click:clear="appointmentDate = null"
                  
                  ></v-text-field>
                </template>
                <v-date-picker 
                full-width
                scrollable
                show-current
                v-model="appointmentDate" 
                @input="menu2 = false"
                @change="getAvailableTimes()"
                :min="nowDate"
                >
                </v-date-picker>
                </v-menu>
                </v-col>
                <!-- Appointment Details -->
                <v-col cols="12" md="6">
                <v-textarea
                auto-grow
                rows="1"
                name="additionalDetails"
                label="Additional Details"
                :error-messages="additionalDetailsError"
                v-model="additionalDetails"
                :counter="150" 
                outlined
                @input="$v.additionalDetails.$touch()"
                @blur="$v.additionalDetails.$touch()"
                ></v-textarea>
                </v-col>

                <!-- Appointment Time -->
                <v-col class="mt-0" cols="12" md="12">
                  <v-row>
                <v-card flat v-if="showSelectTime">

                  <v-card-text class="mt-n4">

                  <span class="subheading">Select Appointment Time</span>
                  <v-chip-group
                  column
                  v-model="selectedTime"
                  mandatory
                  active-class="primary--text"
                  >
                  <v-chip class="mr-5" outlined default v-for="time in displayedTimeSlots" :key="time" :value="time">
                    {{ time }}
                  </v-chip>
                  </v-chip-group>



                  </v-card-text>
                </v-card>
                </v-row>
                </v-col>




                </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>    
            </v-expansion-panels>    
          </v-row>

          <v-card-actions>
          <v-row>
              <v-btn
              type="button"
              :disabled="loading"
              block class="primary white--text"
              @click.prevent="bookAppointment()">
              <span>Book Appointment</span>
              </v-btn>
          </v-row>
          </v-card-actions>

        </v-card-text>
        </v-form>

        </v-card>
      </v-dialog>



  </v-col></v-row>

</v-container>
</template>

<script>

import ViewAppointments from "../components/Appointments/ViewAppointments"


import { mapState } from 'vuex'
import {auth, db} from '../firebase'
import { format, parseISO } from 'date-fns'
import { required, maxLength } from "vuelidate/lib/validators"

export default {
   components: {
     ViewAppointments,
    },
    computed: {
       ...mapState(['userProfile']),
    
      loading () {
          return this.$store.state.loading
      },
   
      formattedDate () {
        return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
      },

      formattedAppointmentDate () {
        return this.appointmentDate ? format(parseISO(this.appointmentDate), 'do MMM yyyy') : ''
      },

      // VALIDATION ERROR MESSAGES
      selectDateError () {
        const errors = []
        if(!this.$v.appointmentDate.$dirty) return errors
          !this.$v.appointmentDate.required && errors.push('Please select a date for your appointment')
        return errors
      },
      additionalDetailsError () {
        const errors = []
        if(!this.$v.additionalDetails.$dirty) return errors
          !this.$v.additionalDetails.maxLength && errors.push('Cannot exceed 150 characters')
        return errors
      },
    },
    data () {
      return {
        showSelectTime: false,
        dialog: false,

        // BOOK APPOINTMENT STUFF
        firstname: this.$store.state.userProfile.firstname,       
        surname: this.$store.state.userProfile.surname,
        date: this.$store.state.userProfile.date,
        email: this.$store.state.userProfile.email,
        ppsn: this.$store.state.userProfile.ppsn,
        mobile: this.$store.state.userProfile.mobile,
        
        // currentUser is used for the patientID
        currentUser: null,
        // Limits the date picker to only dates from current date onwards
        nowDate: new Date().toISOString().slice(0,10),
        appointmentDate: null,
        additionalDetails: '',

        // Appointment panel is open by default
        panel: 1,
        // Menu for picking the appointment date
        menu2: false,

        //
        snackbar: false,
        multiLine: true,
        snackbarText: "You forgot to select a doctor!",
         timeout: 5000,

        // Doctors array contains a list of doctors 
        doctors: [],
        // Chosen Doc stores the value of the selected doctor to be passed to the db
        chosenDoc: null,

        selectedTime: null,
        timeSlots: [
          '9.00', '9.30', '10.00', '10.30', '11.00', '11.30', '1.00', 
          '1.30', '2.00', '2.30', '3.00', '3.30', '4.00', '4.30'
        ], 

        displayedTimeSlots: [],
      
      }
    },
    validations: {
      appointmentDate: { required },
      additionalDetails: { maxLength: maxLength (150) }
    },
    created() {
      // This gets the list of users whos role is doctor
      db.collection("roles").where("role.doctor", "==", true).get().then(snap => {
        snap.forEach(doc => {
          // Doctor ID is the ID of the role document
          var doctorID = doc.id
          // Then query the users collection with the doctorID to find corresponding record based on same ID
          // so that I can access the name of the doctor to return to the user through the Doctor Selection
          db.collection("users").doc(doctorID).get().then(doc => {
            var docID = doc.id
            var doctorFirstName = doc.data().firstname
            var doctorSurname = doc.data().surname
            this.doctors.push({
              name: doctorFirstName + " " + doctorSurname,
              value: docID
            });
          })
        })
      });

      auth.onAuthStateChanged(userID => { this.currentUser = userID.uid;});

    },
    methods: {
      getAvailableTimes () {
      // appointment date and chosen doctor isnt null then check where the appointments under each doctor
      if(this.appointmentDate != null && this.chosenDoc != null) {
        this.showSelectTime = false
        db.collection("appointments").where("appointmentDate", "==", this.appointmentDate).where("doctorID", "==", this.chosenDoc).get().then(snap => {
          // Made an array of appointments to convert it from a firebase doc to a standard doc
          var appointments = []
          snap.forEach(doc => appointments.push(doc.data()))
          // set displayedtimeslots to the filtered version of timeslots, where any appointments that are pre existing are filtered out
          // out of the list
          this.displayedTimeSlots = this.timeSlots.filter(time => {
            return appointments.find(item => item.appointmentTime == time) == null
          })
          this.showSelectTime = true
        })
      }else {
          this.showSelectTime = false
      } 
      },    

      viewDOB () {
        return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
      },
      checkTime () {
        // TODO: QUERY TIMES TO SEE IF TIME SLOT IS ALREADY TAKEN AND DETERMINE WHETHER CHIP IS SELECTABLE OR NOT
      },
      bookAppointment () {
        this.$v.$touch()
        this.formTouched = !this.$v.$anyDirty
        this.errors = this.$v.$anyError

        if(this.chosenDoc == null){
          this.snackbar = true
        }
        else{
          if (this.errors === false && this.formTouched === false){ 
            var document = {
              patientID: this.currentUser,
              firstname: this.$store.state.userProfile.firstname,       
              surname: this.$store.state.userProfile.surname,
              dob: this.$store.state.userProfile.date,
              email: this.$store.state.userProfile.email,
              ppsn: this.$store.state.userProfile.ppsn,
              mobile: this.$store.state.userProfile.mobile,

              doctorID: this.chosenDoc,
              appointmentDate: this.appointmentDate,
              appointmentTime: this.selectedTime,
              appointmentDetails: this.additionalDetails
            }
            db.collection("appointments").doc().set(document).then(() => {
              // Reset any form error messages and inputs upon completion of booking
              this.$v.$reset()
              this.appointmentDate = ''
              this.additionalDetails = ''
              this.selectedTime = ''
              this.dialog = false
              this.showSelectTime = !this.showSelectTime
            })
          }else{
            console.log("Appointment booked")
          }
        }
      },

      onDropdownChanged(value) {
        this.chosenDoc = value;
        this.getAvailableTimes()
      },

  }
}
</script>