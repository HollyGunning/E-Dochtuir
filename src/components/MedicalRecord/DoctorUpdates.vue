<template>
<!-- <v-row><v-col cols="12" md="12" lg="12"> -->
    <v-card flat class="mt-n5">
    <v-form @submit.prevent="updateMedicalRecord">
        <v-card-text>
            <v-row>
                <!-- Pulse -->
                <v-col cols="12" sm="4" md="4" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">Pulse
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="Pulse"
                    v-model="pulse"
                    outlined 
                    prepend-icon="fa-heartbeat"
                    suffix="bpm"
                    @change="onPulseChange(pulse)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>
                <!-- Blood Pressure & Pulse -->
                <v-col cols="12" sm="4" md="4" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">Blood Pressure
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="Systolic"
                    v-model="systolic"
                    outlined 
                    @change="onSystolicChange(systolic)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>
                <v-col cols="12" sm="4" md="4" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="Diastolic"
                    v-model="diastolic"
                    outlined 
                    @change="onDiastolicChange(diastolic)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>
                <!-- Blood Glucose Level -->
                <v-col cols="12" sm="4" md="4" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">Blood Glucose Level
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="Level"
                    v-model="bloodGlucoseLevel"
                    outlined 
                    suffix="mmol/l"
                    @change="onLevelChange(bloodGlucoseLevel)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>

                <!-- Cholesterol -->
                <v-col cols="12" sm="6" md="6" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">Cholesterol
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="Total Cholesterol"
                    v-model="cholesterol"
                    outlined
                    suffix="mmol/l" 
                    prepend-icon="fa-heart-broken"
                    @change="onTotalCholChange(cholesterol)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="LDL"
                    v-model="cholesterolLDL"
                    outlined
                    suffix="mmol/l" 
                    @change="onLDLChange(cholesterolLDL)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="HDL"
                    v-model="cholesterolHDL"
                    outlined
                    suffix="mmol/l" 
                    @change="onHDLChange(cholesterolHDL)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="3">
                <v-card flat>
                    <v-card-title>
                    <v-subheader class="overline ml-n5">
                        <v-divider></v-divider>
                    </v-subheader>
                    </v-card-title>
                    <v-card-text>
                    <v-text-field
                    label="Triglycerides"
                    v-model="cholesterolTriglycerides"
                    outlined
                    suffix="mmol/l" 
                    @change="onTriglyceridesChange(cholesterolTriglycerides)"
                    ></v-text-field>
                    </v-card-text>
                </v-card>
                </v-col>
        

            </v-row>
          </v-card-text>
    </v-form>
    </v-card>
    <!-- </v-col></v-row> -->
</template>

<script>
import { db } from '../../firebase'

export default {
    created() {
        db.collection("users")
    },
    computed: {
        
    },
    data() {
        return {


            pulse: null,
            systolic: null,
            diastolic: null,
            bloodGlucoseLevel: null,
            cholesterol: null,
            cholesterolLDL: null,
            cholesterolHDL: null,
            cholesterolTriglycerides: null,
        }
    },
    validations: {

    },
    methods: {
        onPulseChange (pulse) {
            db.collection("users").doc(id).get().then(()=> {
                if(pulse != null){
                    db.collection("users").doc(id).update({
                        pulse: pulse
                    })
                }
            })
        },
        onSystolicChange (systolic) {
            db.collection("users").doc(id).get().then(()=> {
                if(systolic != null){
                    db.collection("users").doc(id).update({
                        systolic: systolic
                    })
                }
            })
        },
        onDiastolicChange (diastolic) {
            db.collection("users").doc(id).get().then(()=> {
                if(diastolic != null){
                    db.collection("users").doc(id).update({
                        diastolic: diastolic
                    })
                }
            })
        },
        onLevelChange (bloodGlucoseLevel) {
            db.collection("users").doc(id).get().then(()=> {
                if(bloodGlucoseLevel != null){
                    db.collection("users").doc(id).update({
                        bloodGlucoseLevel: bloodGlucoseLevel
                    })
                }
            })
        },
        onTotalCholChange (cholesterol) {
            db.collection("users").doc(id).get().then(()=> {
                if(cholesterol != null){
                    db.collection("users").doc(id).update({
                        cholesterol: cholesterol
                    })
                }
            })
        },
        onLDLChange (cholesterolLDL) {
           db.collection("users").doc(id).get().then(()=> {
                if(cholesterolLDL != null){
                    db.collection("users").doc(id).update({
                        cholesterolLDL: cholesterolLDL
                    })
                }
            })
        },
        onHDLChange (cholesterolHDL) {
           db.collection("users").doc(id).get().then(()=> {
                if(cholesterolHDL != null){
                    db.collection("users").doc(id).update({
                        cholesterolHDL: cholesterolHDL
                    })
                }
            })
        },
        onTriglyceridesChange (cholesterolTriglycerides) {
           db.collection("users").doc(id).get().then(()=> {
                if(cholesterolTriglycerides != null){
                    db.collection("users").doc(id).update({
                        cholesterolTriglycerides: cholesterolTriglycerides
                    })
                }
            })
        }
    },
}
</script>