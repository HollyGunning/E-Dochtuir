<template>
<v-container>
  <Navbar />

     <v-container class="text-center">
       <v-card flat>
        <v-card-title class="text-uppercase primary lighten-1 white--text"><h1>Features</h1></v-card-title>
       </v-card>
        <v-row>
          <v-col v-for="({ icon, title, text }, i) in features" :key="i" cols="12" md="6">
            <v-card
              class="py-12 px-4"
              
              flat
            >
              <v-theme-provider dark>
                <div>
                  <v-avatar
                    color="primary"
                    size="88"
                  >
                    <v-icon
                      large
                      v-text="icon"
                    ></v-icon>
                  </v-avatar>
                </div>
              </v-theme-provider>
              <v-card-title
                class="justify-center text-center  text-uppercase"
                v-text="title"
              ></v-card-title>
              <v-card-text
                class="subtitle-1 text-justify text-center"
                v-text="text"
              >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
     </v-container>

<v-row><v-col cols="12">
  <v-card flat>
    <v-card-title class="text-uppercase primary lighten-1 white--text">Contact Us 
    <v-spacer></v-spacer>
    </v-card-title>
    <v-form @submit.prevent="submitQuery">
      <v-row class="mt-4">  
        <v-col cols="12" s="12" sm="6" md="6" lg="6">
          <v-text-field
          label="Name"
          v-model="this.name"
          outlined
          readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" s="12" sm="6" md="6" lg="6">
          <v-text-field
          label="Email"
          v-model="this.email"
          outlined
          readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
          label="Message"
          v-model="message"
          outlined
          auto-grow
          :counter="150"
          :minLength="50"
          :maxlength="150"
          :error-messages="messageErrors"
          @input="$v.message.$touch()"
          @blur="$v.message.$touch()"
          ></v-textarea>
        </v-col>
      </v-row>
      </v-form>
      <v-card-actions>
        <v-row align="center" justify="center">
          <v-col cols="6">

          <v-btn
          type="submit"
          block
          class="primary white--text"
          @click.prevent="submitQuery()"
          >
          <span>Submit</span>
          </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
        <v-snackbar
        :color="color"
        v-model="snackbar"
        :timeout="timeout"
        :multi-line="multiLine"
      >{{ snackbarText }}
      </v-snackbar>
  </v-card>
</v-col></v-row>


</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import { auth, db } from '../firebase'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    Navbar,
  },
  created() {
    this.currentUser = auth.currentUser.uid // Get current users ID
    db.collection("users").doc(this.currentUser).onSnapshot(doc => {
      let userRecord = doc.data()
      userRecord.id = doc.id

      this.name = userRecord.firstname + ' ' + userRecord.surname
      this.email = userRecord.email
      
    })
  },
  computed: {
    messageErrors () {
      const errors = []
      if (!this.$v.message.$dirty) return errors
        !this.$v.message.required && errors.push('A Message Is Required')
      return errors
    },
  },
  data() {
    return {
        snackbar: false,
        color: null,
        multiLine: true,
        timeout: 5000,
        snackbarText: "",

        currentUser: null,
        email: null, 
        name: null,
        message: null,

        features: [
          {
            icon: 'fa-book-medical',
            title: 'Medical Record',
            text: 'Store your personal medical records digitally and receive medical updates in real-time.'
          },
          {
            icon: 'fa-pills',
            title: 'Track Medication',
            text: 'Enter any medication taken and visually track your medication timetable through the app.'          
          },
          {
            icon: 'fa-stethoscope',
            title: 'Book Appointments',
            text: 'Book appointments with your doctors online with E-Dochtúirs intuitive booking system.  Select online consultations to chat online.'
          },
          {
            icon: 'fa-prescription-bottle-alt',
            title: 'Request Prescriptions',
            text: 'Request prescriptions online rather than having to make a trip to the clinic to pick up a physical copy of your prescriptions.'          
          },
        ],
    }
  },
  validations: {
    message: { required }
  },
  methods: {
    triggerSnackbar (message, color) {
      this.snackbarText = message,
      this.color = color,
      this.snackbar = true
    },
    submitQuery () {
      this.$v.$touch()
      this.formTouched = !this.$v.$anyDirty
        this.errors = this.$v.$anyError
        if (this.errors === false && this.formTouched === false){
          var document = {
            userID: this.currentUser,
            userName: this.name,
            email: this.email,
            message: this.message,
          }
          db.collection("tickets").doc().set(document).then(() => {
            this.message = null
            this.triggerSnackbar("Your Query Has Been Successfully Logged!", "success")
          }).catch(error => {
            console.log(error)
          })
        }
        else{
          this.triggerSnackbar("There Were Errors With Your Form!", "error")
        }

    },
  },
};
</script>