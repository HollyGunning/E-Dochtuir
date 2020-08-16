<template>
<v-container>
 <AdminNavbar />

 
  <v-card id="AppointmentCalendar" flat>
    <Calendar />
  </v-card>

</v-container>




</template>

<script>
import AdminNavbar from '../components/AdminNavbar'
import Calendar from "../components/Calendar"

export default {
components: {
   AdminNavbar,
   Calendar  
},

  data: () => ({
    //
  }),
};
</script>