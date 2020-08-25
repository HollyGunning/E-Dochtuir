<template>
<v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">
    <v-tabs v-model="tab">
        <!-- Cycles through tab names -->
    <v-tab v-for="tab in tabs" :key="tab.tabName"> 
        {{ tab.tabName }} 
    </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
        <!-- UPCOMING APPOINTMENTS FILTER HERE -->
        <v-tab-item>
            <!-- For each appointment print out an appointment card with data corresponding to the appointmentID -->
            <v-card outlined class="mt-3" v-for="appointment in appointments" :key="appointment.id">
            <v-card-title class="primary lighten-2 white--text">      
                <v-spacer></v-spacer>
                <!-- Cancel button for the appointments -->
                <v-icon right @click="toggleCancelAppointment(appointment.id)">fa-calendar-times</v-icon>
            </v-card-title>
            <v-card-text class="mt-6">
            <v-row class="mt-n8">
            <v-col cols="12" md="4">
                <v-list >
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="overline grey--text mb-4">
                                <v-icon>fa-id-card</v-icon>
                                Appointment ID</v-list-item-title>
                                <h3>{{ appointment.id }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-clinic-medical</v-icon>
                            Type</v-list-item-title>
                            <h3>{{ appointment.appointmentType }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-user-md</v-icon>
                            Doctor</v-list-item-title>
                            <h3>{{ appointment.doctorName }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-calendar</v-icon>
                            Date</v-list-item-title>
                            <h3>{{ appointment.appointmentDate }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-clock</v-icon>
                            Time</v-list-item-title>
                           <h3>{{ appointment.appointmentTime }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-info</v-icon>
                            Details</v-list-item-title>
                            <h3>{{ appointment.appointmentDetails }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            </v-row>
            </v-card-text>
            </v-card>
        </v-tab-item>
        <!-- OLD APPOINTMENTS FILTER HERE -->
        <v-tab-item>
             <!-- For each old appointment print out an appointment card with data corresponding to the appointmentID -->
            <v-card class="mt-3" v-for="appointment in oldAppointments" :key="appointment.id" outlined>
            <v-card-title class="primary lighten-2 white--text">      
                <v-spacer></v-spacer>
                <!-- Cancel button for the appointments -->
                <v-icon right @click="toggleCancelAppointment(appointment.id)">fa-calendar-times</v-icon>
            </v-card-title>
            <v-card-text class="mt-6">
            <v-row class="mt-n8">
            <v-col cols="12" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-id-card</v-icon>
                            Appointment ID</v-list-item-title>
                            <h3>{{ appointment.id }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-clinic-medical</v-icon>
                            Type</v-list-item-title>
                            <h3>{{ appointment.appointmentType }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-user-md</v-icon>
                            Doctor</v-list-item-title>
                            <h3>{{ appointment.doctorName }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                             <v-icon>fa-calendar</v-icon>
                             Date</v-list-item-title>
                            <h3>{{ appointment.appointmentDate }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-clock</v-icon>
                            Time</v-list-item-title>
                            <h3>{{ appointment.appointmentTime }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text mb-4">
                            <v-icon>fa-info</v-icon>
                            Details</v-list-item-title>
                            <h3>{{ appointment.appointmentDetails }}</h3>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            </v-row>
            </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs-items>
    <v-snackbar
    :color="color"
    v-model="snackbar"
    :timeout="timeout"
    :multi-line="multiLine"
    >{{ snackbarText }}
    </v-snackbar>

</v-col></v-row>
</template>

<script> // Importing; mapState for profile details to populate personal details, auth and db for queries 
import { mapState } from 'vuex'
import {auth, db} from '../../firebase'

export default {
    computed: {
        ...mapState(['userProfile']),
        
    },
    data() {
        return {
            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",
            // Tabs for upcoming and past
            tab: null,
            tabs: [
            { tabName: 'Upcoming' },
            { tabName: 'Past' },
            ],
            // every appointment is stored here so they can then be called by appointment.propertyName
            appointments: [],
            oldAppointments: [],
        }
    },
    created() {     
        //Get the current date
        var currentDate = new Date()
        //date.get year returns the amount of years since 1900, using getFullYear instead
        var currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        // Set current user to the currently logged in user
        var currentUser = auth.currentUser.uid
        // Query the db to identify any appointments connected to that user, order by date and then time, onSnapshot listens for real time updates
        db.collection("appointments").where("patientID", "==", currentUser).orderBy("appointmentDate").orderBy("appointmentTime").onSnapshot(snap => {
            let appointment = snap.docChanges()
            appointment.forEach(async (appointment) => {
                // realtime add document to appointments list
                if(appointment.type == "added"){
                    let booked = appointment.doc.data()
                    booked.id = appointment.doc.id
                    // Get the doctors name by querying the users collection with the doctorID from appointments collection
                    let doctorSnapshot = await db.collection("users").doc(booked.doctorID).get();
                    doctorSnapshot = doctorSnapshot.data();
                    booked.doctorName = doctorSnapshot.firstname + ' ' + doctorSnapshot.surname;
                    // Checking booked time against current time
                    var checkAppointmentDates = new Date(booked.appointmentDate)
                        if(checkAppointmentDates < currentDateStart){
                            this.oldAppointments.push(booked)
                        }   
                        else{
                            this.appointments.push(booked) 
                        }
                }
                else if(appointment.type == "removed"){
                    let deleted = appointment.doc.data()
                    console.log("The following record has been removed ", deleted)  
                }
                    //Take in two params to compare, iterates over the array 
                    var appointmentSort = (a,b) => {
                    let aDate = new Date(a.appointmentDate)
                    let bDate = new Date(b.appointmentDate)
                    return aDate.getTime() - bDate.getTime()
                    }
                    // using the.sort method to sort the values in the string, to ensure that if a new appointment 
                    // is added that it is populated in the correct appointment order in upcoming appointments
                    this.appointments.sort(appointmentSort)
                    this.oldAppointments.sort(appointmentSort)
            })
        })    
    },
    methods: {
        triggerSnackbar (message, color) {
            this.snackbarText = message,
            this.color = color,
            this.snackbar = true
        },
        // Delete appointments in real time, takes the id of the appointment and filters it out of the corresponding array
        toggleCancelAppointment (id) {
            // Can only cancel appointments if not the day of appointment

            // Upcoming Appointments
            db.collection("appointments").doc(id).delete().then(() => {
                this.appointments = this.appointments.filter(appointment => {
                    return appointment.id != id
                })
            })
            // Past Appointments
            db.collection("appointments").doc(id).delete().then(() => {
                this.oldAppointments = this.oldAppointments.filter(appointment => {
                    return appointment.id !=id
                })
            })
            this.triggerSnackbar("Appointment Has Been Deleted", "error")

        }, 
    }
}
</script>