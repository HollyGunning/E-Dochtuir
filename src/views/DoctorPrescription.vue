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
          :items="prescriptionsPending"
          :search="search"
          :items-per-page="10"
          class="elevation-1"
          >
          <template v-slot:[`item.actions`]="{ item }">
            <v-col cols="12" s="12" sm="12" md="12" lg="12">
            <v-icon
            class="mr-2"
            :key="item.id"
            :items="prescriptionsPending"
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
            <!-- Contraception -->
            <v-card flat v-if="showContraception">
                <v-card-title class="mb-4 primary lighten-2 white--text">Contraceptive Pill & Patches Request</v-card-title>
                <v-card-text>
                    <v-row>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Contraceptive Type"
                        v-model="contraceptiveType"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Regular Periods"
                        v-model="period"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Previous Usage"
                        v-model="previousUsage"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Side Effects"
                        v-model="sideEffects"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="12" md="8" lg="8">
                        <v-text-field
                        label="Side Effects Description"
                        v-model="description"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card flat v-if="showThrush">
                <v-card-title class="mb-4 primary lighten-2 white--text">Thrush Treatment Request</v-card-title>
                <v-card-text>
                <v-row>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Severe Abdominal Pain"
                        v-model="abdominalPain"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Blisters/Rashes on Skin Around Vagina"
                        v-model="skinIssues"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Pain Urinating/Increase Urinary Frequency"
                        v-model="urinaryIssue"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>

            <v-card flat v-if="showAdrenaline">
                <v-card-title class="mb-4 primary lighten-2 white--text">Adrenaline Pen Treatment Request</v-card-title>
                <v-card-text>
                <v-row>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Diagnosed with an Anaphylactic Allergy by a Doctor"
                        v-model="diagnosed"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Trained to use a Prefilled Adrenaline Injectable Pen"
                        v-model="trained"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Recognises Signs & Symptoms of an Anaphylactic Reaction"
                        v-model="recogniseSymptoms"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>

            <v-card flat v-if="showAsthma">
                <v-card-title class="mb-4 primary lighten-2 white--text">Asthma Treatment Request</v-card-title>
                <v-card-text>
                <v-row>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Asthma Condition"
                        v-model="asthmaCondition"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Asthma Severity"
                        v-model="asthmaSeverity"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Have Oral Steroids ever been Required"
                        v-model="steroids"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>

            <v-card flat v-if="showPreE">
                <v-card-title class="mb-4 primary lighten-2 white--text">Premature Ejaculation Treatment</v-card-title>
                <v-card-text>
                    <v-row>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Time Sexually Active"
                        v-model="durationWith"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="When is it Experienced"
                        v-model="often"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="When does Ejaculation Occur"
                        v-model="occurs"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Medication Requested"
                        v-model="medicationRequest"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <v-card flat v-if="showErecDys">
                <v-card-title class="mb-4 primary lighten-2 white--text">Erectile Dysfunction Treatment</v-card-title>
                <v-card-text>
                <v-row>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Medication Requested"
                        v-model="eDTreatment"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Dosage Requested"
                        v-model="eDDosage"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                    <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                        <v-text-field
                        label="Any Prior Usage"
                        v-model="eDpreviousUsage"
                        outlined
                        readonly
                        ></v-text-field>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>
        </v-col></v-row>

        <!-- FOR DOCTOR USE --> 
        <v-card flat>
            <v-card-title>
                <v-divider></v-divider>
            </v-card-title>
            <v-card-text>  
            <v-row>
                <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4">
                    <v-select
                    label="Select Response"
                    v-model="response"
                    :items="responses"
                    outlined
                    @change="responseChanges(response)"
                    :error-messages="responseError"
                    @input="$v.response.$touch()"
                    @blur="$v.response.$touch()"
                    ></v-select>
                </v-col>
                <v-col class="mt-n3" cols="12" sm="6" md="4" lg="4" v-if="showUpload">
                    <v-file-input
                    type="file"
                    v-model="prescriptionFile"
                    label="Upload prescription"
                    outlined
                    ></v-file-input>
                </v-col>
           

                <v-col class="mt-n3" cols="12" sm="6" md="8" lg="8" v-if="showDenied">
                    <v-textarea
                    label="Reason"
                    v-model="reasonDenied"
                    outlined
                    counter="250"
                    maxlength="250"
                    ></v-textarea>
                </v-col>
            </v-row>
            </v-card-text>
            <v-card-actions>
            <v-col cols="12">
                <v-btn
                type="submit"
                block class="primary white--text"
                @click.prevent="resolveRequest()">
                <span>Resolve Request</span>
                </v-btn>
                <v-snackbar
                  :color="color"
                  v-model="snackbar"
                  :timeout="timeout"
                  :multi-line="multiLine"
                >{{ snackbarText }}
                </v-snackbar>
            </v-col>  
            </v-card-actions>
        </v-card>
      


    </v-card>

    </v-dialog>

</v-col></v-row>
</v-container>
</template>

