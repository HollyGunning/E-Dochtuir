<template>
  <v-container>

    <v-card flat class="mt-0">
      <v-form @submit.prevent="submit">
        <v-card-title class="text-uppercase">Sign Up</v-card-title>
        <v-divider class="mx4"></v-divider>
        <v-card-text>
          <v-row>
            <v-col class="mt-n2" cols="12" md="6">
              <v-text-field
              type="text"
              name="firstname"
              v-model.trim="firstname"
              :error-messages="nameErrors"
              label="First Name"
              :counter="15" 
              required
              outlined
              @input="$v.firstname.$touch()"
              @blur="$v.firstname.$touch()">
              </v-text-field>
            </v-col>   


            <v-col class="mt-n2" cols="12" md="6">
              <v-text-field
              type="email"
              name="email"
              v-model="email"
              :error-messages="emailErrors"
              label="E-mail"
              required
              outlined
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
                >
              </v-text-field>
            </v-col>
       
              <!-- <div class="form-error mt-n6 red-text" v-if="$v.firstname.$dirty">
                <div v-if="!$v.firstname.required">Please enter your first name</div>
                <div v-if="!$v.firstname.minLength">First name must have at least {{$v.firstname.$params.minLength.min}} letters.</div>
              </div> -->

          </v-row>

          <v-card-actions>
            <v-row>
              <v-btn class="mr-4" @click="submit">submit</v-btn>
            </v-row>
          </v-card-actions>
        </v-card-text>







              <!-- <button class="button" type="submit" :disabled="submitStatus === 'PENDING'">Submit!</button>
                <p class="typo__p" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
                <p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
                <p class="typo__p" v-if="submitStatus === 'PENDING'">Sending...</p> -->

        

     


      </v-form>
    </v-card>





  </v-container>
</template>


<script>
    // import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

  import { required, minLength, maxLength, email } from "vuelidate/lib/validators"

    export default {
        name: "app",
        data() {
          return {
            
            // submitStatus: null,
            firstname: "",
            email: "",

          };
        },
        validations: {         
          firstname: { required, minLength: minLength(3), maxLength: maxLength(15) },
          email: { required, email },
              // email: { required, email },
              // password: { required, minLength: minLength(6) },
              // confirmPassword: { required, sameAsPassword: sameAs('password') }
          // }
        },
        computed: {
          nameErrors () {
            const errors = []
            if (!this.$v.firstname.$dirty) return errors
            !this.$v.firstname.minLength && errors.push('Name must be at least 3 characters long')
            !this.$v.firstname.maxLength && errors.push('Name must be at most 15 characters long')
            !this.$v.firstname.required && errors.push('Name is required.')
            return errors
        },
        emailErrors () {
          const errors = []
          if (!this.$v.email.$dirty) return errors
          !this.$v.email.email && errors.push('Must be valid e-mail')
          !this.$v.email.required && errors.push('E-mail is required')
          return errors
    },
        },
       methods: {
        // submit() {
        //     console.log('submit!')
        //     this.$v.$touch()
        //     if (this.$v.$invalid) {
        //       this.submitStatus = 'ERROR'
        //     } else {
        //       // do your submit logic here
        //       this.submitStatus = 'PENDING'
        //       setTimeout(() => {
        //         this.submitStatus = 'OK'
        //       }, 500)
        //     }
        //   }
        submit() {
          this.$v.$touch()
        },

      }
    };
</script>

<style scoped>

/* .form-error {
  color: #f04124;
  display: inline-block;
  border-block-color: #db2828;
  font-size: 0.90em;
  padding-left: 10px;
} */



</style>