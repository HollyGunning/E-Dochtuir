<template>
<v-container>
<Navbar />

  <v-card id="Medication Calendar" flat>
    <MedCalendar />
  </v-card>

</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import MedCalendar from '../components/MedicationCalendar'

export default {
  components: {
    Navbar,
    MedCalendar,
  },

}
</script>