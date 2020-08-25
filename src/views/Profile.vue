<template>
<v-container >
<Navbar />    
 
    <v-row>
        <!-- Left Card - Profile -->
        <v-col cols="12" s="12" sm="6" md="6" lg="6">
            <v-card width="800" >
    
            <div v-if="showEditForm">
                <v-card flat>   <!-- Full Name -->
                <v-card-title class="text-uppercase primary lighten-1 white--text">
                        Profile
                        <v-spacer></v-spacer>
                        <v-icon right class="white--text" @click="toggleEditProfile()">fa-edit</v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-row>
                    <v-col cols="12" md="4">
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="overline grey--text">Full Name</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-list-item>
                            <v-list-item-content>
                            <v-list-item-title class="subtitle-1">{{userProfile.firstname}} {{userProfile.surname}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    </v-card>
                    <v-card flat>  <!-- Date of Birth -->
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="overline grey--text">Date of Birth</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="subtitle-1">{{formattedDate}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    </v-card>

                    <v-card flat>  <!-- PPSN -->
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="overline grey--text">PPSN</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="subtitle-1">{{userProfile.ppsn}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    </v-card>

                    <v-card flat> <!-- EMAIL -->
                    <v-row>
                    <v-col cols="12" md="4">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="overline grey--text">Email</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="subtitle-1">{{userProfile.email}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                    </v-row> 
                    <v-divider></v-divider>
                    </v-card>

                    <v-card flat> <!-- MOBILE -->
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="overline grey--text">Mobile</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-list-item>
                                <v-list-item-content>
                                <v-list-item-title class="subtitle-1">{{userProfile.mobile}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-col>
                    </v-row> 
                    </v-card>
            </div>
    

            <!-- EDIT FORM -->
            <v-form v-else @submit.prevent="updateProfile">
                <v-card flat>
                <v-card-title class="text-uppercase primary lighten-1 white--text">Edit Profile
                <v-spacer></v-spacer>
                    <v-btn depressed color="primary lighten-1" @click="toggleEditProfile()">
                    <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
                    <span>Cancel</span>
                    </v-btn>
                </v-card-title>
                
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                    <v-col class="mt-n2" cols="12" md="6" lg="6">
                        <!-- Firstname Edit -->
                        <v-text-field 
                        type="text"
                        name="firstname"
                        label="First Name"
                        :counter="15" 
                        v-model.trim="firstname" 
                        :error-messages="firstNameErrors"
                        :placeholder="userProfile.firstname"
                        outlined
                        @input="$v.firstname.$touch()"
                        @blur="$v.firstname.$touch()"
                        >
                        </v-text-field>
                    </v-col>
                    <!-- Surname Edit -->
                    <v-col class="mt-n2" cols="12" md="6" lg="6">
                        <v-text-field 
                        type="text"
                        name="surname"
                        label="Surname"
                        :counter="15" 
                        v-model.trim="surname"
                        :error-messages="surnameErrors"
                        :placeholder="userProfile.surname"
                        outlined 
                        @input="$v.surname.$touch()"
                        @blur="$v.surname.$touch()"
                        >
                        </v-text-field>
                    </v-col>
                    <!-- DOB Edit -->
                    <v-col class="mt-n2" cols="12" md="4" lg="4">
                        <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        max-width="290"
                        >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        label="Date of Birth"
                        :value="formattedDate"
                        
                        :placeholder="userProfile.date"
                        clearable
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="date = null"
                        outlined
                        >
                        </v-text-field>
                        </template>
                        <v-date-picker
                        v-model.trim="date"
                        :min="getLowestPossible()"
                        :max="getEarliestPossible()"
                        @change="menu = false"  
                        >
                        </v-date-picker>
                        </v-menu>
                    </v-col>
                    <!-- PPSN Edit -->
                    <v-col class="mt-n2" cols="12" md="4" lg="4">
                        <v-text-field 
                        type="text"
                        name="ppsn"
                        label="PPSN"
                        hint="7 numerical characters, followed by either 1 or 2 letters E.g. 1234567RW"
                        v-model.trim="ppsn"
                        :error-messages="ppsnErrors"
                        :placeholder="userProfile.ppsn"
                        outlined
                        @input="$v.ppsn.$touch()"
                        @blur="$v.ppsn.$touch()"
                        >
                        </v-text-field>
                    </v-col>
                    <!-- Mobile Edit -->
                    <v-col class="mt-n2" cols="12" md="4" lg="4">
                        <v-text-field 
                        type="text"
                        name="mobile"
                        label="Mobile"
                        v-model.trim="mobile"
                        :error-messages="mobileErrors"
                        :placeholder="userProfile.mobile"
                        outlined
                        @input="$v.mobile.$touch()"
                        @blur="$v.mobile.$touch()" 
                        >
                        </v-text-field>
                    </v-col>                    
                    </v-row>
                    <v-card-actions>
                        <v-row>
                            <v-btn
                            type="button"
                            :disabled="loading"
                            block class="primary white--text"
                            @click.prevent="updateProfile()">
                            <span>Update</span>
                            </v-btn>
                        </v-row>
                    </v-card-actions>
                </v-card-text>  
                </v-card>
            </v-form>
            </v-card>

            <v-card width="585" height="140" class="mt-5">
                <v-card-title class="primary lighten-1 white--text">Application Theme</v-card-title>
                <v-card-text class="ml-15">
                    <v-row>
                        <v-col class="mt-n4">
                        <v-switch
                        v-model="$vuetify.theme.dark"
                        hide-details
                        inset
                        label="Dark Mode"
                        ></v-switch>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" s="12" sm="6" md="6" lg="6">
            <v-card width="600">
            <v-card-text>
                <CalendarAppointments />
            </v-card-text>
            </v-card>   

            </v-col>
    </v-row>  

</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import CalendarAppointments from '../components/PatientAppCalendar'

import { mapState } from 'vuex'
import { maxLength, minLength, alpha, numeric } from "vuelidate/lib/validators"

import { auth, db } from '../firebase'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export default {
    components: {
        Navbar,
        CalendarAppointments
    },
    computed: {
    ...mapState(['userProfile']),

        user () {
            return this.$store.getters.user
        },
        loading () {
            return this.$store.state.loading
        },
        formattedDate () {
            return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
        },
      

        // VALIDATION ERROR MESSAGES
        firstNameErrors () {
            const errors = []
            if(!this.$v.firstname.$dirty) return errors
                !this.$v.firstname.alpha && errors.push('Alphabetical characters only')
                !this.$v.firstname.minLength && errors.push('First Name must be at least 3 characters long')
                !this.$v.firstname.maxLength && errors.push('First Name should not exceed 15 characters') 
            return errors
        },
        surnameErrors() {
            const errors = []
            if(!this.$v.surname.$dirty) return errors
                !this.$v.surname.alpha && errors.push('Alphabetical characters only')
                !this.$v.surname.minLength && errors.push('Surname must be at least 3 characters long')
                !this.$v.surname.maxLength && errors.push('Surname should not exceed 15 characters') 
            return errors
        },
        ppsnErrors () {
            const errors = []
            if (!this.$v.ppsn.$dirty) return errors
                !this.$v.ppsn.ppsnValidate && errors.push('PPSN is invalid')
            return errors   
        },
        mobileErrors () {
            const errors = []
            if (!this.$v.mobile.$dirty) return errors
                !this.$v.mobile.numeric && errors.push('Numerical values only')
                !this.$v.mobile.minLength && errors.push('Mobile number appears too short')
                !this.$v.mobile.maxLength && errors.push('Mobile number appears too long')
            return errors
        },
    },
    created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
    },
    data() {
        //
        return{
            firstname: this.$store.state.userProfile.firstname,
            surname: this.$store.state.userProfile.surname,
            date: this.$store.state.userProfile.date,
            ppsn: this.$store.state.userProfile.ppsn,
            mobile: this.$store.state.userProfile.mobile,
            menu: false,
            showEditForm: true,

            dob: null,
        }
    },
    validations: {
            firstname: {minLength: minLength(3), maxLength: maxLength(15), alpha},
            surname: {minLength: minLength(3), maxLength: maxLength(15), alpha},
            ppsn: { 
                ppsnValidate(ppsn){
                    return (
                        /^[0-9]{7}[a-zA-Z]{1,2}$/.test(ppsn)
                    );
                },
            },
            mobile: {numeric, minLength: minLength(9), maxLength: maxLength(14)},

    },
    methods: {
    //   viewDOB () {
    //       return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
    //   },

    getEarliestPossible () {
        db.collection("users").doc(this.currentUser).onSnapshot(doc => {
            let patientRecord = doc.data()
            patientRecord.id = doc.id
            // Get DoB
            this.dob = patientRecord.date
        })
    
        let latest = new Date ()
        latest.setFullYear(latest.getFullYear() - 16)
        //Filter
        var d = new Date(latest),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    getLowestPossible () {
        let latest = new Date ()
        latest.setFullYear(latest.getFullYear() - 90)
        //Filter
        var d = new Date(latest),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    toggleEditProfile(){
        this.showEditForm = !this.showEditForm
        this.$v.$reset()

            this.firstname = this.$store.state.userProfile.firstname
            this.surname = this.$store.state.userProfile.surname
            this.date = this.$store.state.userProfile.date
            this.ppsn = this.$store.state.userProfile.ppsn
            this.mobile = this.$store.state.userProfile.mobile
    },
    updateProfile(){
        this.$v.$touch()
        this.formTouched = !this.$v.$anyDirty
        this.errors = this.$v.$anyError
        if (this.errors === false && this.formTouched === false){
            // Update the users info in their users collection
            this.$store.dispatch('updateProfile', {
            firstname: this.firstname !== '' ? this.firstname : this.userProfile.firstname, 
            surname: this.surname !== '' ? this.surname : this.userProfile.surname,
            date: this.date !== '' ? this.date : this.userProfile.date,
            ppsn: this.ppsn !== '' ? this.ppsn : this.userProfile.ppsn,
            mobile: this.mobile !== '' ? this.mobile : this.userProfile.mobile,
        }).then ( () =>{ 
        this.showEditForm = !this.showEditForm
        })
        } 
    },
} 
};
</script>