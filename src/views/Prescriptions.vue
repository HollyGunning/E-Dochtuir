<template>
<v-container>
<Navbar />
    <v-row><v-col cols="12">
        <v-card flat>
        <v-card-title class="primary lighten-1 white--text">Prescriptions</v-card-title>
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="12"></v-col>
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
    }
}
</script>