<template>


<v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">

    <!-- <v-list>
    <v-subheader class="overline white--text grey lighten-2 ">This Week</v-subheader>
    </v-list> -->

        <v-card v-for="appointment in appointments" :key="appointment.id"
        outlined class="mt-2">
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
        //   currentUser: null,

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
                    appointment.id = appointment.doc.id   
                    this.appointments.push(appointment.doc.data())  
                }
                else if(appointment.type == "removed"){
                    console.log("The following record has been removed ", appointment.doc.data())
                    // this.appointments.delete(appointment.doc.data())
                }
            })
        })
    },
}
</script>