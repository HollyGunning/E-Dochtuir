<template>
<v-container>
<Navbar />
    <v-row><v-col cols="12">
   

     <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <!-- Viewing of appointments occurs here --> 
          <v-card flat>
            <v-card-title class="primary lighten-1 white--text">Prescriptions
            <v-spacer></v-spacer>
              <v-btn
              class="mx-2" 
              fab small
              dark color="primary darken-1"
              v-bind="attrs"
              v-on="on"
              >
              <v-icon>fa-plus</v-icon>
              </v-btn>
            </v-card-title>
              <!-- View Prescriptions Component is imported here, makes it easier to keep the code tidier --> 
              <ViewPrescriptions />
          </v-card>
        </template>
        <!-- Book appointment starts here -->
        <v-card>   
        <v-card-title class="primary white--text">
          Request Prescription
          <v-spacer></v-spacer>
          <v-btn class="mr-4" icon dark @click="cancel()"> 
          <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
          <span>Cancel</span>
          </v-btn>
        </v-card-title>
        <v-divider class="mx4"></v-divider>
        <v-form @submit.prevent="requestPrescription">
        <v-card-text>
            <!-- No Gender Defined Card --> 
            <v-card v-if="noGenderView">
                <v-card-title></v-card-title>
                <v-card-text>
                <v-row>
                <v-col cols="12" md="6" lg="6">
                    <h2 class="overline black--text ml-4" justify="center">You Have Not Selected Your Gender In Medical Record!</h2>
                </v-col>
                <v-col cols="12" md="6" lg="6">
                    <router-link to="/medicalRecord" tag="button">
                        <v-btn class="primary white--text">Go To Medical Record</v-btn>
                    </router-link>
                </v-col>
                </v-row>
                </v-card-text>
            </v-card>

          <v-row>     
              
            <v-col cols="12" sm="4" md="4" v-if="showFemaleT">
                <v-select
                label="Female Treatments"
                v-model="chosenOption"
                :items="femaleTreatments"
                outlined
                @change="setTreatmentOption(chosenOption)"

                ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="4" v-if="showMaleT">
                <v-select
                label="Male Treatments"
                v-model="chosenOption"
                :items="maleTreatments"
                outlined
                @change="setTreatmentOption(chosenOption)"
                ></v-select>
            </v-col>

         
         
            <v-col cols="12">
                <!-- Asthma -->
                <v-card v-if="showAsthma">
                    <v-card-title class="primary lighten-1 white--text">Asthma Treatment</v-card-title>
                    <v-card-text>
                        <v-row>
                        <v-col cols="12" sm="6" md="6" lg="6">
                            <v-subheader class="overline ml-n5">How Long With Asthma?</v-subheader>
                            <v-select
                            label="Select a Length of Time*"
                            v-model="asthma.asthmaLength"
                            :items="asthmaLengthList"
                            outlined
                            :error-messages="asthmaLengthError"
                            @click="$v.asthma.asthmaLength.$touch()"
                            @blur="$v.asthma.asthmaLength.$touch()"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" lg="6">
                            <v-subheader class="overline ml-n5">Have You Ever Required Oral Steroids?</v-subheader>
                            <v-select
                            label="Select*"
                            v-model="asthma.asthmaSteroids"
                            :items="asthmaSteroidList"
                            outlined
                            :error-messages="asthmaSteroidsError"
                            @click="$v.asthma.asthmaSteroids.$touch()"
                            @blur="$v.asthma.asthmaSteroids.$touch()"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" lg="6">
                            <v-subheader class="overline ml-n5">Asthma Severity*</v-subheader>
                            <v-btn-toggle
                            v-model="asthma.asthmaSeverity" 
                            color="primary" 
                            group 
                            :error-messages="asthmaSeverityError"
                            @click="$v.asthma.asthmaSeverity.$touch()"
                            @blur="$v.asthma.asthmaSeverity.$touch()"
                            >
                            <v-btn depressed x-large color="primary--text darken-1" value="Mild Intermittent">Mild Intermittent</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="Mild Persistent">Mild Persistent</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="Moderate Persistent">Moderate Persistent</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="Severe Persistent">Severe Persistent</v-btn>
                            </v-btn-toggle>
                        </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- Adrenaline -->
                <v-card v-if="showAdrenaline">
                    <v-card-title class="primary lighten-1 white--text">Adrenaline Pen Treatment</v-card-title>
                    <v-card-text>
                        <v-row>
                        <v-col cols="12" md="12" lg="12">
                        <v-subheader class="overline ml-n5">Have You Been Diagnosed With An Anaphylactic Allergy?</v-subheader>
                        <v-btn-toggle
                            v-model="adrenaline.adrenalineDiagnosis" 
                            color="primary" 
                            group 
                            :error-messages="adrenalineDiagnosisError"
                            @click="$v.adrenaline.adrenalineDiagnosis.$touch()"
                            @blur="$v.adrenaline.adrenalineDiagnosis.$touch()"
                            >
                            <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                        </v-btn-toggle>
                        </v-col>
                        <v-col cols="12" md="12" lg="12">
                        <v-subheader class="overline ml-n5">Are You Trained To Use An Adrenaline Pen?</v-subheader>
                        <v-btn-toggle
                            v-model="adrenaline.adrenalinetrained" 
                            color="primary" 
                            group 
                            :error-messages="adrenalinetrainedError"
                            @click="$v.adrenaline.adrenalinetrained.$touch()"
                            @blur="$v.adrenaline.adrenalinetrained.$touch()"
                            >
                            <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                        </v-btn-toggle>
                        </v-col>
                        <v-col cols="12" md="12" lg="12">
                        <v-subheader class="overline ml-n5">Are You Aware Of The Potential Symptoms of An Anaphylactic Reaction?</v-subheader>
                        <v-btn-toggle
                            v-model="adrenaline.adrenalinesymptoms" 
                            color="primary" 
                            group 
                            :error-messages="adrenalineSymptomsError"
                            @click="$v.adrenaline.adrenalinesymptoms.$touch()"
                            @blur="$v.adrenaline.adrenalinesymptoms.$touch()"
                            >
                            <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                        </v-btn-toggle>
                        </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- Contraception -->
                <v-card v-if="showContraception">
                    <v-card-title class="primary lighten-1 white--text">Contraception Pill & Patch</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Choose a contraceptive</v-subheader>
                                <v-select
                                label="Contraceptive Type"
                                v-model="contraceptives.contraceptiveType"
                                :items="contraceptiveList"
                                outlined
                                :error-messages="contraceptiveTypeError"
                                @input="$v.contraceptives.contraceptiveType.$touch()"
                                @blur="$v.contraceptives.contraceptiveType.$touch()"
                                >
                                </v-select>   
                            </v-col>
                            <v-col cols="6" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Regulated Periods?</v-subheader>
                                <v-btn-toggle
                                    v-model="contraceptives.periodsRegular" 
                                    color="primary" 
                                    group 
                                    :error-messages="periodsRegularError"
                                    @click="$v.contraceptives.periodsRegular.$touch()"
                                    @blur="$v.contraceptives.periodsRegular.$touch()"
                                    >
                                    <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                                    <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="6" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Previous Usage?</v-subheader>
                                <v-btn-toggle
                                    v-model="contraceptives.previoulyTaken" 
                                    color="primary" 
                                    group 
                                    :error-messages="previoulyTakenError"
                                    @input="$v.contraceptives.previoulyTaken.$touch()"
                                    @blur="$v.contraceptives.previoulyTaken.$touch()"
                                    >
                                    <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                                    <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="6" md="6" lg="6">
                                <v-subheader class="overline ml-n5">Any Side Effects?</v-subheader>
                                <v-btn-toggle
                                    v-model="contraceptives.sideEffects" 
                                    color="primary" 
                                    group 
                                    :error-messages="sideEffectsError"
                                    @input="$v.contraceptives.sideEffects.$touch()"
                                    @blur="$v.contraceptives.sideEffects.$touch()"
                                    >
                                    <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                                    <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="12" md="6" lg="6">
                                <v-textarea
                                label="Describe side effects"
                                v-model="contraceptives.sideEffectDescription"
                                outlined
                                :error-messages="sideEffectDescriptionError"
                                @input="$v.contraceptives.sideEffectDescription.$touch()"
                                @blur="$v.contraceptives.sideEffectDescription.$touch()"
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- Thrush -->
                <v-card v-if="showThrush">
                    <v-card-title class="primary lighten-1 white--text">Thrush Treatment</v-card-title>
                    <v-card-text>
                        <v-row>
                        <v-col cols="12" md="12" lg="12">
                        <v-subheader class="overline ml-n5">Have You Had Any Severe Lower Abdominal Pain In The Past 48 Hours?</v-subheader>
                        <v-btn-toggle
                            v-model="thrush.thrushAbdoPain" 
                            color="primary" 
                            group 
                            :error-messages="thrushAbdoPainError"
                            @click="$v.thrush.thrushAbdoPain.$touch()"
                            @blur="$v.thrush.thrushAbdoPain.$touch()"
                            >
                            <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                        </v-btn-toggle>
                        </v-col>
                        <v-col cols="12" md="12" lg="12">
                        <v-subheader class="overline ml-n5">Are There Any Blisters Or Rashes On Or Around The Vaginal Skin?</v-subheader>
                        <v-btn-toggle
                            v-model="thrush.thrushSkinIssues" 
                            color="primary" 
                            group 
                            :error-messages="thrushSkinIssuesError"
                            @click="$v.thrush.thrushSkinIssues.$touch()"
                            @blur="$v.thrush.thrushSkinIssues.$touch()"
                            >
                            <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                        </v-btn-toggle>
                        </v-col>
                        <v-col cols="12" md="12" lg="12">
                        <v-subheader class="overline ml-n5">Are There Any Blisters Or Rashes On Or Around The Vaginal Skin?</v-subheader>
                        <v-btn-toggle
                            v-model="thrush.thrushUrinary" 
                            color="primary" 
                            group 
                            :error-messages="thrushUrinaryError"
                            @click="$v.thrush.thrushUrinary.$touch()"
                            @blur="$v.thrush.thrushUrinary.$touch()"
                            >
                            <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                            <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                        </v-btn-toggle>
                        </v-col>

                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- ErecDys -->
                <v-card v-if="showErecDys">
                    <v-card-title class="primary lighten-1 white--text">Erectile Dysfunction Treatment</v-card-title>
                    <v-card-text>
                        <v-row>
                        <v-col cols="12" md="6" lg="6">
                            <v-subheader class="overline ml-n5">Choose a EDT Type</v-subheader>
                            <v-select
                            label="Treatment Type"
                            v-model="ereDys.ereDysType"
                            :items="ereDysList"
                            outlined
                            :error-messages="ereDysTypeError"
                            @input="$v.ereDys.ereDysType.$touch()"
                            @blur="$v.ereDys.ereDysType.$touch()"
                            >
                            </v-select>   
                        </v-col>
                        <v-col cols="12" md="6" lg="6">
                            <v-subheader class="overline ml-n5">Select A Dosage</v-subheader>
                            <v-select
                            label="Treatment Type"
                            v-model="ereDys.ereDysDosage"
                            :items="ereDysDosageList"
                            outlined
                            :error-messages="ereDysDosageError"
                            @input="$v.ereDys.ereDysDosage.$touch()"
                            @blur="$v.ereDys.ereDysDosage.$touch()"
                            >
                            </v-select>   
                        </v-col>
                        <v-col cols="6" md="6" lg="6">
                            <v-subheader class="overline ml-n5">Previous Usage?</v-subheader>
                            <v-btn-toggle
                                v-model="ereDys.ereDysPrevious" 
                                color="primary" 
                                group 
                                :error-messages="ereDysPreviousError"
                                @click="$v.ereDys.ereDysPrevious.$touch()"
                                @blur="$v.ereDys.ereDysPrevious.$touch()"
                                >
                                <v-btn depressed x-large color="primary--text darken-1" value="Yes">Yes</v-btn>
                                <v-btn depressed x-large color="primary--text darken-1" value="No">No</v-btn>
                            </v-btn-toggle>
                        </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <!-- PreEj -->
                <v-card v-if="showPreE">
                    <v-card-title class="primary lighten-1 white--text">Premature Ejaculation Treatment</v-card-title>
                    <v-card-text>
                        <v-row>
                        <v-col cols="12" md="6" lg="6">
                        <v-subheader class="overline ml-n5">How Long Have You Been Suffering From PE?</v-subheader>
                        <v-select
                        label="Duration of Suffering"
                        v-model="pe.peDuration"
                        :items="peDurationList"
                        outlined
                        :error-messages="peDurationError"
                        @input="$v.pe.peDuration.$touch()"
                        @blur="$v.pe.peDuration.$touch()"
                        >
                        </v-select>   
                        </v-col>
                        <v-col cols="12" md="6" lg="6">
                        <v-subheader class="overline ml-n5">How Often Do You Experience PE?</v-subheader>
                        <v-select
                        label="How Often"
                        v-model="pe.peOften"
                        :items="peOftenList"
                        outlined
                        :error-messages="peOftenError"
                        @input="$v.pe.peOften.$touch()"
                        @blur="$v.pe.peOften.$touch()"
                        >
                        </v-select>   
                        </v-col>
                        <v-col cols="12" md="6" lg="6">
                        <v-subheader class="overline ml-n5">When Does PE Occur?</v-subheader>
                        <v-select
                        label="Occurence"
                        v-model="pe.peOccur"
                        :items="peOccurList"
                        outlined
                        :error-messages="peOccurError"
                        @input="$v.pe.peOccur.$touch()"
                        @blur="$v.pe.peOccur.$touch()"
                        >
                        </v-select>   
                        </v-col>
                        <v-col cols="6" md="6" lg="6">
                            <v-subheader class="overline ml-n5">Choose A Medication</v-subheader>
                            <v-btn-toggle
                                v-model="pe.medication" 
                                color="primary" 
                                group 
                                :error-messages="medicationError"
                                @input="$v.pe.medication.$touch()"
                                @blur="$v.pe.medication.$touch()"
                                >
                                <v-btn depressed x-large color="primary--text darken-1" value="EMLA">EMLA</v-btn>
                                <v-btn depressed x-large color="primary--text darken-1" value="PRILIGY">PRILIGY</v-btn>
                            </v-btn-toggle>
                        </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        
           


          </v-row>
          <v-card-actions>
          <v-row>
              <v-btn 
              v-if="requestBtn"
              type="submit"
              block class="primary white--text"
              @click.prevent="requestPrescription()">
              <span>Request Prescription</span>
              </v-btn>
                <v-snackbar
                  :color="color"
                  v-model="snackbar"
                  :timeout="timeout"
                  :multi-line="multiLine"
                >{{ snackbarText }}
                </v-snackbar>
          </v-row>
          </v-card-actions>
        </v-card-text>
        </v-form>
        </v-card> <!-- End of book appointment form within dialog --> 
      </v-dialog> 







    </v-col></v-row>
