<template>
<v-container >
  
<v-card>
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
              v-model="doctor"
              label="Choose a Doctor"
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


</v-container>
</template>

<script>
 import { format, parseISO } from 'date-fns'
 import { mapState } from 'vuex'

 import {db} from '../firebase'

export default {
   components: {

    },
    computed: {
       ...mapState(['userProfile']),

       user () {
            return this.$store.getters.user
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
        firstname: this.$store.state.userProfile.firstname,
        surname: this.$store.state.userProfile.surname,
        date: this.$store.state.userProfile.date,
        ppsn: this.$store.state.userProfile.ppsn,
        mobile: this.$store.state.userProfile.mobile,

        appointmentDate: '',
        menu: false,
        menu2: false,
        

        doctor: null,
        doctors: [
          { title: 'email', role: 'doctor', value: "doctor"}
        ],


        items: ['Foo', 'Bar', 'Fizz', 'Buzz'],

        selectedTime: '',
        tags: [
          '9.00', '10.00', '11.00', '1.00', '2.00', '3.00', '4.00'
        ],
      }
    },
    created() {

    },
    methods: {
      viewDOB () {
          return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
      },

      bookAppointment(){
        this.$v.$touch()
          db().collection("roles").get().then(snap => {
            snap.forEach(doc => {
              var test = doc.data()
              console.log(test)
            })
          })   
      }
    },
    
}
</script>