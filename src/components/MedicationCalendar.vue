<template>
    <v-row class="fill-height">
        <v-col>

        <!-- Contains the top toolbar with the today, prev, next btn options and a menu that switches the calendar view--> 
        <v-sheet height="64">
            <v-toolbar flat color="white">
                <v-btn outlined color="primary" class="mr-2" @click="dialog = true">
                    Add Medication
                </v-btn>
                <v-btn outlined color="primary" @click="setToday">Today</v-btn>
                <v-btn fab text small color="primary" @click="prev">
                    <v-icon small >mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small color="primary" @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title  }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                        outlined
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                        >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>
                        <v-list>
                            <v-list-item @click="type = 'day'">
                                <v-list-item-title>Day</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'week'">
                                <v-list-item-title>Week</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'month'">
                                <v-list-item-title>Month</v-list-item-title>
                            </v-list-item>
                        </v-list>
                </v-menu>
            </v-toolbar>
        </v-sheet>

        <!-- Dialog for adding medication -->
        <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-form @submit.prevent="saveMedication()">
            <v-card-title class="primary lighten-1 white--text">Add Medication
                <v-spacer></v-spacer>
                <v-btn class="mr-6" icon dark @click="dialog = false"> 
                <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
                <span>Cancel</span>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <!-- Name -->
                        <v-col cols="12" sm="5" md="5">
                            <v-text-field
                            label="Medication Name*"
                            v-model="medicationName" 
                            type="text" 
                            outlined



                            ></v-text-field>
                        </v-col>
                        <!-- Dose Amount -->
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field
                            label="Dosage*"
                            type="number"
                            v-model="dose"
                            outlined



                            ></v-text-field>
                        </v-col>
                         <!-- Select Type -->
                        <v-col cols="12" sm="4" md="4">
                            <v-select
                            label="Unit*"
                            v-model="dosageUnit"
                            :items="units"
                            outlined



                            ></v-select>
                        </v-col>


                        <v-col cols="12" sm="4" md="4">
                            <v-text-field
                            label="Times per Day"
                            type="number"
                            v-model="timesPerDay"
                            outlined



                            ></v-text-field>
                        </v-col>

                        <!-- Select Time -->
                        <v-col cols="12" sm="6" md="6">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="time"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="time"
                                label="First Dose Time*"
                                prepend-icon="access_time"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                outlined
                            ></v-text-field>
                            </template>
                            <v-time-picker
                            v-if="menu"
                            v-model="time"
                            full-width
                            @click:minute="$refs.menu.save(time)"
                            ></v-time-picker>
                        </v-menu>
                        </v-col>


                        <!-- Date Options -->
                        <v-col cols="12" sm="6" md="6">
                            <v-select   
                            label="Date Options"
                            v-model="dateOption"
                            :items="chooseDateOptions"
                            outlined
                            @change="setOption(dateOption)"



                            ></v-select>
                        </v-col>
                        
                         <!-- Multiple Dates Picker -->
                        <v-col cols="12" sm="6" md="6" v-if="showMultiple">
                        <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        max-width="290"
                        >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        label="Select Days*"
                        readonly
                        :value="medDates"
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
                        :min="getTodaysDate()"
                        :max="getFutureDate()"
                        v-model="medDates"
                        multiple
                        >
                        </v-date-picker>
                        </v-menu>
                        </v-col>


                    <!-- Ranged Dates Picker -->
                        <v-col cols="12" sm="6" md="6" v-if="showRange">
                        <v-menu
                        v-model="menu3"
                        :close-on-content-click="false"
                        max-width="290"
                        >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        label="Select Date Range*"
                        readonly
                        :value="medBetweenDates"
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
                        :min="getTodaysDate()"
                        :max="getFutureDate()"
                        v-model="medBetweenDates"
                        range
                        >
                        </v-date-picker>
                        </v-menu>
                        </v-col>


                      <!-- Select a Colour --> 
                        <v-col cols="12" sm="6" md="6">
                       <v-menu
                        v-model="menu4"
                        :close-on-content-click="false"
                        max-width="290"
                        >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        label="Select Colour*"
                        readonly
                        :value="picker"
                        v-bind="attrs"
                        v-on="on"
                        required
                        outlined
                        ></v-text-field>
                        </template>
                        <v-color-picker
                            v-model="picker"
                            flat
                        ></v-color-picker>
                        </v-menu>
                        </v-col>

                        <!-- Additional Details --> 
                        <v-col cols="12" sm="6" md="6">
                             <v-textarea 
                             label="Additional Detail"
                             v-model="medicationDetails" 
                             auto-grow
                             rows="1"
                             outlined 
                            


                             ></v-textarea>
                        </v-col>


                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-col cols="12" class="mt-n6">
                    <v-btn
                    block class="primary white--text"
                    @click.prevent="saveMedication()">
                    <span>Add Medication</span>
                    </v-btn>
                </v-col>  
            </v-card-actions>
        </v-form>
        </v-card>
        </v-dialog>

        <v-sheet height="500">
            <v-calendar
            ref="calendar"
            color="primary"
            :type="type"
            v-model="focus"
            :events="events"
            @click:date="viewDay"
            @click:event="showEvent"
            >
            </v-calendar>
                <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
                >
                <v-card
                color="grey lighten-4"
                min-width="350px"
                flat
                >
                <v-toolbar class="primary" :color="selectedEvent.color" dark>
                <v-toolbar-title class="primary white--text" v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                text
                color="white"
                @click="selectedOpen = false"
                >
                Cancel
                </v-btn>
                </v-toolbar>
                <v-card-text>
                <span v-html="selectedEvent.details"></span>
                </v-card-text>
                </v-card>
                </v-menu>

        </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