</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import ViewPrescriptions from '../components/Prescriptions/ViewPrescriptions'
import { auth, db } from '../firebase'

import { required } from "vuelidate/lib/validators"
export default {
    components: {
        Navbar,
        ViewPrescriptions,
    },
    computed: {
        // CONTRACEPTION
        contraceptiveTypeError () {
            const errors = []
            if(!this.$v.contraceptives.contraceptiveType.$dirty) return errors
                !this.$v.contraceptives.contraceptiveType.required && errors.push('Please Select A Contraceptive Type')
            return errors
        },
        periodsRegularError () {
            const errors = []
            if(!this.$v.contraceptives.periodsRegular.$dirty) return errors
                !this.$v.contraceptives.periodsRegular.required && errors.push('A Value Is Required')
            return errors
        },
        previoulyTakenError () {
            const errors = []
            if(!this.$v.contraceptives.previoulyTaken.$dirty) return errors
                !this.$v.contraceptives.previoulyTaken.required && errors.push('A Value Is Required')
            return errors
        },
        sideEffectsError () {
            const errors = []
            if(!this.$v.contraceptives.sideEffects.$dirty) return errors
                !this.$v.contraceptives.sideEffects.required && errors.push('A Value Is Required')
            return errors
        },
        sideEffectDescriptionError () {
            const errors = []
            if(!this.$v.contraceptives.sideEffectDescription.$dirty) return errors
                !this.$v.contraceptives.sideEffectDescription.required && errors.push('A Value Is Required')
            return errors
        },

        // EREDYS
        ereDysTypeError () {
            const errors = []
            if(!this.$v.ereDys.ereDysType.$dirty) return errors
                !this.$v.ereDys.ereDysType.required && errors.push('Please Select A Form Of Treatment')
            return errors
        },
        ereDysDosageError () {
            const errors = []
            if(!this.$v.ereDys.ereDysDosage.$dirty) return errors
                !this.$v.ereDys.ereDysDosage.required && errors.push('Dosage Is Required')
            return errors
        },
        ereDysPreviousError () {
            const errors = []
            if(!this.$v.ereDys.ereDysPrevious.$dirty) return errors
                !this.$v.ereDys.ereDysPrevious.required && errors.push('A Value Is Required')
            return errors
        },

        // Asthma
        asthmaLengthError () {
            const errors = []
            if(!this.$v.asthma.asthmaLength.$dirty) return errors
                !this.$v.asthma.asthmaLength.required && errors.push('Time With Asthma Is Required')
            return errors
        },
        asthmaSteroidsError () {
            const errors = []
            if(!this.$v.asthma.asthmaSteroids.$dirty) return errors
                !this.$v.asthma.asthmaSteroids.required && errors.push('Any Steroids Is Required')
            return errors
        },
        asthmaSeverityError () {
            const errors = []
            if(!this.$v.asthma.asthmaSeverity.$dirty) return errors
                !this.$v.asthma.asthmaSeverity.required && errors.push('Asthma Severity Is Required')
            return errors
        },

        // Adrenaline
        adrenalineDiagnosisError () {
            const errors = []
            if(!this.$v.adrenaline.adrenalineDiagnosis.$dirty) return errors
                !this.$v.adrenaline.adrenalineDiagnosis.required && errors.push('Adrenaline Diagnosis Is Required')
            return errors
        },
        adrenalinetrainedError () {
            const errors = []
            if(!this.$v.adrenaline.adrenalinetrained.$dirty) return errors
                !this.$v.adrenaline.adrenalinetrained.required && errors.push('Adrenaline Trained Is Required')
            return errors
        },
        adrenalineSymptomsError () {
            const errors = []
            if(!this.$v.adrenaline.adrenalinesymptoms.$dirty) return errors
                !this.$v.adrenaline.adrenalinesymptoms.required && errors.push('Adrenaline Symptoms Are Required')
            return errors
        },

        // PE 
        peDurationError () {
            const errors = []
            if(!this.$v.pe.peDuration.$dirty) return errors
                !this.$v.pe.peDuration.required && errors.push('PE Duration Is Required')
            return errors
        },
        peOftenError () {
            const errors = []
            if(!this.$v.pe.peOften.$dirty) return errors
                !this.$v.pe.peOften.required && errors.push('How Often Is Required')
            return errors
        },
        peOccurError () {
            const errors = []
            if(!this.$v.pe.peOccur.$dirty) return errors
                !this.$v.pe.peOccur.required && errors.push('PE Occurence Is Required')
            return errors
        },
        medicationError () {
            const errors = []
            if(!this.$v.pe.medication.$dirty) return errors
                !this.$v.pe.medication.required && errors.push('PE Medication Is Required')
            return errors
        },

        // Thrush
        thrushAbdoPainError () {
            const errors = []
            if(!this.$v.thrush.thrushAbdoPain.$dirty) return errors
                !this.$v.thrush.thrushAbdoPain.required && errors.push('Thrush Abdominal Pain Confirmation Is Required')
            return errors
        },
        thrushSkinIssuesError () {
            const errors = []
            if(!this.$v.thrush.thrushSkinIssues.$dirty) return errors
                !this.$v.thrush.thrushSkinIssues.required && errors.push('Skin Condition Confirmation Is Required')
            return errors
        },
        thrushUrinaryError () {
            const errors = []
            if(!this.$v.thrush.thrushUrinary.$dirty) return errors
                !this.$v.thrush.thrushUrinary.required && errors.push('Urinary Condition Confirmation Is Required')
            return errors
        },


    },
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
        this.setGenderOption ()
    },
    data() {
        return {
            // Snackbar properties
            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",
            dialog: false, // Dialog for overall dialog panel

            noGenderView: false, // Show if no gender is defined
            genderOption: null,
            requestBtn: false,
            showFemaleT: false,
            showMaleT: false,
            status: "Pending Review",
            chosenOption: null,
            femaleTreatments: [
                { text: 'Adrenaline Pen Treatment', value: 'Adrenaline Pen Treatment'},
                { text: 'Asthma Treatment', value: 'Asthma Treatment'},
                { text:'Contraceptive Pill & Patch', value: 'Contraception' },
                { text:'Thrush Treatment', value: 'Thrush Treatment' },    
            ],
            maleTreatments: [
                { text: 'Adrenaline Pen Treatment', value: 'Adrenaline Pen Treatment'},
                { text: 'Asthma Treatment', value: 'Asthma Treatment'},
                { text: 'Erectile Dysfunction Treatment', value: 'Erectile Dysfunction Treatment' },
                { text: 'Premature Ejaculation Treatment', value: 'Premature Ejaculation Treatment' },
            ],


 
            // Showing different treatments
            showAdrenaline: false,
            showAsthma: false,
            showContraception: false,
            showThrush: false,
            showErecDys: false,
            showPreE: false,

            // Contraception Card
            contraceptives: {
                contraceptiveType: null,
                periodsRegular: null,
                previoulyTaken: null,
                sideEffects: null,
                sideEffectDescription: null,
            },
            contraceptiveList: [
                {text: 'Azalia', value: "Azalia" },
                {text: 'Cerazette', value: "Cerazette" },
                {text: 'Cilest', value: "Cilest" },
                {text: 'Elvina', value: "Elvina" },
                {text: 'Elvinette', value: "Elvinette" },
                {text: 'Evra Patches', value: "Evra Patches" },
                {text: 'Freedonel', value: "Freedonel" },
                {text: 'Leonore', value: "Leonore" },
                {text: 'Microlite', value: "Microlite" },
                {text: 'Yasmin', value: "Yasmin" },
                {text: 'Zoely ', value: "Zoely " },
            ],

            // EreDys
            ereDys: {
                ereDysType: null,
                ereDysDosage: null,
                ereDysPrevious: null,
            },
            ereDysList: [
                {text: 'Viagra', value: 'Viagra'},
                {text: 'Sildenafil', value: 'Sildenafil'},
                {text: 'Cialis', value: 'Cialis'},
                {text: 'Levitra', value: 'Levitra'},
            ],
            ereDysDosageList: [
                {text: '2.5 MG', value: '2.5 MG'},
                {text: '5 MG', value: '5 MG'},
                {text: '25 MG', value: '25 MG'},
                {text: '50 MG', value: '50 MG'},
                {text: '100 MG', value: '100 MG'},
                {text: 'Unsure', value: 'Unsure'},
            ],

            asthma: {
                asthmaLength: null,
                asthmaSteroids: null,
                asthmaSeverity: null,
            },
            asthmaLengthList: [
                {text:'Less Than 6 Months', value:'Less Than 6 Months'},
                {text:'Over A Year', value:'Over A Year'},
                {text:'Over 5 Years', value:'Over 5 Years'},
                {text:'Since Birth', value:'Since Birth'}
            ],
            asthmaSteroidList: [
                {text:'Never', value: 'Never'},
                {text:'In The Last 6 Months', value: 'In The Last 6 Months'},
                {text:'In The Last 12 Months', value: 'In The Last 12 Months'},
                {text:'Over A Year Ago', value: 'Over A Year Ago'},
            ],
            adrenaline: {
                adrenalineDiagnosis: null,
                adrenalinetrained: null,
                adrenalinesymptoms: null,
            },

            pe: {
                peDuration: null,
                peOften: null,
                peOccur: null,
                medication: null,
            },
            peDurationList: [
                {text: 'Less Than 3 Months', valude: 'Less Than 3 Months'},
                {text: 'Less Than 6 Months', valude: 'Less Than 6 Months'},
                {text: 'Less Than 1 Year', valude: 'Less Than 1 Year'},
                {text: 'Longer Than 5 Years', valude: 'Longer Than 5 Years'},
                {text: 'Indefinetly', valude: 'Indefinetly'},
            ],
            peOftenList: [
                {text: 'During Sex', value: 'During Sex'},
                {text: 'Only With New Partner', value: 'During Sex With New Partner'},
            ],
            peOccurList: [
                {text: 'During Foreplay', value: 'During Foreplay'},
                {text: 'While Attempting Penetration', value: 'While Attempting Penetration'},
                {text: 'Just After Penetration', value: 'Just After Penetration'},
                {text: 'Less Than 2 Minutes After Penetration', value: 'Less Than 2 Minutes After Penetration'},
                {text: 'More Than 2 Minutes After Penetration', value: 'More Than 2 Minutes After Penetration'},
 
            ],

            thrush: {
               thrushAbdoPain: null, 
               thrushSkinIssues: null,
               thrushUrinary: null,
            },
        }
    },
    validations: {
        contraceptives: {
            contraceptiveType: { required },
            periodsRegular: { required },
            previoulyTaken: { required },
            sideEffects: { required },
            sideEffectDescription: { required },
        },
        ereDys: {
            ereDysType: { required },
            ereDysDosage: { required },
            ereDysPrevious: { required },
        },
        asthma: {
            asthmaLength: { required },
            asthmaSteroids: { required },
            asthmaSeverity: { required },
        },
        adrenaline: {
            adrenalineDiagnosis: { required },
            adrenalinetrained: { required },
            adrenalinesymptoms: { required },
        },
        pe: {
            peDuration: { required },
            peOften: { required },
            peOccur: { required },
            medication: { required },
        },
        thrush: {
            thrushAbdoPain: { required },
            thrushSkinIssues: { required}, 
            thrushUrinary: { required },
        },

    },
    methods: {
        // Triggers the snackbar with the passed message and colour of the message
        triggerSnackbar (message, color) {
            this.snackbarText = message,
            this.color = color,
            this.snackbar = true
        },
        setGenderOption () {
            db.collection("users").doc(this.currentUser).get().then(( snap => {
                this.genderOption = snap.data().gender // Return the gender of the patient

                if(this.genderOption == 'Male'){
                this.hideAllTreatments()
                this.requestBtn = true
                this.showFemaleT = false
                this.showMaleT = true
                this.chosenOption = null
                }
                else if  (this.genderOption == 'Female'){
                    this.requestBtn = true
                    this.hideAllTreatments()
                    this.showMaleT= false
                    this.showFemaleT = true
                    this.chosenOption = null
                }
                else{
                    // No gender defined
                    this.requestBtn = false
                    this.noGenderView = true
                }

            }))
        

        },
        hideAllTreatments () {
            this.showAdrenaline = false,
            this.showAsthma = false,
            this.showContraception = false,
            this.showThrush = false,
            this.showErecDys = false,
            this.showPreE = false
        },
        setTreatmentOption () {
            if (this.chosenOption == 'Adrenaline Pen Treatment'){
                this.hideAllTreatments()
                this.showAdrenaline = true
            }
            else if(this.chosenOption == 'Asthma Treatment'){
                this.hideAllTreatments()
                this.showAsthma = true
            }
            else if(this.chosenOption == 'Contraception'){
                this.hideAllTreatments()
                this.showContraception = true
            }
            else if(this.chosenOption == 'Thrush Treatment'){
                this.hideAllTreatments()
                this.showThrush = true
            }
            else if(this.chosenOption == 'Erectile Dysfunction Treatment'){
                this.hideAllTreatments()
                this.showErecDys = true
            }
            else if(this.chosenOption == 'Premature Ejaculation Treatment'){
                this.hideAllTreatments()
                this.showPreE = true
            }
            else{
                this.hideAllTreatments()
                console.log("error selecting treatment!")
            }
        },
        // Append a 0 to month or date of number is less than or equals 9 to match to appointmentDates
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
        // Cancel the page
        cancel () {
            // this.$v.$reset()
            this.dialog = false
            this.hideAllTreatments()
            this.clearForms()
            this.chosenOption = null
            this.genderOption = null
            this.snackbar = null
        },
        clearForms () {
            this.$v.$reset()
            // Clear contraceptive
            this.contraceptives.contraceptiveType = null
            this.contraceptives.periodsRegular = null
            this.contraceptives.previoulyTaken = null
            this.contraceptives.sideEffects = null
            this.contraceptives.sideEffectDescription = null
            // Clear EDT
            this.ereDys.ereDysType = null
            this.ereDys.ereDysDosage = null
            this.ereDys.ereDysPrevious = null
            // Clear Asthma
            this.asthma.asthmaLength = null
            this.asthma.asthmaSteroids = null
            this.asthma.asthmaSeverity = null
            // Clear Adrenaline
            this.adrenaline.adrenalineDiagnosis = null
            this.adrenaline.adrenalinetrained = null
            this.adrenaline.adrenalinesymptoms = null
            // Clear PE
            this.pe.peDuration = null
            this.pe.peOften = null
            this.pe.peOccur = null
            this.pe.medication = null
            // Clear Thrush
            this.thrush.thrushAbdoPain = null
            this.thrush.thrushSkinIssues = null,
            this.thrush.thrushUrinary = null
        },
        // Submit request form
        requestPrescription () {
            if (this.chosenOption == 'Adrenaline Pen Treatment'){
                this.$v.$touch() // used to check the state of the form fields
                this.formTouched = !this.$v.adrenaline.$anyDirty
                this.errors = this.$v.adrenaline.$anyError
                // If the form does not have any errors or each individual field has no invalid data 
                if (this.errors === false && this.formTouched === false){      
                    let addPrescription ={
                        patientID: this.currentUser,
                        dateRequested: this.getTodaysDate(),
                        chosenType: this.chosenOption,
                        status: this.status,
                        adrenalineDiagnosis: this.adrenaline.adrenalineDiagnosis,
                        trained: this.adrenaline.adrenalinetrained,
                        recogniseSymptoms: this.adrenaline.adrenalinesymptoms,
                     
                    }
                db.collection("prescriptions").doc().set(addPrescription).then(()=>{
                    this.triggerSnackbar("Request Has Been Submitted", "success")
                    this.clearForms()
                    this.hideAllTreatments()
                }).catch(error => {
                    console.log("Prescription Error ", error)
                    this.triggerSnackbar("There Were Errors With The Form!", "error")
                })   
                }
                else{
                    this.triggerSnackbar("Could Not Submit Precription Request, Missing Form Data!", "error")
                }
            }
            else if(this.chosenOption == 'Asthma Treatment'){
                this.$v.$touch() // used to check the state of the form fields
                this.formTouched = !this.$v.asthma.$anyDirty
                this.errors = this.$v.asthma.$anyError
                // If the form does not have any errors or each individual field has no invalid data 
                if (this.errors === false && this.formTouched === false){      
                    let addPrescription ={
                        patientID: this.currentUser,
                        dateRequested: this.getTodaysDate(),
                        chosenType: this.chosenOption,
                        status: this.status,
                        asthmaLength: this.asthma.asthmaLength,
                        anySteroids: this.asthma.asthmaSteroids,
                        asthmaSeverity: this.asthma.asthmaSeverity,
                    }
                db.collection("prescriptions").doc().set(addPrescription).then(()=>{
                    this.triggerSnackbar("Request Has Been Submitted", "success")
                    this.clearForms()
                    this.hideAllTreatments()
                }).catch(error => {
                    console.log("Prescription Error ", error)
                    this.triggerSnackbar("There Were Errors With The Form!", "error")
                })   
                }
                else{
                    this.triggerSnackbar("Could Not Submit Precription Request, Missing Form Data!", "error")
                } 
            }
            else if(this.chosenOption == 'Contraception'){
                this.$v.$touch() // used to check the state of the form fields
                this.formTouched = !this.$v.contraceptives.$anyDirty
                this.errors = this.$v.contraceptives.$anyError

                // If the form does not have any errors or each individual field has no invalid data 
                if (this.errors === false && this.formTouched === false){      
                    let addPrescription ={
                        patientID: this.currentUser,
                        dateRequested: this.getTodaysDate(),
                        chosenType: this.chosenOption,
                        status: this.status,
                        contraception: this.contraceptives.contraceptiveType,
                        periodRegulation: this.contraceptives.periodsRegular,
                        previousUsage: this.contraceptives.previoulyTaken,
                        sideEffects: this.contraceptives.sideEffects,
                        effectsDescription: this.contraceptives.sideEffectDescription,
                    }
                db.collection("prescriptions").doc().set(addPrescription).then(()=>{
                    this.triggerSnackbar("Request Has Been Submitted", "success")
                    this.clearForms()
                    this.hideAllTreatments()
                }).catch(error => {
                    console.log("Prescription Error ", error)
                    this.triggerSnackbar("There Were Errors With The Form!", "error")
                })   
                }
                else{
                    this.triggerSnackbar("Could Not Submit Precription Request, Missing Form Data!", "error")
                } 
            }
            else if(this.chosenOption == 'Thrush Treatment'){
                this.$v.$touch() // used to check the state of the form fields
                this.formTouched = !this.$v.thrush.$anyDirty
                this.errors = this.$v.thrush.$anyError
                // If the form does not have any errors or each individual field has no invalid data 
                if (this.errors === false && this.formTouched === false){      
                    let addPrescription ={
                        patientID: this.currentUser,
                        dateRequested: this.getTodaysDate(),
                        chosenType: this.chosenOption,
                        status: this.status,
                        abdominalPain: this.thrush.thrushAbdoPain,
                        skinIssues: this.thrush.thrushSkinIssues,
                        urinaryIssue: this.thrush.thrushUrinary,
                    }
                    db.collection("prescriptions").doc().set(addPrescription).then(()=>{
                        this.triggerSnackbar("Request Has Been Submitted", "success")
                        this.clearForms()
                        this.hideAllTreatments()
                    }).catch(error => {
                        console.log("Prescription Error ", error)
                        this.triggerSnackbar("There Were Errors With The Form!", "error")
                    })   
                }
                else{
                    this.triggerSnackbar("Could Not Submit Precription Request, Missing Form Data!", "error")
                } 
              
            }
            else if(this.chosenOption == 'Erectile Dysfunction Treatment'){
                this.$v.$touch() // used to check the state of the form fields
                this.formTouched = !this.$v.ereDys.$anyDirty
                this.errors = this.$v.ereDys.$anyError
                // If the form does not have any errors or each individual field has no invalid data 
                if (this.errors === false && this.formTouched === false){
                    let addPrescription = {
                        patientID: this.currentUser,
                        dateRequested: this.getTodaysDate(),
                        chosenType: this.chosenOption,
                        status: this.status,
                        eDTreatment: this.ereDys.ereDysType,
                        dosage: this.ereDys.ereDysDosage,
                        previousUsage: this.ereDys.ereDysPrevious,
                    }
                    db.collection("prescriptions").doc().set(addPrescription).then(()=>{
                    this.triggerSnackbar("Request Has Been Submitted", "success")
                    this.clearForms()
                    this.hideAllTreatments()
                    }).catch(error => {
                        console.log("Prescription Error ", error)
                        this.triggerSnackbar("There Were Errors With The Form!", "error")
                    })   
                }
                else{
                    this.triggerSnackbar("Could Not Submit Precription Request, Missing Form Data!", "error")
                } 

            }
            else if(this.chosenOption == 'Premature Ejaculation Treatment'){
                this.$v.$touch() // used to check the state of the form fields
                this.formTouched = !this.$v.pe.$anyDirty
                this.errors = this.$v.pe.$anyError
                // If the form does not have any errors or each individual field has no invalid data 
                if (this.errors === false && this.formTouched === false){      
                    let addPrescription ={
                        patientID: this.currentUser,
                        dateRequested: this.getTodaysDate(),
                        chosenType: this.chosenOption,
                        status: this.status,
                        durationWith: this.pe.peDuration,
                        howOften: this.pe.peOften,
                        occurs: this.pe.peOccur,
                        medication: this.pe.medication,
                    }
                db.collection("prescriptions").doc().set(addPrescription).then(()=>{
                    this.triggerSnackbar("Request Has Been Submitted", "success")
                    this.clearForms()
                    this.hideAllTreatments()
                }).catch(error => {
                    console.log("Prescription Error ", error)
                    this.triggerSnackbar("There Were Errors With The Form!", "error")
                })   
                }
                else{
                    this.triggerSnackbar("Could Not Submit Precription Request, Missing Form Data!", "error")
                }
               
            }
            else{
                this.hideAllTreatments()
                this.clearForms()
                this.triggerSnackbar("You Must Select A Treatment!", "error")
            }
        },
    },
    
}
</script>