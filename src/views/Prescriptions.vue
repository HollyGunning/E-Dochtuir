<template>
<v-container>
<Navbar />
    <v-row><v-col cols="12">
        <v-card flat>
        <v-card-title class="primary lighten-1 white--text">Prescriptions</v-card-title>
        <v-row>
            <v-col cols="12" sm="12" md="6" lg="6">
                <v-card>
                    <v-title class="primary lighten-3 white--text">Title</v-title>
                </v-card>
                
                
                
                
                <!-- <v-card>
                    <v-card-title class="primary white--text"></v-card-title>
                    <v-card-text>
                        <v-btn
                        label="button"
                        outlined
                        @click="testBtn()"
                        ></v-btn>
                    </v-card-text>
                </v-card>

            <v-card v-if="test">HI</v-card> -->

     


            </v-col>
        </v-row>
        </v-card>
    </v-col></v-row>
</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
export default {
    components: {
        Navbar,
    },
    created() {
        
    },
    data() {
        return {
        // test: false,
        
        }
    },
    validations: {

    },
    methods: {
        // testBtn () {
        //     this.test = !this.test
        // }
    },
    
}
</script>