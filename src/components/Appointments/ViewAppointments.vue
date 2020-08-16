<template>

<v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">
    <v-tabs v-model="tab">
    <v-tab v-for="tab in tabs" :key="tab.tabName"> 
        {{ tab.tabName }} 
    </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
        <!-- UPCOMING APPOINTMENTS FILTER HERE -->
        <v-tab-item>
            <v-card v-for="appointment in appointments" :key="appointment.id"
            outlined class="mt-2">
            <v-card-title class="text-uppercase">      
                <v-spacer></v-spacer>
                <v-icon right @click="toggleCancelAppointment(appointment.id)">fa-calendar-times</v-icon>
            </v-card-title>
            <v-card-text>
            <v-row class="mt-n8">
            <v-col cols="12" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="overline grey--text">Appointment ID</v-list-item-title>
                            {{appointment.id}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Doctor</v-list-item-title>
                            {{ appointment.doctorName }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Date</v-list-item-title>
                        {{appointment.appointmentDate}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Time</v-list-item-title>
                        {{appointment.appointmentTime}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Details</v-list-item-title>
                        {{appointment.appointmentDetails}}
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
            <v-card v-for="appointment in oldAppointments" :key="appointment.id"
            outlined class="mt-2">
            <v-card-title class="text-uppercase">      
                <v-spacer></v-spacer>
                <v-icon right @click="toggleCancelAppointment(appointment.id)">fa-calendar-times</v-icon>
            </v-card-title>
            <v-card-text>
            <v-row class="mt-n8">
            <v-col cols="12" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Appointment ID</v-list-item-title>
                        {{appointment.id}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Doctor</v-list-item-title>
                         {{ appointment.doctorName }}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Date</v-list-item-title>
                        {{appointment.appointmentDate}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Time</v-list-item-title>
                        {{appointment.appointmentTime}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="6" md="4">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                        <v-list-item-title class="overline grey--text">Details</v-list-item-title>
                            {{appointment.appointmentDetails}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
            </v-row>
            </v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs-items>
</v-col></v-row>

</template>

<script>
import { mapState } from 'vuex'
import {auth, db} from '../../firebase'

export default {
    computed: {
        ...mapState(['userProfile']),
        
    },
    data() {
        return {

        tab: null,
        tabs: [
          { tabName: 'Upcoming', content: 'Tab 1 Content' },
          { tabName: 'Past', content: 'Tab 2 Content' },
        ],
          // every appointment is stored here so they can then be called by appointment.propertyName
          appointments: [],
          oldAppointments: [],
        }
    },
    created() {
        
        //Get the current date
        var currentDate = new Date()
        //date.get year returns the amount of years since 1900
        var currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        // Set current user to the currently logged in user
        var currentUser = auth.currentUser.uid
        // Query the db to identify any appointments connected to that user
        db.collection("appointments").where("patientID", "==", currentUser).orderBy("appointmentDate").orderBy("appointmentTime").onSnapshot(snap => {
            let appointment = snap.docChanges()
            appointment.forEach(async (appointment) => {
                // realtime add document to appointments list
                if(appointment.type == "added"){
                    let booked = appointment.doc.data()
                    booked.id = appointment.doc.id
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
            })

            //Take in two params to compare, iterates over the array 
            var appointmentSort = (a,b) => {
                let aDate = new Date(a.appointmentDate)
                let bDate = new Date(b.appointmentDate)
                return aDate.getTime() - bDate.getTime()
            }

            this.appointments.sort(appointmentSort)
            this.oldAppointments.sort(appointmentSort)
            

        })


        // // TODO: Got name now how to get it to user display?
        // db.collection("appointments").get().then( snap => {
        //     snap.forEach(doc => {
        //         let doctorID = doc.data().doctorID
       
        //         db.collection("users").doc(doctorID).get().then( doc => {
                  
        //         var doctorName = doc.data().firstname + ' ' + doc.data().surname
        //         console.log(doctorName)
                        
        //         })
              
        //     })
        // })
    
    },
    methods: {
        toggleCancelAppointment (id) {
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
        },

        
    }
}
</script>