<template>

    <v-form @submit.prevent="bookAppointment">
    <v-card-title class="text-uppercase">Book Appointment</v-card-title>
    <v-divider class="mx4"></v-divider>
    <v-card-text>

        <v-subheader  class="overline ml-n2">Personal Details
          <v-divider></v-divider>
        </v-subheader>
        <v-row>   
        <v-col class="mt-n0" cols="12" md="6" lg="6">
          <v-text-field 
          type="text"
          name="firstname"
          label="First Name"
          
          :counter="15" 
          v-model.trim="firstname" 
          
          :placeholder="userProfile.firstname"
          outlined
          
          >
          </v-text-field>
        </v-col>
        <v-col class="mt-n0" cols="12" md="6" lg="6">
          <v-text-field 
          type="text"
          name="surname"
          label="Surname"
          :counter="15" 
          v-model.trim="surname"
      
          :placeholder="userProfile.surname"
          outlined 
        
          >
          </v-text-field>
        </v-col>

        <!-- Date of Birth -->
        <v-col class="mt-n2" cols="12" md="4" lg="4">
            <v-menu
            v-model="menu"
            :close-on-content-click="false"
            max-width="290"
            >
            <template v-slot:activator="{ on, attrs }">
            <v-text-field
            label="Date of Birth"
            :value="formattedDate"
            
            :placeholder="userProfile.date"
            clearable
            readonly
            v-bind="attrs"
            v-on="on"
            @click:clear="date = null"
            outlined
            >
            </v-text-field>
            </template>
            <v-date-picker
            v-model.trim="date"
            @change="menu = false"  
            >
            </v-date-picker>
            </v-menu>
        </v-col>
        <v-col class="mt-n2" cols="12" md="4" lg="4">
          <v-text-field 
          type="text"
          name="ppsn"
          label="PPSN"
          hint="7 numerical characters, followed by either 1 or 2 letters E.g. 1234567RW"
          v-model.trim="ppsn"
          
          :placeholder="userProfile.ppsn"
          outlined
        
          >
          </v-text-field>
        </v-col>
        <v-col class="mt-n2" cols="12" md="4" lg="4">
            <v-text-field 
            type="text"
            name="mobile"
            label="Mobile"
            v-model.trim="mobile"
            
            :placeholder="userProfile.mobile"
            outlined
           
            >
            </v-text-field>
        </v-col> 

      </v-row>

      <v-subheader class="overline ml-n2">Appointment Details
        <v-divider></v-divider>
      </v-subheader>
      <v-row>
  
        <v-col class="mt-n0" cols="12" md="6">
            <v-select 
              :items="doctors"
              item-text="name"
              item-value="value"
              label="Choose a Doctor"
              @change="onDropdownChanged($event)"
              outlined
            ></v-select>         
        </v-col>


          <v-col class="mt-n0" cols="12" md="6">
 
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            max-width="290"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="Appointment Date"
                readonly
                clearable
                :value="formattedAppointmentDate"
                
                v-bind="attrs"
                v-on="on"
                required
                outlined
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
                  <v-chip class="mr-5" outlined default v-for="tag in tags" :key="tag">
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              </v-card>
          </v-col>

          <v-col cols="12" md="6">
          <v-textarea
          outlined
          auto-grow
          rows="2"
          name="additionalDetails"
          label="Additional Details"
          v-model="additionalDetails"
          ></v-textarea>
          </v-col>

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
 import { format, parseISO } from 'date-fns'
 import { mapState } from 'vuex'
 import {auth, db} from '../../firebase'

export default {
  computed: {
    ...mapState(['userProfile']),
    // user () {
    //     return this.$store.getters.user
    // },
    
    loading () {
        return this.$store.state.loading
    },
    formattedDate () {
      return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
    },
    formattedAppointmentDate () {
      return this.appointmentDate ? format(parseISO(this.appointmentDate), 'do MMM yyyy') : ''
    }
  },
    data () {
      return {
        currentUser: null,
        firstname: this.$store.state.userProfile.firstname,       
        surname: this.$store.state.userProfile.surname,
        date: this.$store.state.userProfile.date,
        ppsn: this.$store.state.userProfile.ppsn,
        mobile: this.$store.state.userProfile.mobile,
        chosenDoc: null,
        appointmentDate: '',
        additionalDetails: '',

        menu: false,
        menu2: false,

        
        
        doctor: null,
        doctors: [],


        // items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
        selectedTime: '',
        tags: [
          '9.00', '10.00', '11.00', '1.00', '2.00', '3.00', '4.00'
        ],
      }
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
      
      bookAppointment () {
        var document = {
          patientID: this.currentUser,
          doctorID: this.chosenDoc,
          appointmentDate: this.appointmentDate,
          // appointmentTime: 
          appointmentDetails: this.additionalDetails
        }
        db.collection("appointments").doc().set(document);
      },
      onDropdownChanged(value) {
        this.chosenDoc = value;
      }
    }, 
}
</script>