<template>
<v-container>
<DoctorNavbar />
  <!-- Import the Calendar for the doctors appointments -->
  <v-card id="AppointmentCalendar" flat>
    <Calendar />
  </v-card>
</v-container>
</template>

<script>
import DoctorNavbar from '../components/Navbars/DoctorNavbar'
import Calendar from "../components/Calendar"

export default {
    components: {
      DoctorNavbar,
      Calendar
    }
}
</script>