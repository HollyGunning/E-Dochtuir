<template>



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
                :error-messages="selectDoctorError"
                outlined
                @change="onDropdownChanged($event)"
                @input="$v.selectDoctor.$touch()"
                @blur="$v.selectDoctor.$touch()"
                ></v-select>         
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
              clearable
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
            v-model="appointmentDate" 
            @input="menu2 = false"
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
            <v-card flat>
              <v-card-text class="mt-n4">
              <span class="subheading">Select Appointment Time</span>
              <v-chip-group
              column
              v-model="selectedTime"
              mandatory
              active-class="primary--text"
              >
              <v-chip class="mr-5" outlined default v-for="time in timeSlots" :key="time">
                {{ time }}
              </v-chip>
              </v-chip-group>
              </v-card-text>
            </v-card>
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


  


    
 





</template>

<script>
import { mapState } from 'vuex'
import {auth, db} from '../../firebase'
import { format, parseISO } from 'date-fns'
import { required, maxLength } from "vuelidate/lib/validators"


export default {
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
    selectDoctorError () {
      const errors = []
      if(!this.$v.selectDoctor.$dirty) return errors
        !this.$v.selectDoctor.required && errors.push('Please select a doctor to book appointment with')
      return errors
    },
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
        firstname: this.$store.state.userProfile.firstname,       
        surname: this.$store.state.userProfile.surname,
        date: this.$store.state.userProfile.date,
        email: this.$store.state.userProfile.email,
        ppsn: this.$store.state.userProfile.ppsn,
        mobile: this.$store.state.userProfile.mobile,
        
        // currentUser is used for the patientID
        currentUser: null,
        appointmentDate: '',
        additionalDetails: '',

        // Appointment panel is open by default
        panel: 1,
        // Menu for picking the appointment date
        menu2: false,
        // Doctors array contains a list of doctors 
        doctors: [],
        // Chosen Doc stores the value of the selected doctor to be passed to the db
        chosenDoc: null,

        selectedTime: '',
        timeSlots: [
          '9.00', '9.30', '10.00', '10.30', '11.00', '11.30', '1.00', 
          '1.30', '2.00', '2.30', '3.00', '3.30', '4.00', '4.30'
        ],
      }
    },
    validations: {
      selectDoctor: { required },
      appointmentDate: { required },
      additionalDetails: { maxLength: maxLength (150) }
    },
    created() {
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
      viewDOB () {
        return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
      },
      checkTime () {
        // db.collection("appointments").where("")
      },
      bookAppointment () {
        this.$v.$touch()
        this.formTouched = !this.$v.$anyDirty
        this.errors = this.$v.$anyError
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
            // appointmentTime: 
            appointmentDetails: this.additionalDetails
          }
          db.collection("appointments").doc().set(document);
          
          // this.selectDoctor = ''
          // this.appointmentDate = '',
          // this.additionalDetails = '',

        }
        else{
          console.log("Appointment could not be booked")
        }

        // var document = {
        //   patientID: this.currentUser,
        //   firstname: this.$store.state.userProfile.firstname,       
        //   surname: this.$store.state.userProfile.surname,
        //   date: this.$store.state.userProfile.date,
        //   email: this.$store.state.userProfile.email,
        //   ppsn: this.$store.state.userProfile.ppsn,
        //   mobile: this.$store.state.userProfile.mobile,

        //   doctorID: this.chosenDoc,
        //   appointmentDate: this.appointmentDate,
        //   // appointmentTime: 
        //   appointmentDetails: this.additionalDetails
        // }
        // db.collection("appointments").doc().set(document);
      },

      onDropdownChanged(value) {
        this.chosenDoc = value;
      },

      onAppointmentChosen(value) {
        this.chosenApp = value
      }
    }, 
}
</script>