import { auth, db, fieldValue } from '../firebase'

export default {
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
    },
    data() {
        return {
            currentUser: null,

            focus: '',
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
            },

            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],

            dialog: false, // add medication
            menu: false, // time picker
            medicationName: null,
            dose: null,
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
            timesPerDay: null,
            medicationDetails: null,
            time: null,
            
            dateOption: null,
            chooseDateOptions: [
                { text: 'Single/Multiple Day(s)', value: 'multiple'},
                { text: 'Date Range', value: 'range'},
            ],

            showMultiple: false, 
            menu2: null, // multiples picker
            medDates: [],

            showRange: false,
            menu3: false, // range picker
            medBetweenDates: [],

            menu4: false,
            picker: null,
            
          
            
        }
    },
    mounted() {
        this.getMedication()
    },
    methods: {
        getTodaysDate () {
            let today = new Date ()
            today.setDate(today.getDate())
            return today.toISOString()
        },
        getFutureDate () {
            let latest = new Date ()
            latest.setMonth(latest.getMonth() + 1)
            return latest.toISOString()
        },
        getMedication () {
            // Set current user to the currently logged in user
           
            db.collection("users").doc(this.currentUser).get().then( snap => {
                
                if(snap.data().medication != null){
                    let medication = snap.data().medication
                    console.log(medication)
                    medication.forEach( medication => {
                        let medicationRecord = medication
                        console.log(medicationRecord)

                        // do calculations here for timeing etc



                        // let event = {
                        //     name: ,
                        //     details: ,
                        //     start: ,
                        //     end: ,
                        // }

                    })
                }
         
                  
            })
  
         
        },
        setOption () {
            // Switch between the two date picking options
            if(this.dateOption == 'multiple'){
                this.medBetweenDates = []
                this.showRange = false
                this.showMultiple = true
            }
            else{
                this.medDates = []
                this.showMultiple = false
                this.showRange = true
            }
        },
        saveMedication () {


            console.log("Dates are ",this.medDates)
            console.log("Dates are ", this.medBetweenDates)
            let dates = []
            if(this.medDates != null){
                this.dates = this.medDates
            }
            else{
                this.dates = this.medBetweenDates
            }
            // dates is returning null???
            var addMedication = {
                medication: this.medicationName,
                dose: this.dose,
                doseUnit: this.dosageUnit, 
                perDay: this.timesPerDay,
                startTime: this.time,
                medDates: dates,
                details: this.medicationDetails,
                color: this.picker,
            }


            var medicationRecord = {
                medication: fieldValue.arrayUnion(addMedication)
            }

            console.log("Medication Record", addMedication ,medicationRecord)

            // db.collection("users").doc(this.currentUser).update(medicationRecord).then(() => {
            //     // Clear the form values
            //     this.medicationName = null
            //     this.dose = null
            //     this.dosageUnit = null
            //     this.timesPerDay = null
            //     this.time = null
            //     this.medDates= null
            //     this.medBetweenDates = null
            //     this.medicationDetails = null
            //     this.picker = null
            // }).catch(error => {
            //     console.log("Med Add ", error)
            // }).then(() => {
            //     console.log("Do stuff")
            // })      
        },

        viewDay ({ date }) {
            this.focus = date
            this.type = 'day'
        },
        setToday () {
            this.focus = ''
        },
        prev () {
            this.$refs.calendar.prev()
        },
        next () {
            this.$refs.calendar.next()
        },

        showEvent ({ nativeEvent, event }) {
            const open = () => {
            this.selectedEvent = event
            this.selectedElement = nativeEvent.target
            setTimeout(() => this.selectedOpen = true, 10)
            }

            if (this.selectedOpen) {
            this.selectedOpen = false
            setTimeout(open, 10)
            } else {
            open()
            }

            nativeEvent.stopPropagation()
      },
    },
}
</script>