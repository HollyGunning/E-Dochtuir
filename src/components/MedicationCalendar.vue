<template>
    <v-row class="fill-height">
        <v-col>
        <!-- Contains the top toolbar with the today, prev, next btn options and a menu that switches the calendar view--> 
        <v-sheet height="64">
            <v-toolbar flat>
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
                        <v-select
                            label="Choose a Colour*"
                            v-model="picker"
                            :items="colourList"
                            outlined
                            :error-messages="colourError"
                            @input="$v.picker.$touch()"
                            @blur="$v.picker.$touch()"
                        ></v-select>
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
            <!-- Calendar is inserted here -->
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
                <v-card color="grey lighten-4" min-width="350px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="deleteEvent(selectedEvent)">
                            <v-icon>fa-trash</v-icon>
                        </v-btn>
                        <v-btn
                        text
                        color="white"
                        @click="selectedOpen = false"
                        >
                        <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
                        <span>Cancel</span>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                    <v-row class="mt-n8">
                    <v-col cols="12" md="12" class="mt-4">
                        <v-list >
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="overline grey--text mb-4">
                                        <v-icon>fa-info</v-icon>
                                        Medication Details</v-list-item-title>
                                        <h3 v-html="selectedEvent.details"></h3>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="12" md="12" class="mt-4">
                        <v-list >
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="overline grey--text mb-4">
                                        <v-icon>fa-syringe</v-icon>
                                        Dose</v-list-item-title>
                                        <h3 v-html="selectedEvent.dose"></h3>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col cols="12" md="12" class="mt-4">
                        <v-list >
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="overline grey--text mb-4">
                                        <v-icon>fa-pills</v-icon>
                                        Dosage Unit</v-list-item-title>
                                        <h3 v-html="selectedEvent.dosageUnit"></h3>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    </v-row>
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
        this.getMedication() // Calls the getMedication method to populate cal
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
        colourError () {
            const errors = []
            if(!this.$v.picker.$dirty) return errors
                !this.$v.picker.required && errors.push('Colour is Required')
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
            // selected event on the calendar
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
            picker: null, // Stored colour 
            colourList: [
                { text: "Red", value: "red"},
                { text: "Yelllow", value: "yellow"},
                { text: "Green", value: "green"},
                { text: "Blue", value: "blue"},
                { text: "Purple", value: "purple"},
                { text: "Pink", value: "pink"},
                { text: "Orange", value: "orange"},
                { text: "Cyan", value: "cyan"},
                { text: "Indigo", value: "indigo"},
            ],
        }
    },
    validations: {
        medicationName: { required },
        dose: { required },
        dosageUnit: { required },
        time: { required },
        medDates: { required },
        medicationDetails: { required },
        picker: { required },
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
        // Load in medication entries
        getMedication () {
            db.collection("users").doc(this.currentUser).onSnapshot(snap => {
                let medication = snap.data().medication
                // so long as there are medication entried in the array in users collection
                if(medication != null){
                    this.events = [] // clear on each check
                    medication.forEach(medication => {
                        // Set the values to pass to the events
                        let time = medication.startTime.replace(".", ":")
                        let event = {
                            name: medication.medication,
                            details: medication.details,
                            dose: medication.dose,
                            dosageUnit: medication.doseUnit,
                            start: medication.dateTaken + " " + time,
                            end: medication.dateTaken + " " + time,
                            color: medication.color,
                        }
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
        // Delete a selected event by removing it from array
        deleteEvent (event) {
            db.collection("users").doc(this.currentUser).update({
                medication: fieldValue.arrayRemove(this.eventToRecord(event))
            })
            this.selectedOpen = false
        },
        // Every value must be passed back into its original form
        // and will only be deleted if values are identical
        eventToRecord (calendarEvent) {
            let datetime = calendarEvent.start.split(" ")
            let date = datetime[0] // Split datatime
            let time = datetime[1] // to two individual values
            // must match perfectly to object
            let record = {
                medication: calendarEvent.name,
                details: calendarEvent.details,
                dose: calendarEvent.dose,
                doseUnit: calendarEvent.dosageUnit,
                dateTaken: date,
                startTime: time,
                color: calendarEvent.color
            }
            return record
        },
        saveMedication () {
            this.$v.$touch() // used to check the state of the form fields
            this.formTouched = !this.$v.$anyDirty
            this.errors = this.$v.$anyError
            // If the form does not have any errors or each individual field has no invalid data 
            if (this.errors === false && this.formTouched === false){
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
                // Update the array with the new medication entry
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