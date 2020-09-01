<template>
<v-container>	
<DoctorNavbar />
<v-row><v-col cols="12" s="12" sm="12" md="12" lg="12">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
    <!-- Patient Prescription Search Bar -->
    <v-card outlined>
        <v-card-title class="text-uppercase grey--text text--darken-1">Prescriptions
        <v-spacer></v-spacer>
        <v-text-field
        v-model="search"
        append-icon="fa-search"
        label="Search"
        single-line
        hide-details
        ></v-text-field>
        </v-card-title>
    </v-card>
     <!-- Card for the Data Table -->
            <v-card outlined>
          <v-data-table
          :headers="headers"
          :items="patients"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          >
          <template v-slot:[`item.actions`]="{ item }">
            <v-col cols="12" s="12" sm="12" md="12" lg="12">
            <v-icon
            class="mr-2"
            :key="item.id"
            :items="patients"
            v-bind="attrs"
            v-on="on"
            @click="storeID(item.id)"
            >fa-file-alt
            </v-icon>
            </v-col>
            
          </template>
          </v-data-table>
        </v-card>

    </template>
    <!-- Opens info pertaining to the request -->
    <v-card>
        <v-card-title class="primary white--text">
          <v-btn class="ml-0" icon dark @click="close()"> 
          <v-icon class="ml-0" fab dark color="white--text darken-1 ">fa-long-arrow-alt-left</v-icon>
          </v-btn>
          <span class="ml-10">Review Prescription</span>
        </v-card-title>
        <v-row><v-col cols="12" md="12" lg="12">
            <v-card v-if="showContraception">
                <v-card-title></v-card-title>
                <v-card-text>
                    Contraception
                </v-card-text>
            </v-card>

            <v-card v-if="showThrush">
                <v-card-title></v-card-title>
                <v-card-text>
                    Thrush
                </v-card-text>
            </v-card>

            <v-card v-if="showAdrenaline">
                <v-card-title></v-card-title>
                <v-card-text>
                    Adrenaline
                </v-card-text>
            </v-card>

            <v-card v-if="showAsthma">
                <v-card-title></v-card-title>
                <v-card-text>
                    Asthma
                </v-card-text>
            </v-card>

            <v-card v-if="showPreE">
                <v-card-title></v-card-title>
                <v-card-text>
                    PreE
                </v-card-text>
            </v-card>

            <v-card v-if="showErecDys">
                <v-card-title></v-card-title>
                <v-card-text>
                    ED
                </v-card-text>
            </v-card>
        </v-col></v-row>
    </v-card>

    </v-dialog>

    <!-- <v-tabs v-model="tab">
            <v-tab v-for="tab in tabs" :key="tab.tabName"> 
                {{ tab.tabName }} 
            </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
        <v-tab-item>
        <v-card outlined class="mt-3" v-for="prescription in prescriptionsPending" :key="prescription.id">
            <v-card-title class="primary lighten-2 white--text">Presctiptions</v-card-title>
            <v-card-text class="mt-6">
                <v-row class="mt-n8">
                    <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item :search="search">
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Request From</v-list-item-title>
                                    <h3>{{ prescription.patientName }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Prescription Type</v-list-item-title>
                                    <h3>{{ prescription.chosenType }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        </v-tab-item>


        <v-tab-item>
        <v-card outlined class="mt-3" v-for="prescription in prescriptionsAccepted" :key="prescription.id">
            <v-card-title class="primary lighten-2 white--text">Presctiptions</v-card-title>
            <v-card-text class="mt-6">
                <v-row class="mt-n8">
                    <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Request From</v-list-item-title>
                                    <h3>{{ prescription.patientName }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Prescription Type</v-list-item-title>
                                    <h3>{{ prescription.chosenType }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        </v-tab-item>


        <v-tab-item>
        <v-card outlined class="mt-3" v-for="prescription in prescriptionsDenied" :key="prescription.id">
            <v-card-title class="primary lighten-2 white--text">Presctiptions</v-card-title>
            <v-card-text class="mt-6">
                <v-row class="mt-n8">
                    <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Request From</v-list-item-title>
                                    <h3>{{ prescription.patientName }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="12" md="4">
                    <v-list >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="overline grey--text mb-4">
                                    <v-icon>fa-id-card</v-icon>
                                    Prescription Type</v-list-item-title>
                                    <h3>{{ prescription.chosenType }}</h3>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        </v-tab-item>
    </v-tabs-items> -->





</v-col></v-row>
</v-container>
</template>

<script>
import DoctorNavbar from '../components/Navbars/DoctorNavbar'
import { auth, db } from '../firebase'

export default {
    components: {
        DoctorNavbar,

    },
    created() {
        this.currentUser = auth.currentUser.uid

        db.collection("prescriptions").where("doctor", "==", this.currentUser).orderBy("dateRequested").orderBy("patientName").onSnapshot(snap => {
            let prescriptionToHandle = snap.docChanges()
            prescriptionToHandle.forEach(prescriptionToHandle => {
                if(prescriptionToHandle.type == "added"){
                     let prescription = prescriptionToHandle.doc.data()
                    prescription.id = prescriptionToHandle.doc.id

                    let patient = {
                        id: prescription.id,
                        name: prescription.patientName,
                        prescription: prescription.chosenType,
                        requestDate: prescription.dateRequested,
                    }
                    this.patients.push(patient)

                    //Only show prescriptions of status pending ot the doctor
                    if(prescription.status == "Pending Review"){
                        this.prescriptionsPending.push(prescription)
                    }
                    else if (prescription.status == "Accepted"){
                        this.prescriptionsAccepted.push(prescription)
                    }
                    else if(prescription.status == "Denied"){
                        this.prescriptionsDenied.push(prescription)
                    }
                    else{
                        console.log("Internal prescription error")
                    }
                }
                else{
                    console.log("Prescription handling error")
                }
            })
        })
    },
    data() {
        return {
            currentUser: null,
            prescriptionRecord: null, // Store the patient ID when doctor clicks on actions
            search: '', // Search bar 
            dialog: false,
            patients: [],
            headers: [
                { text: 'Patient Name', value: 'name' },
                { text: 'Prescription', value: 'prescription' },
                { text: 'Date Requested', value: 'requestDate' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            // Tabs for requested, accepted and denied
            tab: null,
            tabs: [
            { tabName: 'Requested' },
            { tabName: 'Accepted' },
            { tabName: 'Denied' },
            ],

            prescriptionsPending: [],
            prescriptionsAccepted: [],
            prescriptionsDenied: [],

            // Contraceptive Details
            showContraception: false,
            contraceptiveType: null,
            period: null,
            previousUsage: null,
            sideEffects: null,
            description: null,
            
            // Thrush Details
            showThrush: false,
            abdominalPain: null,
            skinIssues: null,
            urinaryIssue: null,

            // Adrenaline Details
            showAdrenaline: false,
            diagnosed: null,
            trained: null,
            recogniseSymptoms: null,

            // Asthma Details
            showAsthma: false,
            asthmaCondition: null,
            asthmanSeverity: null,
            steroids: null,

            // PreE Details
            showPreE: false,
            durationWith: null,
            often: null,
            occurs: null,
            medicationRequest: null,

            // ErecDys Details
            showErecDys: false,
            eDTreatment: null,
            eDDosage: null,
            eDpreviousUsage: null,
        }
    },
    methods: {
        close () {
            this.dialog = false
        },
        hideAllTreatments () {
            this.showAdrenaline = false,
            this.showAsthma = false,
            this.showContraception = false,
            this.showThrush = false,
            this.showErecDys = false,
            this.showPreE = false
        },
        storeID (id) {
            this.prescriptionRecord = id

            db.collection("prescriptions").doc(this.prescriptionRecord).onSnapshot(snap => {
                let prescriptionInfo = snap.data()
                prescriptionInfo.id = snap.id

                if (prescriptionInfo.chosenType == "Contraception"){
                    // Hide all forms before showing specific one
                    this.hideAllTreatments()
                    this.showContraception = true
                    // Populate any info for this form
                    this.contraceptiveType = prescriptionInfo.contraception
                    this.period = prescriptionInfo.periodRegulation
                    this.previousUsage = prescriptionInfo.previousUsage
                    this.sideEffects = prescriptionInfo.sideEffects
                    this.description = prescriptionInfo.effectsDescription



                }
                else if (prescriptionInfo.chosenType == "Thrush Treatment"){
                    // Hide all forms before showing specific one
                    this.hideAllTreatments()
                    this.showThrush = true
                    // Populate any info for this form
                    this.abdominalPain = prescriptionInfo.abdominalPain
                    this.skinIssues = prescriptionInfo.skinIssues
                    this.urinaryIssue = prescriptionInfo.urinaryIssue



                }
                else if (prescriptionInfo.chosenType == "Adrenaline Pen Treatment"){
                    // Hide all forms before showing specific one
                    this.hideAllTreatments()
                    this.showAdrenaline = true
                    // Populate any info for this form
                    this.diagnosed = prescriptionInfo.adrenalineDiagnosis
                    this.trained = prescriptionInfo.trained
                    this.recogniseSymptoms = prescriptionInfo.recogniseSymptoms



                }
                else if (prescriptionInfo.chosenType == "Asthma Treatment"){
                    // Hide all forms before showing specific one
                    this.hideAllTreatments()
                    this.showAsthma = true
                    // Populate any info for this form
                    this.asthmaCondition = prescriptionInfo.asthmaLength
                    this.asthmaSeverity = prescriptionInfo.asthmaSeverity
                    this.steroids = prescriptionInfo.anySteroids



                }
                else if (prescriptionInfo.chosenType == "Premature Ejaculation Treatment"){
                    // Hide all forms before showing specific one
                    this.hideAllTreatments()
                    this.showPreE = true
                    // Populate any info for this form
                    this.durationWith = prescriptionInfo.durationWith
                    this.often = prescriptionInfo.howOften
                    this.occurs = prescriptionInfo.occurs
                    this.medicationRequest = prescriptionInfo.medication



                }
                else if (prescriptionInfo.chosenType == "Erectile Dysfunction Treatment"){
                    // Hide all forms before showing specific one
                    this.hideAllTreatments()
                    this.showErecDys = true
                    // Populate any info for this form
                    this.eDTreatment = prescriptionInfo.eDTreatment
                    this.eDDosage = prescriptionInfo.dosage
                    this.eDpreviousUsage = prescriptionInfo.previousUsage



                }
                else{
                    console.log("Treatment not recognised!")
                    this.hideAllTreatments()
                }
            })
        },
    },
}
</script>