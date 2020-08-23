<template>
<v-container>
  <Navbar />

     <v-container class="text-center">
       <v-card flat>
         <v-card-title class="overline" align="center" justify="center"><h1>E-DOCHTÚIR features</h1></v-card-title>
       </v-card>
        <v-row>
          <v-col
            v-for="({ icon, title, text }, i) in features"
            :key="i"
            cols="12"
            md="4"
          >
            <v-card
              class="py-12 px-4"
              color="grey lighten-5"
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
                class="justify-center text-center font-weight-black text-uppercase"
                v-text="title"
              ></v-card-title>

              <v-card-text
                class="subtitle-1 text-justify"
                v-text="text"
              >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
     </v-container>


<v-row align="center" justify="center"><v-col cols="12">
  <v-card flat>
    <v-card-title class="upperclass">Contact Us 
    <v-spacer></v-spacer>
    </v-card-title>
    <v-form @submit.prevent="submitQuery">
      <v-row class="mt-4" align="center" justify="center">  
        <v-col cols="9">
          <v-text-field
          label="Name"
          v-model="this.name"
          outlined
          readonly
          ></v-text-field>
        </v-col>
        <v-col cols="9">
          <v-text-field
          label="Email"
          v-model="this.email"
          outlined
          readonly
          ></v-text-field>
        </v-col>
        <v-col cols="9">
          <v-textarea
          label="Message"
          v-model="message"
          outlined
          auto-grow
          :counter="150"
          :maxlength="150"
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
            text: 'Store and access your medical history from one place.  Records can be updated in real time by your doctor, providing you the most up-to-date data for blood pressure, blood level and cholesterol.'
          },
          {
            icon: 'fa-stethoscope',
            title: 'Book Appointments',
            text: 'E-Dochtúirs intuitive appointment booking system allows for quick and responsive online appointment bookings.'
          },
          {
            icon: 'fa-prescription-bottle-alt',
            title: 'Request Prescriptions',
            text: 'Request prescriptions online rather than having to make a trip to the clinic to pick up a physical copy of your prescriptions'          },
        ],
    }
  },
  methods: {
    triggerSnackbar (message, color) {
      this.snackbarText = message,
      this.color = color,
      this.snackbar = true
    },
    submitQuery () {
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
    },
  },
};
</script>