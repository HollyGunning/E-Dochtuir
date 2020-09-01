<template>
<v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">
        <v-tabs v-model="tab">
            <v-tab v-for="tab in tabs" :key="tab.tabName"> 
                {{ tab.tabName }} 
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <!-- Requested -->
             <v-tab-item>
                <v-card outlined class="mt-3" v-for="prescription in requestedPrescriptions" :key="prescription.id">
                <v-card-title class="primary lighten-2 white--text">
                <v-spacer></v-spacer>
                <!-- Cancel button for the prescriptions -->
                <v-icon right @click="cancelPrescription(prescription.id)">fa-trash</v-icon>
                </v-card-title>
                <v-card-text class="mt-6">
                <v-row class="mt-n8">
                <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Prescription ID</v-list-item-title>
                                    <h3>{{ prescription.id }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="6" md="4">
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="overline grey--text mb-4">
                                <v-icon>fa-file-prescription</v-icon>
                                Type</v-list-item-title>
                                <h3>{{ prescription.chosenType }}</h3>
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
                                Date Requested</v-list-item-title>
                                <h3>{{ prescription.dateRequested }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="6" md="4">
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="overline grey--text mb-4">
                                <v-icon>fa-file-medical-alt</v-icon>
                                Status</v-list-item-title>
                                <h3>{{ prescription.status }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                </v-row>
                </v-card-text>
                </v-card>
            </v-tab-item>
            <!-- Accepted -->
            <v-tab-item>
                <v-card outlined class="mt-3" v-for="prescription in acceptedPrescriptions" :key="prescription.id">
                <v-card-title class="primary lighten-2 white--text">
                <v-spacer></v-spacer>
                <!-- Cancel button for the prescriptions -->
                <!-- <v-icon right @click="cancelPrescription(prescription.id)">fa-trash</v-icon> -->
                </v-card-title>
                <v-card-text class="mt-6">
                <v-row class="mt-n8">
                <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Prescription ID</v-list-item-title>
                                    <h3>{{ prescription.id }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="6" md="4">
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="overline grey--text mb-4">
                                <v-icon>fa-file-prescription</v-icon>
                                Type</v-list-item-title>
                                <h3>{{ prescription.chosenType }}</h3>
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
                                Date Requested</v-list-item-title>
                                <h3>{{ prescription.dateRequested }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="6" md="4">
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="overline grey--text mb-4">
                                <v-icon>fa-file-medical-alt</v-icon>
                                Status</v-list-item-title>
                                <h3>{{ prescription.status }}</h3>
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
                                Additional Details</v-list-item-title>
                                <h3>{{ prescription.additionalDetails }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                </v-row>
                </v-card-text>
                </v-card>
            </v-tab-item>
            <!-- Denied -->
            <v-tab-item>
                <v-card outlined class="mt-3" v-for="prescription in deniedPrescriptions" :key="prescription.id">
                <v-card-title class="primary lighten-2 white--text">
                <v-spacer></v-spacer>
                <!-- Cancel button for the prescriptions -->
                <!-- <v-icon right @click="cancelPrescription(prescription.id)">fa-trash</v-icon> -->
                </v-card-title>
                <v-card-text class="mt-6">
                <v-row class="mt-n8">
                <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Prescription ID</v-list-item-title>
                                    <h3>{{ prescription.id }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="6" md="4">
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="overline grey--text mb-4">
                                <v-icon>fa-file-prescription</v-icon>
                                Type</v-list-item-title>
                                <h3>{{ prescription.chosenType }}</h3>
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
                                Date Requested</v-list-item-title>
                                <h3>{{ prescription.dateRequested }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="6" md="4">
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="overline grey--text mb-4">
                                <v-icon>fa-file-medical-alt</v-icon>
                                Status</v-list-item-title>
                                <h3>{{ prescription.status }}</h3>
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
                                Reason</v-list-item-title>
                                <h3>{{ prescription.reason }}</h3>
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

<script>
import {auth, db} from '../../firebase'

export default {
    created() {
        this.currentUser = auth.currentUser.uid
        db.collection("prescriptions").where("patientID", "==", this.currentUser).orderBy("dateRequested").onSnapshot(snap => {
            let prescriptions = snap.docChanges()
            prescriptions.forEach(async (prescriptions) => {
                if(prescriptions.type == "added"){
                    let prescription = prescriptions.doc.data()
                    prescription.id = prescriptions.doc.id
                    
                    if(prescription.status == "Pending Review"){
                        this.requestedPrescriptions.push(prescription)
                    }
                    else if(prescription.status == "Accepted"){
                        this.acceptedPrescriptions.push(prescription)
                    }
                    else if (prescription.status == "Denied"){
                        this.deniedPrescriptions.push(prescription)
                    }
                    else{
                        console.log("Internal Prescription Error")
                    }
                }
            })
        })
    },
    data() {
        return {
            currentUser: null,
            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",
            // Tabs for requested, accepted and denied
            tab: null,
            tabs: [
            { tabName: 'Requested' },
            { tabName: 'Accepted' },
            { tabName: 'Denied' },
            ],

            requestedPrescriptions: [],
            acceptedPrescriptions: [],
            deniedPrescriptions: [],
        }
    },
    methods: {
        triggerSnackbar (message, color) {
            this.snackbarText = message,
            this.color = color,
            this.snackbar = true
        },
        cancelPrescription (id) {
            // Requested
            db.collection("prescriptions").doc(id).delete().then(() => {
                this.requestedPrescriptions = this.requestedPrescriptions.filter(prescription => {
                    return prescription.id !=id
                })
            })
            // // Accepted
            // db.collection("prescriptions").doc(id).delete().then(() => {
            //     this.acceptedPrescriptions = this.acceptedPrescriptions.filter(prescription => {
            //         return prescription.id !=id
            //     })
            // })
            // // Denied
            // db.collection("prescriptions").doc(id).delete().then(() => {
            //     this.deniedPrescriptions = this.deniedPrescriptions.filter(prescription => {
            //         return prescription.id !=id
            //     })
            // })
            this.triggerSnackbar("Prescription Has Been Successfully Deleted!", "success")
        },
    }
}
</script>