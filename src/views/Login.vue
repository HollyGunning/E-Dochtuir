<template>
    <v-container>
       
 <div id="login">
     <PasswordReset v-if="showPasswordReset" @close="togglePasswordReset()" ></PasswordReset>

      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <v-card class="mt-4">

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
                    <v-col>

                    </v-col>
                    <v-col class="mt-n8 text-right" cols="12" md="6">
                        <v-btn 
                        right color="primary" 
                        text
                        @click="togglePasswordReset()"> 
                        Forgot Password? 
                        </v-btn>
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
                        <!-- text @click="SignIn"> Already Registered?  -->
                    </v-btn>
                </v-card-actions>
        </v-form>



        <v-form class="px-2" v-else @submit.prevent>
            <v-card-title class="text-uppercase">Sign Up</v-card-title>
            <v-divider class="mx4"></v-divider>
            <v-card-text>
                <v-row>
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
                        type="password" 
                        name="password" 
                        v-model.trim="signupForm.password" 
                        label="Password" 
                        outlined 
                        required>
                        </v-text-field>
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

      </div>
  </div>



      
    </v-container>
 
</template>

<script>
import PasswordReset from '@/components/PasswordReset'

export default {
  components: {
   PasswordReset
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        // name: '',
        email: '',
        password: ''
      },
      showLoginForm: true,
      showPasswordReset: false
      
    }
  },
  methods: {
    togglePasswordReset() {
    this.showPasswordReset = !this.showPasswordReset
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
        email: this.signupForm.email,
        password: this.signupForm.password,
        // name: this.signupForm.name,
      })
    }
  }
}
</script>