<script>
import DoctorNavbar from '../components/Navbars/DoctorNavbar'
import { auth, db, storage } from '../firebase'
import { required } from "vuelidate/lib/validators"

export default {
    components: {
        DoctorNavbar,

    },
    computed: {
        responseError () {
        const errors = []
        if(!this.$v.response.$dirty) return errors
          !this.$v.response.required && errors.push('A Response Is Required')
        return errors
      },
    },
    created() {
        this.currentUser = auth.currentUser.uid

        db.collection("prescriptions").where("doctor", "==", this.currentUser).orderBy("dateRequested").orderBy("patientName").onSnapshot(snap => {
            let prescriptionToHandle = snap.docChanges()
            prescriptionToHandle.forEach(prescriptionToHandle => {
                if(prescriptionToHandle.type == "added"){
                     let prescription = prescriptionToHandle.doc.data()
                    prescription.id = prescriptionToHandle.doc.id
                    //Only show prescriptions of status pending to the doctor
                    if(prescription.status == "Pending Review"){
                        let patient = {
                            id: prescription.id,
                            name: prescription.patientName,
                            prescription: prescription.chosenType,
                            requestDate: prescription.dateRequested,
                        }
                        this.prescriptionsPending.push(patient)
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
            // Snackbar properties
            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",
            prescriptionRecord: null, // Store the patient ID when doctor clicks on actions
            search: '', // Search bar 
            dialog: false,
            headers: [
                { text: 'Patient Name', value: 'name' },
                { text: 'Prescription', value: 'prescription' },
                { text: 'Date Requested', value: 'requestDate' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            prescriptionsPending: [],
            prescriptionsAccepted: [],
            prescriptionsDenied: [],

            // Doctor Form Section
            response: null,
            responses: [
                { text: 'Accepted', value: 'Accepted' },
                { text: 'Denied', value: 'Denied' }
            ],
            showDenied: false,
            reasonDenied: null,
            showUpload: false,
            prescriptionFile: null,
            downloadUrl: "none",
            prescriptionUpload: "none",
            URL: "gs://e-dochtuir.appspot.com/prescriptions",


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
            asthmaSeverity: null,
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
    validations:{
        response: { required }
    },
    methods: {
        // Triggers the snackbar with the passed message and colour of the message
        triggerSnackbar (message, color) {
            this.snackbarText = message,
            this.color = color,
            this.snackbar = true
        },
        close () {
            this.dialog = false
            this.response = null,
            this.reasonDenied = null
        },
        hideAllTreatments () {
            this.showAdrenaline = false,
            this.showAsthma = false,
            this.showContraception = false,
            this.showThrush = false,
            this.showErecDys = false,
            this.showPreE = false
        },
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
        // Access the record associated with the user by the ID of the prescription to populate their information into variables
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
        clearForm () {
            this.hideAllTreatments()
            this.showDenied = false
            this.showUpload = false
            this.response = null
            this.reasonDenied = null
            this.prescriptionFile = null
            this.dialog = false
        },
        responseChanges (response) {
            if(response == "Denied"){
                this.showUpload = false
                this.showDenied = true
            }
            else{
                this.showDenied = false
                this.showUpload = true
            }
        },

        resolveRequest () {
        this.$v.$touch() // used to check the state of the form fields
        this.formTouched = !this.$v.$anyDirty
        this.errors = this.$v.$anyError
        // If the form does not have any errors or each individual field has no invalid data 
        if (this.errors === false && this.formTouched === false){ 
                        db.collection("prescriptions").doc(this.prescriptionRecord).get().then(() => {
                if(this.response == "Accepted"){
                    
                    var file = this.prescriptionFile // Get the file
                    // Create the storage reference
                    const storageRef = storage.ref("prescriptions/" + this.prescriptionRecord)
                    // this.prescriptionUpload = file.name //not sure if still need these?
                    // this.downloadUrl = URL + file.name
                    storageRef.put(file) // Store the file using the storage reference

                        this.triggerSnackbar("Response Submitted", "success")
                        db.collection("prescriptions").doc(this.prescriptionRecord).update({
                            status: this.response,
                            dateAccepted: this.getTodaysDate()
                        }).then(() => {
                            this.clearForm()
                            // Clear the prescription from list of pending prescriptions
                            this.prescriptionsPending = this.prescriptionsPending.filter(prescription => {
                            return prescription.id != this.prescriptionRecord
                            })
                        })

                }
                else if(this.response == "Denied"){


                    this.triggerSnackbar("Response Submitted", "success")
                    db.collection("prescriptions").doc(this.prescriptionRecord).update({
                        status: this.response,
                        reason: this.reasonDenied
                    }).then(() =>{
                        this.clearForm()
                        // Clear the prescription from list of pending prescriptions
                        this.prescriptionsPending = this.prescriptionsPending.filter(prescription => {
                        return prescription.id != this.prescriptionRecord
                        })
                    })
                }
                else{
                    console.log("We got problems")
                }
            })
        }
        else{
            this.triggerSnackbar("Please Complete Form Before Submission", "error")
        }


        },
    },
}
</script>