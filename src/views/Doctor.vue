<template>
<v-container>

  <v-card id="AppointmentCalendar" flat>
    <Calendar />
  </v-card>

</v-container>




</template>

<script>
import Calendar from "../components/Calendar"

export default {
components: {
  Calendar  
},

  data: () => ({
    //
  }),
};
</script>