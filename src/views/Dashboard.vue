<template>
  <Navbar />
  
    <!-- <v-section >
      <v-container class="mt-n10 text-center">
      
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
                class="justify-center font-weight-black text-uppercase"
                v-text="title"
              ></v-card-title>

              <v-card-text
                class="subtitle-1"
                v-text="text"
              >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-section> -->

</template>

<script>
import Navbar from '../components/Navbars/Navbar'

export default {
  components: {
    Navbar,
  },
  data() {
    return {
        features: [
          {
            icon: 'fa-book-medical',
            title: 'Medical Record',
            text: 'With E-Dochtúir, store and easily access all of your medical history in one place.'
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
};
</script>