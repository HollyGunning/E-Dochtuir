<template>
    <v-container>
    <div class="profile">

        <v-row>
            <v-col cols="12" s="12" sm="6" md="4" lg="4">
                <v-card width="600" height="300">
                <v-row justify="space-around" class="pt-3">
                <v-avatar size="150" class="grey lighten-2">
                    <img src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg">
                </v-avatar>
                </v-row>
                <v-card-text class="text-center">
                    <v-row>
                    <!-- <v-layout column align-center> -->
                        <v-flex class="mt-8">
                            <h2>Firstname Surname</h2>
                        </v-flex>
                    <!-- </v-layout> -->
                    </v-row>
                </v-card-text>
                </v-card>   

                <v-card width="600" height="100" class="mt-5">

                </v-card>
            </v-col>

            <v-col cols="12" s="12" sm="6" md="8" lg="8">
                <v-card width="800" height="420"></v-card>
                
            </v-col>

        </v-row>



        

   






    </div>
    </v-container>
</template>

<script>


export default {
components: {
 
  },

  data: () => ({
    //
  }),
};
</script>