<template>
    <v-container>
       
        <div id="login">
            <div :class="{ 'signup-form': !showLoginForm }" class="col2">
            <v-card flat class="mt-0">
                <!-- Login Form -->
                <v-form class="px-2" v-if="showLoginForm" @submit.prevent="login"> 
                    <v-card-title class="text-uppercase">Login</v-card-title>
                    <v-divider class="mx4"></v-divider>
                    <v-card-text>
                        <v-row>
                        <v-col class="mt-n2" cols="12" md="6">
                            <v-text-field
                            type="email"
                            name="email"
                            v-model.trim="loginForm.email"
                            :error-messages="loginEmailErrors"
                            label="E-mail Address"
                            required
                            outlined
                            @input="$v.loginForm.email.$touch()"
                            @blur="$v.loginForm.email.$touch()"
                            >
                        </v-text-field>
                        </v-col>
                        <v-col class="mt-n2" cols="12" md="6">
                            <v-text-field 
                            name="password"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            v-model.trim="loginForm.password"
                            :error-messages="loginPasswordErrors"
                            label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            required
                            outlined 
                            @click:append="showPassword = !showPassword"
                            @input="$v.loginForm.password.$touch()"
                            @blur="$v.loginForm.password.$touch()"
                            >
                            </v-text-field>
                        </v-col>                
                        <v-col></v-col>
                        <v-col class="mt-n8 text-right" cols="12" md="6">                 
                            <v-dialog v-model="dialog" max-width="500px">   
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    right
                                    color="primary"
                                    dark
                                    text
                                    v-bind="attrs"
                                    v-on="on">
                                    Forgot Password? 
                                </v-btn>
                                </template>
                                 <!-- Dialog box for forgot password -->
                                <v-card v-if="!showSuccess">
                                    <v-form class="px-2" @submit.prevent="resetPassword">              
                                        <v-card-title class="text-uppercase mt-2">Forgot Password</v-card-title>
                                        <v-divider class="mx4"></v-divider>
                                        <v-card-text>
                                            <h2 class="text-center">Enter your email to reset your password</h2>
                                            <v-row class="mt-4">
                                                <v-col class="mt-n2" cols="12" md="12">
                                                <v-text-field 
                                                type="email" 
                                                name="email" 
                                                v-model.trim="forgotForm.email"
                                                :error-messages="emailErrors"
                                                label="E-Mail Address" 
                                                required
                                                outlined 
                                                @input="$v.forgotForm.email.$touch()"
                                                @blur="$v.forgotForm.email.$touch()"
                                                >
                                                </v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-card-actions>            
                                                <v-row class="mt-n2">
                                                    <v-btn 
                                                    type="submit"
                                                    block 
                                                    class="primary white--text"
                                                    @click="resetPassword()">
                                                    <span>Reset Password</span>
                                                    </v-btn> 
                                                </v-row>
                                            </v-card-actions>
                                                <v-flex v-if="errorMsg !== ''">
                                                <v-alert type="error" dismissible v-model="alert3">
                                                    {{ errorMsg }}
                                                </v-alert>
                                                </v-flex>
    
                                        </v-card-text>
                                    </v-form> 
                                </v-card>
                                <!-- Show success message on password reset email -->
                                <v-card v-else>
                                    <v-card-title class="text-uppercase">Success!</v-card-title>
                                    <v-divider class="mx4"></v-divider>
                                    <v-card-text>
                                        <v-row>
                                            <v-col class="mt-n2" cols="12" md="12">
                                            <h2 class="pa-2 d-flex justify-center mt-2">Check your email for a reset link.</h2>
                                        </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-row>
                                <v-btn 
                                    type="submit"
                                    :disabled="loading"
                                    block class="primary white--text"
                                    @click="login()">
                                    <span>Login</span>
                                </v-btn> 
                            </v-row>
                        </v-card-actions>
                        <v-flex>
                        <v-alert type="error" dismissible v-model="alert2">
                            {{ loginError }}
                        </v-alert>
                        </v-flex>
                    </v-card-text>
                    <v-divider class="mt-2"></v-divider>
                        <v-card-actions>
                            <v-btn 
                                color="primary" 
                                text
                                @click="toggleForm()"> 
                                Create Account
                            </v-btn>
                        </v-card-actions>
                </v-form>


                <!-- SIGNUP FORM -->
                <v-form class="px-2" v-else @submit.prevent="signup">
                    <v-card-title class="text-uppercase">Sign Up</v-card-title>
                    <v-divider class="mx4"></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="text"
                                name="firstname"
                                v-model.trim="signupForm.firstname" 
                                :error-messages="signupFirstNameErrors"
                                label="First Name" 
                                :counter="15" 
                                required
                                outlined 
                                @input="$v.signupForm.firstname.$touch()"
                                @blur="$v.signupForm.firstname.$touch()"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="text"
                                name="surname"
                                v-model.trim="signupForm.surname" 
                                :error-messages="signupSurnameErrors"
                                label="Surname" 
                                :counter="15" 
                                required
                                outlined
                                @input="$v.signupForm.surname.$touch()"
                                @blur="$v.signupForm.surname.$touch()"
                                >
                                </v-text-field>
                            </v-col> 
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                max-width="290"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                :value="formattedDate"
                                clearable
                                :error-messages="dateErrors"
                                label="Date of Birth"
                                readonly
                                v-bind="attrs"
                                v-on="on" 
                                required
                                outlined
                                @input="$v.date.$touch()"
                                @blur="$v.date.$touch()"
                                @click:clear="date = null"
                                >
                                </v-text-field>
                                </template>
                                <v-date-picker
                                v-model.trim="date"
                                @change="menu = false"  
                                >
                                </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="text"
                                name="ppsn"
                                hint="7 numerical characters, followed by either 1 or 2 letters E.g. 1234567RW"
                                v-model.trim="signupForm.ppsn"
                                :error-messages="signupPPSNErrors" 
                                label="PPSN" 
                                required
                                outlined 
                                @input="$v.signupForm.ppsn.$touch()"
                                @blur="$v.signupForm.ppsn.$touch()"
                                >
                                </v-text-field>
                            </v-col>                                                                                                         
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="email" 
                                name="email" 
                                v-model.trim="signupForm.email"  
                                :error-messages="signupEmailErrors"            
                                label="E-Mail Address" 
                                required
                                outlined 
                                @input="$v.signupForm.email.$touch()"
                                @blur="$v.signupForm.email.$touch()"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                name="mobile"
                                v-model.trim="signupForm.mobile"
                                :error-messages="signupMobileErrors"
                                label="Mobile Number" 
                                required
                                outlined 
                                @input="$v.signupForm.mobile.$touch()"
                                @blur="$v.signupForm.mobile.$touch()"
                                >
                                </v-text-field>
                            </v-col>                            
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                name="password"
                                :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword2 ? 'text' : 'password'"
                                hint="At least 8 characters"
                                v-model.trim="signupForm.password" 
                                :error-messages="signupPasswordErrors"
                                label="Password"
                                :counter="16" 
                                required
                                outlined 
                                @click:append="showPassword2 = !showPassword2"
                                @input="$v.signupForm.password.$touch()"
                                @blur="$v.signupForm.password.$touch()"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                name="confirmPassword"
                                :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword2 ? 'text' : 'password'"
                                v-model.trim="signupForm.confirmPassword" 
                                :error-messages="signupConfirmErrors"
                                label="Confirm Password" 
                                required
                                outlined
                                @click:append="showPassword2 = !showPassword2"
                                @input="$v.signupForm.confirmPassword.$touch()"
                                @blur="$v.signupForm.confirmPassword.$touch()"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col class="mt-n8" cols="12" md="6">
                                <v-checkbox 
                                type="checkbox" 
                                name="checkbox" 
                                v-model.trim="signupForm.checkbox" 
                                :error-messages="checkboxErrors"
                                label="I have read and agree to the terms and conditions"
                                required
                                @input="$v.signupForm.checkbox.$touch()"
                                @blur="$v.signupForm.checkbox.$touch()" 
                                >
                                    <template v-slot:label>
                                       
                                        <span>I have read and agree to the 
                                            <a @click.stop.prevent="dialog2 = true">Terms of Service</a>
                                        </span>
                                           
                                    </template>
                                </v-checkbox>
                            </v-col>

                             <v-dialog
                                v-model="dialog2"
                                absolute
                                max-width="400"
                                persistent
                            >
                            
                          
                                <v-card>
                                <v-card-title class="text-uppercase">Terms & Conditions</v-card-title>
                                    <TsAndCs />
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn
                                    text
                                    @click="signupForm.checkbox = false, dialog2 = false"
                                    >
                                    No
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                    class="white--text"
                                    color="primary"
                                    @click="signupForm.checkbox = true, dialog2 = false"
                                    >
                                    Yes
                                    </v-btn>
                                </v-card-actions>
                                </v-card>
                            </v-dialog>

                        </v-row>
                        <v-card-actions>
                            <v-row>
                                <v-btn 
                                    type="submit"
                                    :disabled="loading"
                                    block class="primary white--text"
                                    @click.prevent="signup()">
                                    <span>Sign Up</span>
                                </v-btn> 
                            </v-row>
                        </v-card-actions>
                        <v-flex>
                        <v-alert type="error" dismissible v-model="alert1">
                            {{ registerError }}
                        </v-alert>
                        </v-flex>
                    </v-card-text>
                    <v-divider class="mt-2"></v-divider>
                        <v-card-actions>
                            <v-btn 
                                color="primary" 
                                text
                                @click="toggleForm()"> 
                                Already Registered?
                            </v-btn>
                        </v-card-actions>
                </v-form>

            </v-card>
            </div> <!-- switch from login to sign up -->
        </div> <!-- id=login close -->


    </v-container>
