<template>
<v-container>
<Navbar />  
    <v-row>
      <v-col cols="12" s="12" sm="12" md="12" lg="12">

      <v-card flat>
      <v-card-title class="primary lighten-1 white--text">Medication
      <v-spacer></v-spacer>
      <v-btn
      class="mx-2" 
      fab small
      dark color="primary"
      >
      <v-icon>mdi-plus</v-icon>
      </v-btn>
      </v-card-title>
      <v-card-text>

      </v-card-text>
      </v-card>
 

      </v-col></v-row>
</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'

export default {
  components: {
    Navbar,
  },
  computed: {
    
  },
  data() {
    return {
      menu2: false,
      medicationStartDate: null,
      formattedDate: null,
      
      dosageUnit: null,
      units: [
        { text: 'Tablet(s)', value: 'tablet' },
        { text: 'Capsule(s)', value: 'capsule' },
        { text: 'Injection(s)', value: 'injection' },
        { text: 'Drop(s)', value: 'drop' },
        { text: 'Spray(s)', value: 'spray' },
        { text: 'Suppository(ies)', value: 'suppository' },
        { text: 'Tablespoon(s)', value: 'tbs' },
        { text: 'Teaspoon(s)', value: 'tsp' },
        { text: 'Milligram(s)', value: 'milligram' },
        { text: 'Milliliter(s)', value: 'milliliter' },
        
        
      ],
      medicationName: null,
      medicationList: [],



      additionalDetails: null,


      schedules: [
        { text: 'Daily', value: 'daily' },
        { text: 'Every X days', value: 'everyXdays' },
        { text: 'Specific Dates', value: 'specific' },
      ],
      showEveryXDays: false,     
      daysofWeek: [ 
        { text: 'Monday', value: 'monday'},
        { text: 'Tuesday', value: 'tuesday'},
        { text: 'Wednesday', value: 'wednesday'},
        { text: 'Thursday', value: 'thursday'},
        { text: 'Friday', value: 'friday'},
        { text: 'Saturday', value: 'saturday'},
        { text: 'Sunday', value: 'sunday'},
      ],
      selectedDays: [],
    
    }
  },
  created() {
    
  },
  methods: {
    onScheduleChange (value) {

      if(value == 'daily' ){
        this.showEveryXDays = false
        console.log("Daily Here")
      }
      else if (value == 'everyXdays'){
        this.showEveryXDays = true
        console.log("Every X Days Here")
      }
      else if(value == 'specific'){
        this.showEveryXDays = false
      }
      else{
        this.showEveryXDays = false
      }
      
    },

    onDaysChange () {
      console.log(this.selectedDays)
    }
  },
};
</script>