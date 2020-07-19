<template>


    <div class="modal-content">
      
      
      <v-card v-if="!showSuccess">
        
        <v-form @submit.prevent>
            <v-col class="text-right">
                <v-btn class="mx-2" @click="$emit('close')" fab dark small color="primary">
                    <v-icon class="material-icons">close</v-icon>
                </v-btn>
            </v-col >
            
            <v-card-title class="text-uppercase mt-n14">Forgot Password</v-card-title>
            
            <v-divider class="mx4"></v-divider>
            <v-card-text>
                <h3 class="text-center">Enter your email to reset your password</h3>
               
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
                </v-row>
                <v-row>
                     <p v-if="errorMsg !== ''" class="error">{{ errorMsg }}</p>
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
            </v-card-text>
        </v-form>

    
        <!-- <p v-if="errorMsg !== ''" class="error">{{ errorMsg }}</p> -->

      </v-card>


    <p v-else>Success! Check your email for a reset link.</p>
    </div>

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