</template>

<script>
import { auth } from '@/firebase'

import { required, email, maxLength, minLength, alpha, numeric, sameAs } from "vuelidate/lib/validators"

import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import TsAndCs from '../components/TsAndCs'

export default {
    components: {
        TsAndCs,
    },
   data() {
    return {
    //icons to show password
      showPassword: false,
      showPassword2: false,
      // dialog and menu for forgot password
      dialog: false,
      dialog2: false,
      menu: false,
      // date for dob 
      date: '',
      
      
    //   errors: false,
    //   empty: true,

      showSuccess: false,
      errorMsg: {},



      alert1: false,
      alert2: false,
      alert3: false,

      forgotForm: {
        email: '',
      },
      loginForm: {
        email: '',
        password: ''
        
      },
      signupForm: {
        firstname: '',
        surname: '',
        ppsn: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        checkbox: false,   
      },
      showLoginForm: true,
      showPasswordReset: false 
    }
    },


    validations: {
        loginForm: {
            email: { required, email },
            password: { required, maxLength: maxLength(16) },
        },
        signupForm: {
            firstname: { required, minLength: minLength(3), maxLength: maxLength (15), alpha},
            surname: { required, minLength: minLength(3), maxLength: maxLength (15), alpha},
            ppsn: { 
                required,
                ppsnValidate(ppsn){
                    return (
                        /^[0-9]{7}[a-zA-Z]{1,2}$/.test(ppsn)
                    );
                },
            },
            email: { required, email },
            mobile: { required, numeric, minLength: minLength(9), maxLength: maxLength(14) },
            password: { required, minLength: minLength(8), maxLength: maxLength(16)},
            confirmPassword: { required, sameAs: sameAs(function () { return this.signupForm.password})},
            checkbox: {checked (val) {return val}},
        },
        date: { required },
        forgotForm: {
            email: { required, email },
        },
        

    },
    methods: {
        async resetPassword() {
        this.errorMsg = ''
        this.$v.$touch()
            try {
                await auth.sendPasswordResetEmail(this.forgotForm.email)
                this.showSuccess = true
            } catch (error) {
                this.errorMsg = error.message
            }
        },
        toggleForm() {
        this.showLoginForm = !this.showLoginForm
         this.$v.$reset()
            this.loginForm.email = ''
            this.loginForm.password = ''
            this.signupForm.firstname = ''
            this.signupForm.surname = ''
            this.signupForm.ppsn = ''
            this.signupForm.email = ''
            this.signupForm.mobile = ''
            this.signupForm.password = ''
            this.signupForm.confirmPassword = ''
            this.signupForm.checkbox = false
            this.forgotForm.email = ''
            this.alert1 = false
            this.alert2 = false
        },
        login() {
        this.$v.$touch()
        this.$store.dispatch('login', {
            email: this.loginForm.email,
            password: this.loginForm.password
        })
        },
        signup() {
        this.$v.$touch()
        this.formTouched = !this.$v.signupForm.$anyDirty
        this.errors = this.$v.signupForm.$anyError
            if (this.errors === false && this.formTouched === false){
                // send users registered info into a collection
                this.$store.dispatch('signup', {
                firstname: this.signupForm.firstname,
                surname: this.signupForm.surname,
                date: this.date,
                ppsn: this.signupForm.ppsn,
                email: this.signupForm.email,
                mobile: this.signupForm.mobile,
                password: this.signupForm.password,   
            })
            }
        },
    },
    watch: {
            // Register firebase error alert
            registerError (value) {
            if (value) {
                this.alert1 = true
            }
            },
            alert (value) {
            if (!value) {
                this.$store.commit('setregisterError', null)
            }
            },
            // Login firebase error alert
            loginError (value){
                if (value){
                    this.alert2 = true
                }
            },
            alert2 (value){
                if (!value){
                    this.$store.commit('setLoginError', null)
                }
            },
            // Forgot Password firebase error alert
            errorMsg (value) {
               if (!value) {
                   this.alert3 = true
               }
            },
    },
    computed: {
        // Returning the state of the errors
        registerError () {
            return this.$store.state.registerError
        },
        loginError () {
            return this.$store.state.loginError
        },
        loading () {
            return this.$store.state.loading
        },


        formattedDate () {
        return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
        },


        // VALIDATION ERROR MESSAGES
        emailErrors () {
          const errors = []
          if (!this.$v.forgotForm.email.$dirty) return errors
            !this.$v.forgotForm.email.email && errors.push('Invalid Email Address')
            !this.$v.forgotForm.email.required && errors.push('E-mail is required')
          return errors

        },
        loginEmailErrors () {
          const errors = []
          if (!this.$v.loginForm.email.$dirty) return errors
            !this.$v.loginForm.email.email && errors.push('Invalid Email Address')
            !this.$v.loginForm.email.required && errors.push('E-mail is required')
          return errors
        },
        loginPasswordErrors () {
          const errors = []
          if (!this.$v.loginForm.password.$dirty) return errors
            !this.$v.loginForm.password.maxLength && errors.push('Password exceeds maximum length of 16 characters')
            !this.$v.loginForm.password.required && errors.push('Password is required')
          return errors
        },
        signupFirstNameErrors () {
          const errors = []
          if (!this.$v.signupForm.firstname.$dirty) return errors
            !this.$v.signupForm.firstname.alpha && errors.push('Alphabetical characters only')
            !this.$v.signupForm.firstname.minLength && errors.push('First Name must be at least 3 characters long')
            !this.$v.signupForm.firstname.maxLength && errors.push('First Name should not exceed 15 characters') 
            !this.$v.signupForm.firstname.required && errors.push('First Name is required')
          return errors  
        },
        signupSurnameErrors () {
            const errors = []
            if (!this.$v.signupForm.surname.$dirty) return errors
                !this.$v.signupForm.surname.alpha && errors.push('Alphabetical characters only')
                !this.$v.signupForm.surname.minLength && errors.push('Surname must be at least 3 characters long')
                !this.$v.signupForm.surname.maxLength && errors.push('Surname should not exceed 15 characters')
                !this.$v.signupForm.surname.required && errors.push('Surname is required')
          return errors  
        },
        signupEmailErrors () {
          const errors = []
          if (!this.$v.signupForm.email.$dirty) return errors
            !this.$v.signupForm.email.email && errors.push('Invalid Email Address')
            !this.$v.signupForm.email.required && errors.push('E-mail is required')
          return errors
        },
        signupMobileErrors () {
          const errors = []
          if (!this.$v.signupForm.mobile.$dirty) return errors
            !this.$v.signupForm.mobile.numeric && errors.push('Numerical values only')
            !this.$v.signupForm.mobile.minLength && errors.push('Mobile number appears too short')
            !this.$v.signupForm.mobile.maxLength && errors.push('Mobile number appears too long')
            !this.$v.signupForm.mobile.required && errors.push('Mobile number is required')
          return errors
        },
        signupPasswordErrors () {
        const errors = []
        if (!this.$v.signupForm.password.$dirty) return errors
            !this.$v.signupForm.password.minLength && errors.push('Password must be at least 8 characters long')
            !this.$v.signupForm.password.maxLength && errors.push('Password should not exceed 16 characters')
            !this.$v.signupForm.password.required && errors.push('Password is required')
        return errors
        },
        signupConfirmErrors () {
        const errors = []
        if (!this.$v.signupForm.confirmPassword.$dirty) return errors
            !this.$v.signupForm.confirmPassword.sameAs && errors.push('Passwords do not match')
            !this.$v.signupForm.confirmPassword.required && errors.push('Password is required')
        return errors
        },
        dateErrors () {
        const errors = []
        if (!this.$v.date.$dirty) return errors
            !this.$v.date.required && errors.push('Date of Birth is required')
        return errors
        },
        signupPPSNErrors () {
        const errors = []
        if (!this.$v.signupForm.ppsn.$dirty) return errors
            !this.$v.signupForm.ppsn.required && errors.push('PPSN is required')
            !this.$v.signupForm.ppsn.ppsnValidate && errors.push('PPSN is invalid')
        return errors   
        },
        checkboxErrors () {
        const errors = []
        if (!this.$v.signupForm.checkbox.$dirty) return errors
         !this.$v.signupForm.checkbox.checked && errors.push('You must agree to continue!')
        return errors
        },
    }
}
</script>

<style scoped>

.textCss input {
    text-transform: capitalize;
}

</style>