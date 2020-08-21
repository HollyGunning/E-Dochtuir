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


      <v-card-text class="mt-4">
  
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="medicationName"
            :items="medicationList"
            label="Medication Name"
            outlined
 
        ></v-autocomplete>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field 
          label="Dosage" 
          type="number" 
          outlined
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="3">
          <v-select 
          v-model="dosageUnit"
          :items="units"
          label="Units"
          ></v-select>
        </v-col>
        <v-col cols="6" md="6">
          <v-textarea 
          auto-grow
          rows="1"
          v-model="additionalDetails"
          label="Additional Details"
          :counter="150"
          outlined
          ></v-textarea>
        </v-col >


      
        <v-col cols="12" md="4">
        <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        max-width="290"
        >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
          label="Start Date"
          readonly
          :value="formattedDate"
          v-bind="attrs"
          v-on="on"
          required
          outlined    
          ></v-text-field>
        </template>
        <v-date-picker 
        full-width
        scrollable
        show-current
        v-model="medicationStartDate" 
        @input="menu2 = false"
        @change="onDateChanged()"
        >
        </v-date-picker>
        </v-menu>
        </v-col>



        <!-- SCHEDULE SELECTOR -->
        <v-col cols="12" md="4">
            <v-select
            label="Schedule"
            :items="schedules"
            item-text="text"
            item-value="value"
            @change="onScheduleChange($event)"
            outlined
            ></v-select>
        </v-col>

  
      <!-- Select days of the week -->
     <v-col cols="12" md="8">
        <v-card flat v-if="showEveryXDays">
          <span class="overline">Specify Days of the Week</span>
          <v-chip-group 
          column 
          v-model="selectedDays"
          mandatory 
          multiple 
          active-class="primary--text"
          @change="onDaysChange()"
          >
            <v-chip v-for="(day, value) in daysofWeek" :key="value" >
              {{ day.text }}
            </v-chip>
          </v-chip-group>
        </v-card>
      </v-col>
 
    <v-col>
      <v-card flat v-if="showEveryXDays">
        <span class="overline">How many times a day</span>
        
      </v-card>
    </v-col>

    



      </v-row>

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