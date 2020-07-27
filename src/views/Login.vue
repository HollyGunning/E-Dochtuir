<template>
    <v-container>
       
        <div id="login">
            <div :class="{ 'signup-form': !showLoginForm }" class="col2">
            <v-card flat class="mt-0">
                <!-- Login Form -->
                <v-form class="px-2" v-if="showLoginForm" @submit.prevent> 
                    <v-card-title class="text-uppercase">Login</v-card-title>
                    <v-divider class="mx4"></v-divider>
                    <v-card-text>
                        <v-row>
                        <v-col class="mt-n2" cols="12" md="6">
                            <v-text-field 
                            type="email" 
                            name="email" 
                            v-model.trim="loginForm.email"
                            
                            label="E-Mail Address" 
                            outlined 
                            required>
                            </v-text-field>
                        </v-col>
                        <v-col class="mt-n2" cols="12" md="6">
                            <v-text-field 
                            type="password" 
                            name="password" 
                            v-model.trim="loginForm.password" 
                            label="Password" 
                            outlined 
                            required>
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
                                    <v-form class="px-2" @submit.prevent>              
                                        <v-card-title class="text-uppercase mt-2">Forgot Password</v-card-title>
                                        <v-divider class="mx4"></v-divider>
                                        <v-card-text>
                                            <h2 class="text-center">Enter your email to reset your password</h2>
                                            <v-row class="mt-4">
                                                <v-col class="mt-n2" cols="12" md="12">
                                                <v-text-field 
                                                type="email" 
                                                name="email" 
                                                v-model.trim="email"
                                                label="E-Mail Address" 
                                                outlined 
                                                required>
                                                </v-text-field>
                                                </v-col>
                                                <v-col class="mt-n8" cols="12" md="12">
                                                <h3 v-if="errorMsg !== ''" class="text-justified error">{{ errorMsg }}</h3>
                                                </v-col>
                                            </v-row>
                                            <v-card-actions>            
                                                <v-row class="mt-2">
                                                    <v-btn 
                                                    type="submit"
                                                    block 
                                                    class="primary white--text"
                                                    @click="resetPassword()">
                                                    <span>Reset Password</span>
                                                    </v-btn> 
                                                </v-row>
                                            </v-card-actions>
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
                                            <h2 class="text-center mt-2">Check your email for a reset link.</h2>
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
                                    block class="primary white--text"
                                    @click="login()">
                                    <span>Login</span>
                                </v-btn> 
                            </v-row>
                        </v-card-actions>
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




                <!-- SignUp Form -->
                <v-form class="px-2" v-else @submit.prevent>
                    <v-card-title class="text-uppercase">Sign Up</v-card-title>
                    <v-divider class="mx4"></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col class="mt-n2" cols="12" md="6">
 
                                <v-text-field 
                                type="text"
                                pattern="[A-Za-z]"
                                name="firstname"
                                v-model.trim="signupForm.firstname" 
                                :rules="nameRules"
                                :counter="15" label="First Name" 
                                outlined 
                                required>
                                </v-text-field>


                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="text"
                                name="surname"
                                v-model.trim="signupForm.surname" 
                                
                                :counter="15" 
                                label="Surname" 
                                outlined 
                                required>
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
                                label="Date of Birth"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                @click:clear="date = null"
                                outlined>
                                </v-text-field>
                                </template>
                                <v-date-picker
                                v-model.trim="date"
                                @change="menu = false">
                                </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="text"
                                name="ppsn"
                                v-model.trim="signupForm.ppsn" 
                                label="PPSN" 
                                outlined 
                                required>
                                </v-text-field>
                            </v-col>                                                                                                         
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="email" 
                                name="email" 
                                v-model.trim="signupForm.email"                    
                                label="E-Mail Address" 
                                outlined 
                                required>
                                </v-text-field>
                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="number"
                                name="mobile"
                                v-model.trim="signupForm.mobile" 
                                label="Mobile Number" 
                                outlined 
                                required>
                                </v-text-field>
                            </v-col>                            
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="password" 
                                name="password" 
                                v-model.trim="signupForm.password" 
                                label="Password" 
                                outlined 
                                required>
                                </v-text-field>
                            </v-col>
                            <v-col class="mt-n2" cols="12" md="6">
                                <v-text-field 
                                type="password" 
                                name="confirmPassword" 
                                v-model.trim="signupForm.confirmPassword" 
                                label="Confirm Password" 
                                outlined 
                                required></v-text-field>
                            </v-col>
                            <v-col class="mt-n8" cols="12" md="6">
                                <v-checkbox 
                                type="checkbox" 
                                name="checkbox" 
                                v-model.trim="signupForm.checkbox" 
                                label="I have read and agree to the terms and conditions"
                                required></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-row>
                                <v-btn 
                                    type="submit"
                                    block class="primary white--text"
                                    @click="signup()">
                                    <span>Sign Up</span>
                                </v-btn> 
                            </v-row>
                        </v-card-actions>
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
// import { required, minLength, maxLength } from 'vuelidate/lib/validators'

import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export default {
   data() {
    return {

 
      dialog: false,
      menu: false,
      date: '',
      notifications: false,
      sound: true,
      widgets: false,
      email: '',
      showSuccess: false,
      errorMsg: '',
      
      nameRules: [

      ],
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
        checkbox: '',
      },
      showLoginForm: true,
      showPasswordReset: false 
    }
    },
    validations: {
   
    },
  methods: {
    async resetPassword() {
      this.errorMsg = ''
      try {
        await auth.sendPasswordResetEmail(this.email)
        this.showSuccess = true
      } catch (err) {
        this.errorMsg = err.message
      }
    },
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    signup() {
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
  computed: {
    formattedDate () {
    console.log(this.date)
    return this.date ? format(parseISO(this.date), 'do MMM yyyy') : ''
    }  
  }
}
</script>