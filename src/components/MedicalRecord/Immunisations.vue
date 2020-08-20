<template>
   <v-col cols="12" md="12" lg="12">
    <v-card flat>
       <v-dialog v-model="dialogimmunisation" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }"> 
        <v-card flat>
            <v-card-title class="overline">
                <v-spacer></v-spacer>
                <v-btn 
                small
                v-bind="attrs"
                v-on="on"
                ><v-icon>mdi-plus</v-icon>
                Add immunisation
                </v-btn>
            </v-card-title>
            </v-card>
        </template>
            <v-card>
            <v-form @submit.prevent="saveImmunisation()">
            <v-card-title class="primary lighten-1 white--text">Immunisation
            <v-spacer></v-spacer>
                <v-btn class="mr-6" icon dark @click="cancelImmunisation()"> 
                <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
                <span>Cancel</span>
                </v-btn>
            </v-card-title>
                <v-card-text>
                <v-container>
                    <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete
                        label="Search Immunisations*"
                        v-model="immunisationForm.selectedImmunisation"
                        :loading="loading"
                        :items="immunisations"
                        item-text="name"
                        item-value="value"
                        outlined
                        :error-messages="selectedImmunisationErrors"
                        @input="$v.immunisationForm.selectedImmunisation.$touch()"
                        @blur="$v.immunisationForm.selectedImmunisation.$touch()"
                        ></v-autocomplete>
       
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        max-width="290"
                        >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        label="Select Date*"
                        readonly
                        :value="immunisationForm.immunisationDate"
                        v-bind="attrs"
                        v-on="on"
                        required
                        outlined
                        :error-messages="immunisationDateErrors"
                        @input="$v.immunisationForm.immunisationDate.$touch()"
                        @blur="$v.immunisationForm.immunisationDate.$touch()"
                        @click:clear="immunisationForm.immunisationDate = null"
                        
                        ></v-text-field>
                        </template>
                        <v-date-picker 
                        full-width
                        scrollable
                        show-current
                        v-model="immunisationForm.immunisationDate" 
                        @input="menu = false"
                    
                        >
                        </v-date-picker>
                        </v-menu>
                    </v-col>

                    </v-row>
                </v-container>
                </v-card-text>
                <v-card-actions>
                <v-col cols="12">
                    <v-btn
                    type="submit"
                    block class="primary white--text"
                    @click.prevent="saveImmunisation()">
                    <span>Add Immunisation</span>
                    </v-btn>
                </v-col>  
                </v-card-actions>
            </v-form>
                <v-snackbar 
                :color= "color"
                v-model="snackbar" 
                :timeout="timeout" 
                :multi-line="multiLine"
                > {{ snackbarText }} 
                </v-snackbar>
            </v-card>
        </v-dialog>
        </v-card>
    </v-col>
</template>

<script>
import {auth, db, fieldValue} from '../../firebase'
import { required } from 'vuelidate/lib/validators'

export default {
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
    },
    computed: {
        selectedImmunisationErrors () {
        const errors = []
        if(!this.$v.immunisationForm.selectedImmunisation.$dirty) return errors
            !this.$v.immunisationForm.selectedImmunisation.required && errors.push('Select An Immunisation')
        return errors
        },
        immunisationDateErrors () {
        const errors = []
        if(!this.$v.immunisationForm.immunisationDate.$dirty) return errors
            !this.$v.immunisationForm.immunisationDate.required && errors.push('Select Date Of Immunisation')
        return errors
        },
    },
    data() {
        return {
            dialogimmunisation: false,
            menu: false,

            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",

            loading: false,
            items: [],
            search: null,
            selectedImmunisation: null,
          
            immunisations: [
                { name: 'Influenza inactivated', abbr: 'IIV', value: 'Influenza inactivated' },
                { name: 'Influenza recombinant', abbr: 'RIV', value: 'Influenza recombinant' },
                { name: 'Influenza live attenuated', abbr: 'LAIV', value: 'Influenza live attenuated' },
                { name: 'Tetanus, diphtheria, pertussis', abbr: 'Tdap', value: 'Tetanus, diphtheria, pertussis' },
                { name: 'Measles, mumps, rubella', abbr: 'MMR', value: 'Measles, mumps, rubella' },
                { name: 'Varicella', abbr: 'VAR', value: 'Varicella' },
                { name: 'Zoster recombinant', abbr: 'RZV', value: 'Zoster recombinant' },
                { name: 'Zoster live', abbr: 'ZVL', value: 'Zoster live' },
                { name: 'Human papillomavirus', abbr: 'HPV', value: 'Human papillomavirus' },
                { name: 'Pneumococcal conjugate', abbr: 'PCV13', value: 'Pneumococcal conjugate' },
                { name: 'Pneumococcal polysaccharide', abbr: 'PPSV23', value: 'Pneumococcal polysaccharide' },
                { name: 'Hepatitis A', abbr: 'HepA', value: 'Hepatitis A' },
                { name: 'Hepatitis B', abbr: 'HepB', value: 'Hepatitis B' },
                { name: 'Meningococcal A, C, W, Y', abbr: 'MenACWY', value: 'Meningococcal A, C, W, Y' },
                { name: 'Meningococcal B', abbr: 'MenB', value: 'Meningococcal B' },
                { name: 'Haemophilus influenzae type b', abbr: 'Hib', value: 'Haemophilus influenzae type b' },
            ],


            immunisationForm: {
                immunisationSelected: null,
                immunisationDate: null
            },


        }
    },
    validations: {
        immunisationForm: {
            selectedImmunisation: { required },
            immunisationDate: { required },
        }
    },
    methods: {  
      customFilter (item, queryText) {
        const textOne = item.name.toLowerCase()
        const textTwo = item.abbr.toLowerCase()
        const searchText = queryText.toLowerCase()

        return textOne.indexOf(searchText) > -1 ||
          textTwo.indexOf(searchText) > -1
      },
      triggerSnackbar (message, color) {
          this.snackbarText = message,
          this.color = color,
          this.snackbar = true
      },

        cancelImmunisation () {
            this.snackbar = false
            this.dialogimmunisation = false
            this.$v.$reset()
            this.immunisationForm.selectedImmunisation = null
            this.immunisationForm.immunisationDate = null
            
        },

      saveImmunisation () {
        this.$v.$touch()
        this.formTouched = !this.$v.immunisationForm.$anyDirty
        this.errors = this.$v.immunisationForm.$anyError

        if(this.errors === false && this.formTouched === false){
            var addImmunisation = {
                immunisationName: this.immunisationForm.selectedImmunisation,
                immunisationDate: this.immunisationForm.immunisationDate,
            }
            var immunisationRecord = {
                immunisation: fieldValue.arrayUnion(addImmunisation)
            }
            this.triggerSnackbar("Immunisation Was Successfully Added!", "success")
            db.collection("users").doc(this.currentUser).update(immunisationRecord).then(() => {
                this.$v.$reset()
                this.immunisationForm.selectedImmunisation = null
                this.immunisationForm.immunisationDate = null
            }).catch(error => {
                console.log(error)
            }).then(() => {
                this.dialogimmunisation = false
                this.snackbar = false
            })
        }else{
            this.triggerSnackbar("There Are Errors Preventing You From Submitting This Form", "error")
        }

      }
    },
}
</script>