<template>


<v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">

    <v-card v-for="appointment in appointments" :key="appointment.id"
    outlined class="mt-2">
    <v-card-title class="text-uppercase">      
        <v-spacer></v-spacer>
        <v-icon right @click="toggleCancelAppointment(appointment.id)">fa-calendar-times</v-icon>
    </v-card-title>

    <v-card-text>
        <v-list>
            <v-item-group>
            <v-item>
                <v-list-item-content>
                    <v-list-item-title>Date</v-list-item-title>
                    {{appointment.appointmentDate}}
                </v-list-item-content>
            </v-item>
            <v-item>
                <v-list-item-content>
                    <v-list-item-title>Description</v-list-item-title>
                    {{appointment.appointmentDetails}}
                </v-list-item-content>
            </v-item>
            </v-item-group>

        </v-list>

    </v-card-text>
    </v-card>

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
          // every appointment is stored here so they can then be called by appointment.propertyName
          appointments: [],
        }
    },
    created() {
        // Set current user to the currently logged in user
        var currentUser = auth.currentUser.uid
        // Query the db to identify any appointments connected to that user
        db.collection("appointments").where("patientID", "==", currentUser).orderBy("appointmentDate").onSnapshot(snap => {
            let appointment = snap.docChanges()
            appointment.forEach(appointment => {
                // realtime add document to appointments list
                if(appointment.type == "added"){
                    let booked = appointment.doc.data()
                    booked.id = appointment.doc.id   
                    // console.log("Appointment ", booked, booked.id)
                    this.appointments.push(booked)
                }
                else if(appointment.type == "removed"){
                    let deleted = appointment.doc.data()
                    console.log("The following record has been removed ", deleted)
                    
                }
            })
        })
    },
    methods: {
        toggleCancelAppointment (id) {
            db.collection("appointments").doc(id).delete().then(() => {
                this.appointments = this.appointments.filter(appointment =>{
                    return appointment.id != id
                })
            })

        },
    }
}
</script>