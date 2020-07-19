<template>


  <!-- <div class="modal"> -->
    <div class="modal-content">
      <div @click="$emit('close')" class="close">close</div>
      <h3>Reset Password</h3>
      <div v-if="!showSuccess">
        <p>Enter your email to reset your password</p>
    
    
        <v-form @submit.prevent>

            <v-card-title class="text-uppercase">Forgot Password</v-card-title>

            <v-divider class="mx4"></v-divider>
            <v-card-text>
                <v-row>
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
                </v-row>
                <v-card-actions>            
                    <v-row>
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

    
        <p v-if="errorMsg !== ''" class="error">{{ errorMsg }}</p>
        <button @click="resetPassword()" class="button">Reset</button>
      </div>
      <p v-else>Success! Check your email for a reset link.</p>
    </div>
  <!-- </div> -->
</template>





<script>
import { auth } from '@/firebase'
export default {
  data() {
    return {
      email: '',
      showSuccess: false,
      errorMsg: ''
    }
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
    }
  }
}
</script>