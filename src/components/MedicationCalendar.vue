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
            <!-- <v-card-title class="primary lighten-1 white--text">Add Medication -->
                <v-card-title class="primary white--text">Add Medication
                <v-spacer></v-spacer>
                <v-btn class="mr-6" icon dark @click="cancel()"> 
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
                            :error-messages="medicationNameError"
                            @input="$v.medicationName.$touch()"
                            @blur="$v.medicationName.$touch()"
                            ></v-text-field>
                        </v-col>
                        <!-- Dose Amount -->
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field
                            label="Dosage*"
                            type="number"
                            v-model="dose"
                            outlined
                            :error-messages="doseError"
                            @input="$v.dose.$touch()"
                            @blur="$v.dose.$touch()"
                            ></v-text-field>
                        </v-col>
                         <!-- Select Type -->
                        <v-col cols="12" sm="4" md="4">
                            <v-select
                            label="Unit*"
                            v-model="dosageUnit"
                            :items="units"
                            outlined
                            :error-messages="dosageUnitError"
                            @input="$v.dosageUnit.$touch()"
                            @blur="$v.dosageUnit.$touch()"
                            ></v-select>
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
                                label="Dose Time*"
                                prepend-icon="access_time"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                outlined
                                :error-messages="timeError"
                                @input="$v.time.$touch()"
                                @blur="$v.time.$touch()"
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
                        <!-- Date Picker -->
                        <v-col cols="12" sm="6" md="6">
                        <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        max-width="290"
                        >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        label="Select Day*"
                        readonly
                        :value="medDates"
                        v-bind="attrs"
                        v-on="on"
                        required
                        outlined
                        :error-messages="medDatesError"
                        @input="$v.medDates.$touch()"
                        @blur="$v.medDates.$touch()"
                        ></v-text-field>
                        </template>
                        <v-date-picker 
                        full-width
                        scrollable
                        show-current
                        :min="getTodaysDate()"
                        :max="getFutureDate()"
                        v-model="medDates"
                        @input="menu2 = false"
                        >
                        </v-date-picker>
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
                            :error-messages="medicationDetailsError"
                            @input="$v.medicationDetails.$touch()"
                            @blur="$v.medicationDetails.$touch()"
                            ></v-textarea>
                        </v-col>

                      <!-- Select a Colour --> 
                        <v-col cols="12" sm="6" md="6">
                       <v-menu
                        v-model="menu3"
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
import { required } from 'vuelidate/lib/validators'

export default {
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
    },
    computed: {
        medicationNameError () {
            const errors = []
            if(!this.$v.medicationName.$dirty) return errors
                !this.$v.medicationName.required && errors.push('Please Select A Medication Name')
            return errors
        },
        doseError () {
            const errors = []
            if(!this.$v.dose.$dirty) return errors
                !this.$v.dose.required && errors.push('Dose Required')
            return errors
        },
        dosageUnitError () {
            const errors = []
            if(!this.$v.dosageUnit.$dirty) return errors
                !this.$v.dosageUnit.required && errors.push('Dosage Unit Required')
            return errors
        },
        timeError () {
            const errors = []
            if(!this.$v.time.$dirty) return errors
                !this.$v.time.required && errors.push('Dose Time Required')
            return errors
        },
        medDatesError () {
            const errors = []
            if(!this.$v.medDates.$dirty) return errors
                !this.$v.medDates.required && errors.push('Dose Date Required')
            return errors
        },
        medicationDetailsError () {
            const errors = []
            if(!this.$v.medicationDetails.$dirty) return errors
                !this.$v.medicationDetails.required && errors.push('Dose Details Required')
            return errors
        },
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
          
            time: null,
            menu2: false, // date-picker
            medDates: null, // Stored date from date=picker
            medicationDetails: null,
            menu3: false, // colour-picker
            picker: null, // Stored colour   
        }
    },
    validations: {
        medicationName: { required },
        dose: { required },
        dosageUnit: { required },
        time: { required },
        medDates: { required },
        medicationDetails: { required },
    },
    mounted() {
        this.getMedication()
    },
    methods: {
        appendLeadingZeroes(n){
            if(n <= 9){
                return "0" + n;
            }
            return n
        },
        getTodaysDate () {
            let today = new Date()
            let formattedDate = today.getFullYear() + "-" + this.appendLeadingZeroes(today.getMonth() + 1) + "-" + this.appendLeadingZeroes(today.getDate()) 
            return formattedDate
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
                    medication.forEach( medication => {
                        let medicationRecord = medication
                        let time = medicationRecord.startTime.replace(".", ":")
                        // let endTime = time.substr(0, time.length -2)
                        // let endTimeMinutes = time.substr(time.length -2, 2)
                        // endTime = endTime + (parseInt(endTimeMinutes) + 25)

                        let event = {
                            name: medicationRecord.medication,
                            details: medicationRecord.details,
                            start: medicationRecord.dateTaken + " " + time,
                            end: medicationRecord.dateTaken + " " + time,
                            // color: medicationRecord.color,
                        }
                       
                        console.log("color is: ",medicationRecord.color)
                        this.events.push(event)
                    
                    })
                }
            })
  
         
        },
        cancel () {
            this.dialog = false
            this.clearForms()
        },
        clearForms() {
            this.$v.$reset()
            this.medicationName = null
            this.dose = null
            this.dosageUnit = null
            this.time = null
            this.medDates= null
            this.medicationDetails = null
            this.picker = null
        },
        saveMedication () {
            this.$v.$touch() // used to check the state of the form fields
            this.formTouched = !this.$v.$anyDirty
            this.errors = this.$v.$anyError
            // If the form does not have any errors or each individual field has no invalid data 
            if (this.errors === false && this.formTouched === false){
                console.log("All G")

                var addMedication = {
                    medication: this.medicationName,
                    dose: this.dose,
                    doseUnit: this.dosageUnit, 
                    startTime: this.time,
                    dateTaken: this.medDates,
                    details: this.medicationDetails,
                    color: this.picker,
                }


                var medicationRecord = {
                    medication: fieldValue.arrayUnion(addMedication)
                }

                db.collection("users").doc(this.currentUser).update(medicationRecord).then(() => {
                    // Clear the form values
                        this.clearForms()
                    }).then(() => {
                        console.log("Submitted!")
                        this.dialog = false
                        
                    }).catch(error => {
                        console.log("Med Add ", error)
                    })     
            }
            else{
                console.log("NoG")
            }
                
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