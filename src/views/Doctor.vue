<template>
<v-container>
<DoctorNavbar />
  <v-col cols="12" s="12" sm="12" md="12" lg="12">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <!-- Card for Patient Records Search Bar -->
        <v-card outlined>
          <v-card-title class="text-uppercase grey--text text--darken-1">Patients
            <v-spacer></v-spacer>
            <v-text-field
            v-model="search"
            append-icon="fa-search"
            label="Search"
            single-line
            hide-details
            ></v-text-field>
          </v-card-title>
        </v-card>
        <!-- Card for the Data Table -->
        <v-card outlined>
          <v-data-table
          :headers="headers"
          :items="patients"
          :search="search"
          :items-per-page="5"
          class="elevation-1"
          >
          <template v-slot:[`item.actions`]="{ item }">
            <v-col cols="12" s="12" sm="12" md="12" lg="12">
            <v-icon
            class="mr-2"
            :key="item.id"
            :items="patients"
            v-bind="attrs"
            v-on="on"
            @click="storeID(item.id)"
            >fa-notes-medical
            </v-icon>
            </v-col>
            
          </template>
          </v-data-table>
        </v-card>

      </template>
      <!-- Dialog opens this card where the doctor can update the patients medical record-->
      <v-card>
        <v-card-title class="primary white--text">
          <v-btn class="ml-0" icon dark @click="close()"> 
          <v-icon class="ml-0" fab dark color="white--text darken-1 ">fa-long-arrow-alt-left</v-icon>
          </v-btn>
          <span class="ml-10">Update Medical Record</span>
        </v-card-title>
          <v-row>
            <v-col cols="12" md="12" lg="12">
            <!-- ALL MEDICAL RECORD FIELDS HERE -->
            <v-card flat class="mt-n5">
              <v-form @submit.prevent="updateMedicalRecord">
              <v-card-text>
                  <v-row>
                  <!-- GENDER -->
                  <v-col cols="12" sm="6" md="6" lg="3">
                  <v-card flat>
                      <v-card-title class="overline">
                        <v-subheader class="overline ml-n5">Gender
                        <v-divider></v-divider>
                        </v-subheader>
                      </v-card-title>
                      <v-card-text>
                        <v-btn-toggle 
                        v-model="gender" 
                        color="primary" 
                        group 
                        mandatory
                        @change="onGenderChange(gender)"
                        >
                          <v-btn depressed x-large color="primary--text darken-1" value="Female">
                          <v-icon class="mr-2">fa-venus</v-icon>Female
                          </v-btn>
                          <v-btn depressed x-large color="primary--text darken-1" value="Male">
                          <v-icon class="mr-2">fa-mars</v-icon>Male
                          </v-btn>
                        </v-btn-toggle>
                      </v-card-text>
                  </v-card>
                  </v-col>
                  <!-- BLOODS -->
                  <v-col cols="12" sm="6" md="6" lg="3">
                  <v-card flat>
                      <v-card-title class="overline">
                        <v-subheader  class="overline ml-n5">Blood Type
                        <v-divider></v-divider>
                        </v-subheader>
                      </v-card-title>
                      <v-card-text>
                            <v-select
                            v-model="selectedBlood"
                            :items="bloods"
                            label="Blood Type"
                            prepend-icon="fa-syringe"
                            outlined
                            @change="onBloodsChange(selectedBlood)"
                          ></v-select>
                      </v-card-text>
                  </v-card>
                  </v-col>

                  <!-- WEIGHT AND HEIGHT -->
                  <v-col cols="12" sm="6" md="6" lg="3">
                  <v-card flat>
                    <v-card-title>                   
                      <v-subheader class="overline ml-n5">Weight & Height
                        <v-divider></v-divider>
                      </v-subheader>
                    </v-card-title>
                    <v-card-text>
                      <v-text-field
                      label="Weight"
                      v-model="medicalForm.weight"
                      outlined 
                      prepend-icon="fa-weight"
                      :maxlength="3"
                      suffix="lbs"
                      @change="onWeightChange(medicalForm.weight)"
                      :error-messages="weightError"
                      @input="$v.medicalForm.weight.$touch()"
                      @blur="$v.medicalForm.weight.$touch()"
                      ></v-text-field>
                    </v-card-text>
                  </v-card> 
                  </v-col>
                  <v-col cols="12" sm="6" md="6" lg="3">
                    <v-card flat>
                    <v-card-title>                   
                      <v-subheader  class="overline ml-n5">
                        <v-divider></v-divider>
                      </v-subheader>
                    </v-card-title>
                      <v-card-text>
                        <v-text-field 
                          label="Height"
                          v-model="medicalForm.height"
                          outlined 
                          prepend-icon="fa-ruler-vertical"
                          :maxlength="3"
                          suffix="inches"
                          @change="onHeightChange(medicalForm.height)"
                          :error-messages="heightError"
                          @input="$v.medicalForm.height.$touch()"
                          @blur="$v.medicalForm.height.$touch()"
                          ></v-text-field>
                      </v-card-text>
                    </v-card>
                  </v-col>
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
                      v-model="medicalForm.pulse"
                      outlined 
                      prepend-icon="fa-heartbeat"
                      :maxlength="3"
                      suffix="bpm"
                      @change="onPulseChange(medicalForm.pulse)"
                      :error-messages="pulseError"
                      @input="$v.medicalForm.pulse.$touch()"
                      @blur="$v.medicalForm.pulse.$touch()"
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
                      v-model="medicalForm.systolic"
                      outlined
                      :maxlength="3"
                      @change="onSystolicChange(medicalForm.systolic)"
                      :error-messages="systolicError"
                      @input="$v.medicalForm.systolic.$touch()"
                      @blur="$v.medicalForm.systolic.$touch()"
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
                      v-model="medicalForm.diastolic"
                      outlined
                      :maxLength="3"
                      @change="onDiastolicChange(medicalForm.diastolic)"
                      :error-messages="diastolicError"
                      @input="$v.medicalForm.diastolic.$touch()"
                      @blur="$v.medicalForm.diastolic.$touch()"
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
                      v-model="medicalForm.bloodGlucoseLevel"
                      outlined 
                      suffix="mmol/l"
                      @change="onLevelChange(medicalForm.bloodGlucoseLevel)"
                      :error-messages="bloodGlucoseLevelError"
                      @input="$v.medicalForm.bloodGlucoseLevel.$touch()"
                      @blur="$v.medicalForm.bloodGlucoseLevel.$touch()"
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
                      v-model="medicalForm.cholesterol"
                      outlined
                      suffix="mmol/l" 
                      prepend-icon="fa-heart-broken"
                      @change="onTotalCholChange(medicalForm.cholesterol)"
                      :error-messages="cholesterolError"
                      @input="$v.medicalForm.cholesterol.$touch()"
                      @blur="$v.medicalForm.cholesterol.$touch()"
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
                      v-model="medicalForm.cholesterolLDL"
                      outlined
                      suffix="mmol/l" 
                      @change="onLDLChange(medicalForm.cholesterolLDL)"
                      :error-messages="cholesterolLDLError"
                      @input="$v.medicalForm.cholesterolLDL.$touch()"
                      @blur="$v.medicalForm.cholesterolLDL.$touch()"
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
                      v-model="medicalForm.cholesterolHDL"
                      outlined
                      suffix="mmol/l" 
                      @change="onHDLChange(medicalForm.cholesterolHDL)"
                      :error-messages="cholesterolHDLError"
                      @input="$v.medicalForm.cholesterolHDL.$touch()"
                      @blur="$v.medicalForm.cholesterolHDL.$touch()"
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
                      v-model="medicalForm.cholesterolTriglycerides"
                      outlined
                      suffix="mmol/l" 
                      @change="onTriglyceridesChange(medicalForm.cholesterolTriglycerides)"
                      :error-messages="cholesterolTriglyceridesError"
                      @input="$v.medicalForm.cholesterolTriglycerides.$touch()"
                      @blur="$v.medicalForm.cholesterolTriglycerides.$touch()"
                      ></v-text-field>
                      </v-card-text>
                  </v-card>
                  </v-col>
                  
                  <v-col cols="12">
                    <v-tabs v-model="tab">
                      <v-tab v-for="tab in tabs" :key="tab.tabName">{{ tab.tabName }}</v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                      <v-tab-item> <!-- ALLERGIES -->
                        <v-card >
                        <!-- Any Allergies -->
                        <v-col cols="12" md="12" lg="12">
                        <v-card flat>
                        <v-dialog v-model="dialogAllergies" persistent max-width="600px">
                        <template v-slot:activator="{ on, attrs }"> 
                        <v-card flat>
                            <v-card-title class="overline">
                              <v-spacer></v-spacer>
                              <v-btn 
                                small
                                v-bind="attrs"
                                v-on="on"
                              ><v-icon>mdi-plus</v-icon>
                              Add Allergy
                              </v-btn>
                            </v-card-title>
                          </v-card>
                        </template>
                        <v-card>
                        <v-form @submit.prevent="saveAllergy()">
                        <v-card-title class="primary lighten-1 white--text">Allergy
                        <v-spacer></v-spacer>
                          <v-btn class="mr-6" icon dark @click="cancel()"> 
                          <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
                          <span>Cancel</span>
                          </v-btn>
                        </v-card-title>
                          <v-card-text>
                            <v-container>
                              <v-row>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                label="Allergen Name*"
                                v-model.trim="allergyForm.allergyName"
                                :counter="25"
                                outlined
                                required
                                :error-messages="allergyNameErrors"
                                @input="$v.allergyForm.allergyName.$touch()"
                                @blur="$v.allergyForm.allergyName.$touch()"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-select
                                v-model="allergyForm.selectedAllergyType"
                                :items="allergyList"
                                label="Allergy Type*"
                                outlined
                                required
                                :error-messages="allergyTypeErrors"
                                @input="$v.allergyForm.selectedAllergyType.$touch()"
                                @blur="$v.allergyForm.selectedAllergyType.$touch()"
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-textarea
                                auto-grow
                                rows="1"
                                label="Details*"
                                v-model="allergyForm.allergyDetails"
                                :counter="150"
                                :maxlength="150"
                                outlined
                                required
                                :error-messages="allergyDetailsErrors"
                                @input="$v.allergyForm.allergyDetails.$touch()"
                                @blur="$v.allergyForm.allergyDetails.$touch()"
                                ></v-textarea>
                              </v-col>
                              <v-col cols="12" sm="6">
                                <v-select
                                v-model="allergyForm.selectedSeverity"
                                :items="severityList"
                                label="Severity*"
                                outlined
                                required
                                :error-messages="allergySeverityErrors"
                                @input="$v.allergyForm.selectedSeverity.$touch()"
                                @blur="$v.allergyForm.selectedSeverity.$touch()"
                                ></v-select>
                              </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                          <v-col cols="12" class="mt-n6">
                            <v-btn
                            type="submit"
                            block class="primary white--text"
                            @click.prevent="saveAllergy()">
                            <span>Add Allergy</span>
                            </v-btn>
                          </v-col>  
                          </v-card-actions>
                        </v-form>
                        </v-card>
                        </v-dialog>
                        </v-card>
                        </v-col> <!-- allergies end -->

                        <v-col cols="12" md="12">
                        <v-card outlined class="mt-2" v-for="(allergy, index) in allergies" :key="index">
                          <v-card-title class="primary lighten-1 white--text">
                            <v-icon class="mr-4 white--text">fa-allergies</v-icon>
                            {{ allergy.allergyName }}
                          
                          <v-subheader class="overline primary lighten-1 white--text">
                          {{ allergy.allergyType }}
                          </v-subheader>
                            <v-spacer></v-spacer>
                            <!--  DELETE  ALLERGY -->
                            <v-icon right @click="deleteAllergy(allergy)">fa-trash</v-icon>
                          </v-card-title>
                            <v-card-text>
                                  <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-list>
                                        <v-list-item>
                                          <v-list-item-content>
                                            <v-list-item-title 
                                            class="overline grey--text mb-4">Severity
                                            </v-list-item-title>
                                            <h3>{{ allergy.allergySeverity }}</h3>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                      <v-list>
                                        <v-list-item>
                                          <v-list-item-content>
                                            <v-list-item-title 
                                            class="overline grey--text mb-4">Descirption
                                            </v-list-item-title>
                                            <h3>{{ allergy.allergyDetails }}</h3> 
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-col></v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        </v-card>
                </v-tab-item>
                <v-tab-item> <!-- CONDITIONS -->
                <v-card>
                <!-- Any Conditions -->
                <v-col cols="12" md="12" lg="12">
                  <v-card flat>
                  <v-dialog v-model="dialogConditions" persistent max-width="600px">
                  <template v-slot:activator="{ on, attrs }"> 
                  <v-card flat>
                      <v-card-title class="overline">
                        <v-spacer></v-spacer>
                        <v-btn 
                          small
                          v-bind="attrs"
                          v-on="on"
                        ><v-icon>mdi-plus</v-icon>
                        Add Condition
                        </v-btn>
                      </v-card-title>
                    </v-card>
                  </template>
                    <v-card>
                    <v-form @submit.prevent="saveCondition()">
                    <v-card-title class="primary lighten-1 white--text">Condition
                    <v-spacer></v-spacer>
                      <v-btn class="mr-6" icon dark @click="cancel()"> 
                      <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
                      <span>Cancel</span>
                      </v-btn>
                    </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <v-autocomplete
                            label="Search Condition Name"
                            v-model="conditionForm.conditionName"
                            :items="conditionsList"
                            item-text="name"
                            item-value="value"
                            outlined
                            :error-messages="conditionNameErrors"
                            @input="$v.conditionForm.conditionName.$touch()"
                            @blur="$v.conditionForm.conditionName.$touch()"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-textarea
                            auto-grow
                            rows="1"
                            label="Details*"
                            v-model.trim="conditionForm.conditionDetails"
                            :counter="150"
                            :maxlength="150"
                            outlined
                            required
                            :error-messages="conditionDetailsErrors"
                            @input="$v.conditionForm.conditionDetails.$touch()"
                            @blur="$v.conditionForm.conditionDetails.$touch()"
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <v-menu
                            v-model="menu"
                            :close-on-content-click="false"
                            max-width="290"
                            >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            label="Select Date*"
                            readonly
                            :value="conditionForm.conditionDate"
                            v-bind="attrs"
                            v-on="on"
                            required
                            outlined
                            :error-messages="conditionDateErrors"
                            @input="$v.conditionForm.conditionDate.$touch()"
                            @blur="$v.conditionForm.conditionDate.$touch()"
                            @click:clear="conditionForm.conditionDate = null"
                            ></v-text-field>
                            </template>
                            <v-date-picker 
                            full-width
                            scrollable
                            show-current
                            :min="getUsersDob()"
                            :max="getTodaysDate()"
                            v-model="conditionForm.conditionDate" 
                            @input="menu = false"
                            >
                            </v-date-picker>
                            </v-menu>
                          </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                      <v-col cols="12" class="mt-n6">
                          <v-btn
                          block class="primary white--text"
                          @click.prevent="saveCondition()">
                          <span>Add Condition</span>
                          </v-btn>
                      </v-col>
                      </v-card-actions>
                    </v-form>
                        <v-snackbar 
                        :color= "color"
                        v-model="snackbar" 
                        :timeout="timeout" 
                        :multi-line="multiLine"
                        > {{ snackbarText }} 
                        </v-snackbar>
                    </v-card>
                  </v-dialog>
                  </v-card>
                  </v-col> <!-- conditions end -->

                  <v-col cols="12" md="12">
                    <v-card outlined class="mt-2" v-for="(condition, index) in conditions" :key="index">
                      <v-card-title class="primary lighten-1 white--text">
                        <v-icon class="mr-4 white--text">fa-file-medical-alt</v-icon>
                        {{ condition.conditionName }}
                        <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
                        <v-spacer></v-spacer>
                        <!--  DELETE  CONDITION -->
                        <v-icon right @click="deleteCondition(condition)">fa-trash</v-icon>
                      </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-list>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title 
                                    class="overline grey--text mb-4">Date of Diagnosis
                                    </v-list-item-title>
                                    <h3>{{ condition.conditionDate }}</h3>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-list>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title 
                                    class="overline grey--text mb-4">Description
                                    </v-list-item-title>
                                    <h3>{{ condition.conditionDetails }}</h3>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
              </v-card>
            </v-tab-item>
            <v-tab-item><!-- immunisations --> 
            <v-card>
            <v-col cols="12" md="12" lg="12">
            <v-card flat>
              <v-dialog v-model="dialogImmunisation" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }"> 
                <v-card flat>
                    <v-card-title class="overline">
                        <v-spacer></v-spacer>
                        <v-btn 
                        small
                        v-bind="attrs"
                        v-on="on"
                        ><v-icon>mdi-plus</v-icon>
                        Add immunisation
                        </v-btn>
                    </v-card-title>
                    </v-card>
                </template>
                    <v-card>
                    <v-form @submit.prevent="saveImmunisation()">
                    <v-card-title class="primary lighten-1 white--text">Immunisation
                    <v-spacer></v-spacer>
                        <v-btn class="mr-6" icon dark @click="cancel()"> 
                        <v-icon class="mx-2" fab dark color="white--text darken-1 ">fa-window-close</v-icon>
                        <span>Cancel</span>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                      <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-autocomplete
                        label="Search Immunisations*"
                        v-model="immunisationForm.selectedImmunisation"
                        :items="immunisationsList"
                        :filter="customFilter"
                        item-text="name"
                        item-value="value"
                        persistent-hint
                        hint="Immunisation Name Or Abbreviation"
                        outlined
                        :error-messages="selectedImmunisationErrors"
                        @input="$v.immunisationForm.selectedImmunisation.$touch()"
                        @blur="$v.immunisationForm.selectedImmunisation.$touch()"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        max-width="290"
                        >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                        label="Select Date*"
                        readonly
                        :value="immunisationForm.immunisationDate"
                        v-bind="attrs"
                        v-on="on"
                        required
                        outlined
                        :error-messages="immunisationDateErrors"
                        @input="$v.immunisationForm.immunisationDate.$touch()"
                        @blur="$v.immunisationForm.immunisationDate.$touch()"
                        @click:clear="immunisationForm.immunisationDate = null"
                        
                        ></v-text-field>
                        </template>
                        <v-date-picker 
                        full-width
                        scrollable
                        show-current
                        :min="getUsersDob()"
                        :max="getTodaysDate()"
                        v-model="immunisationForm.immunisationDate" 
                        @input="menu2 = false"
                        >
                        </v-date-picker>
                        </v-menu>
                      </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                          label="Reaction"
                          v-model="immunisationForm.immunisationReaction"
                          :items="reactionList"
                          outlined
                          required
                          :error-messages="immunisationReactionErrors"
                          @input="$v.immunisationForm.immunisationReaction.$touch()"
                          @blur="$v.immunisationForm.immunisationReaction.$touch()"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-textarea
                            auto-grow
                            rows="2"
                            name="immunisationForm.immunisationDetails"
                            label="Additional Details"
                            v-model="immunisationForm.immunisationDetails"
                            :counter="150"
                            :maxlength="150"
                            required
                            outlined
                            :error-messages="additionalDetailsError"
                            @input="$v.immunisationForm.immunisationDetails.$touch()"
                            @blur="$v.immunisationForm.immunisationDetails.$touch()"
                            ></v-textarea>
                        </v-col>
                        </v-row>
                    </v-container>
                    </v-card-text>
                        <v-card-actions>
                        <v-col cols="12" class="mt-n6">
                            <v-btn
                            type="submit"
                            block class="primary white--text"
                            @click.prevent="saveImmunisation()">
                            <span>Add Immunisation</span>
                            </v-btn>
                        </v-col>  
                        </v-card-actions>
                    </v-form>
                        <v-snackbar 
                        :color= "color"
                        v-model="snackbar" 
                        :timeout="timeout" 
                        :multi-line="multiLine"
                        > {{ snackbarText }} 
                        </v-snackbar>
                    </v-card>
                </v-dialog>
                </v-card>
            </v-col>

            
            <v-col cols="12" md="12">
            <v-card outlined class="mt-2" v-for="(immunisation, index) in immunisations" :key="index">
              <v-card-title class="primary lighten-1 white--text">
                <v-icon class="mr-4 white--text">fa-syringe</v-icon>
                {{ immunisation.immunisationName }}
                <v-subheader class="overline primary lighten-1 white--text"></v-subheader>
                <v-spacer></v-spacer>
                <!--  DELETE  IMMUNISATION -->
                  <v-icon right @click="deleteImmunisation(immunisation)">fa-trash</v-icon>
              </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title 
                            class="overline grey--text mb-4">Date Received
                            </v-list-item-title>
                            <h3>{{ immunisation.immunisationDate }}</h3>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title 
                            class="overline grey--text mb-4">Reaction
                            </v-list-item-title>
                            <h3>{{ immunisation.immunisationsReaction }}</h3>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title 
                            class="overline grey--text mb-4">Additional Details
                            </v-list-item-title>
                            <h3>{{ immunisation.immunisationDetails }}</h3>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            </v-card>
          </v-tab-item>
          </v-tabs-items>
          </v-col>
          <v-snackbar
            :color="color"
            v-model="snackbar"
            :timeout="timeout"
            :multi-line="multiLine"
          >{{ snackbarText }}
          </v-snackbar>
          </v-row>
        </v-card-text>
        </v-form>
        </v-card>
        </v-col></v-row>
      </v-card>
    </v-dialog>

  </v-col>
</v-container>
</template>

<script>
import DoctorNavbar from '../components/Navbars/DoctorNavbar'
import Allergies from '../components/MedicalRecord/Allergies'
import Conditions from '../components/MedicalRecord/Conditions'
import Immunisations from '../components/MedicalRecord/Immunisations'
import { auth, db, fieldValue } from '../firebase'
import { required, numeric, minLength, between } from 'vuelidate/lib/validators'

export default {
  components: {
    DoctorNavbar,
    Allergies,
    Conditions,
    Immunisations,
  },
  created () {
    this.currentUser = auth.currentUser.uid // Get current users ID

    // Gets the patients through roles by filtering only patient roles IDs
    db.collection("roles").get().then(snap => {
    snap.forEach(doc => {
      let user = doc.data()
      // if user is not doctor or admin retrieve the record
      if (!user.role.admin && !user.role.doctor) {
        // Then set user.id to the doc.id to refer back to their record in users
        user.id = doc.id
        db.collection("users").doc(user.id).get().then(doc => {
            let patientRecord = doc.data()
            patientRecord.id = doc.id
            // Set the patient info for the data table
            let patient = {
              id: patientRecord.id,
              name: patientRecord.firstname + ' ' + patientRecord.surname,
              dob: patientRecord.date,
              gender: patientRecord.gender,
              ppsn: patientRecord.ppsn
            }
            this.patients.push(patient) // Store the patient info to the patients array
        })
      }
    })
    })

  },
  computed: {
    weightError () {
      const errors = []
      if(!this.$v.medicalForm.weight.$dirty) return errors
        !this.$v.medicalForm.weight.required && errors.push('Empty Fields Will Not Save')
        !this.$v.medicalForm.weight.numeric && errors.push('Only Numeric Values Will Save')
      return errors
    },
    heightError () {
      const errors = []
      if(!this.$v.medicalForm.height.$dirty) return errors
        !this.$v.medicalForm.height.required && errors.push('Empty Fields Will Not Save')
        !this.$v.medicalForm.height.numeric && errors.push('Only Numeric Values Will Save')
      return errors
    },
    pulseError () {
      const errors = []
      if(!this.$v.medicalForm.pulse.$dirty) return errors
        !this.$v.medicalForm.pulse.required && errors.push('Empty Fields Will Not Save')
        !this.$v.medicalForm.pulse.numeric && errors.push('Only Numeric Values Will Save')
        !this.$v.medicalForm.pulse.minLength && errors.push('Minimum Pulse Should Be In Double Digits')
        !this.$v.medicalForm.pulse.between && errors.push('Pulse Should Be Between Values 60 To 120')
      return errors
    },
    systolicError () {
      const errors = []
      if(!this.$v.medicalForm.systolic.$dirty) return errors
        !this.$v.medicalForm.systolic.required && errors.push('Empty Fields Will Not Save')
        !this.$v.medicalForm.systolic.numeric && errors.push('Only Numeric Values Will Save')
        !this.$v.medicalForm.systolic.minLength && errors.push('Systolic Should Be In Double Digits')
        !this.$v.medicalForm.systolic.between && errors.push('Systolic Should Be Between Values 70 To 190')
      return errors
    },
    diastolicError () {
      const errors = []
      if(!this.$v.medicalForm.diastolic.$dirty) return errors
        !this.$v.medicalForm.diastolic.required && errors.push('Empty Fields Will Not Save')
        !this.$v.medicalForm.diastolic.numeric && errors.push('Only Numeric Values Will Save')
        !this.$v.medicalForm.diastolic.minLength && errors.push('Diastolic Should Be In Double Digits')
        !this.$v.medicalForm.diastolic.between && errors.push('Diastolic Should Be Between Values 40 To 100')
      return errors
    },
    bloodGlucoseLevelError () {
      const errors = []
      if(!this.$v.medicalForm.bloodGlucoseLevel.$dirty) return errors
        !this.$v.medicalForm.bloodGlucoseLevel.required && errors.push('Empty Fields Will Not Save')
      return errors
    },
    cholesterolError () {
      const errors = []
      if(!this.$v.medicalForm.cholesterol.$dirty) return errors
        !this.$v.medicalForm.cholesterol.required && errors.push('Empty Fields Will Not Save')
      return errors
    },
    cholesterolLDLError () {
      const errors = []
      if(!this.$v.medicalForm.cholesterolLDL.$dirty) return errors
        !this.$v.medicalForm.cholesterolLDL.required && errors.push('Empty Fields Will Not Save')
      return errors
    },
    cholesterolHDLError () {
      const errors = []
      if(!this.$v.medicalForm.cholesterolHDL.$dirty) return errors
        !this.$v.medicalForm.cholesterolHDL.required && errors.push('Empty Fields Will Not Save')
      return errors
    },
    cholesterolTriglyceridesError () {
      const errors = []
      if(!this.$v.medicalForm.cholesterolTriglycerides.$dirty) return errors
        !this.$v.medicalForm.cholesterolTriglycerides.required && errors.push('Empty Fields Will Not Save')
      return errors
    },




    allergyNameErrors () {
      const errors = []
      if(!this.$v.allergyForm.allergyName.$dirty) return errors
        !this.$v.allergyForm.allergyName.required && errors.push('An Allergy Name Is Required')
      return errors
    },
    allergyTypeErrors () {
      const errors = []
      if(!this.$v.allergyForm.selectedAllergyType.$dirty) return errors
          !this.$v.allergyForm.selectedAllergyType.required && errors.push('Select The Type Of Allergy')
      return errors
    },
    allergyDetailsErrors () {
      const errors = []
      if(!this.$v.allergyForm.allergyDetails.$dirty) return errors
          !this.$v.allergyForm.allergyDetails.required && errors.push('Include Some Details About Your Allergy')
      return errors
    },
    allergySeverityErrors () {
      const errors = []
      if(!this.$v.allergyForm.selectedSeverity.$dirty) return errors
          !this.$v.allergyForm.selectedSeverity.required && errors.push('Select The Severity Of Your Allergy')
      return errors
    },
    conditionNameErrors () {
    const errors = []
    if(!this.$v.conditionForm.conditionName.$dirty) return errors
        !this.$v.conditionForm.conditionName.required && errors.push('A Condition Name Is Required')
    return errors
    },
    conditionDetailsErrors () {
    const errors = []
    if(!this.$v.conditionForm.conditionDetails.$dirty) return errors
        !this.$v.conditionForm.conditionDetails.required && errors.push('Include Some Details About Your Condition')
    return errors
    },
    conditionDateErrors () {
    const errors = []
    if(!this.$v.conditionForm.conditionDate.$dirty) return errors
        !this.$v.conditionForm.conditionDate.required && errors.push('Select Date Of Condition Diagnosis')
    return errors
    },
    selectedImmunisationErrors () {
    const errors = []
    if(!this.$v.immunisationForm.selectedImmunisation.$dirty) return errors
        !this.$v.immunisationForm.selectedImmunisation.required && errors.push('Select An Immunisation')
    return errors
    },
    immunisationDateErrors () {
    const errors = []
    if(!this.$v.immunisationForm.immunisationDate.$dirty) return errors
        !this.$v.immunisationForm.immunisationDate.required && errors.push('Select Date Of Immunisation')
    return errors
    },
    immunisationReactionErrors () {
    const errors = []
    if(!this.$v.immunisationForm.immunisationReaction.$dirty) return errors
        !this.$v.immunisationForm.immunisationReaction.required && errors.push('Select Your Reaction To the Immunisation')
    return errors
    },
    additionalDetailsError () {
    const errors = []
    if(!this.$v.immunisationForm.immunisationDetails.$dirty) return errors
        !this.$v.immunisationForm.immunisationDetails.required && errors.push('Include Additional Details Of Immunisation')
    return errors
    },
  },
  data() {
    return {
      currentUser: null, // Used to store the current logged in user
      patientID: null, // Store the patient ID when doctor clicks on actions
      dialog: false,
      snackbar: false,
      color: null,
      multiLine: true,
      timeout: 5000,
      snackbarText: "",

      patients: [], // Patients array for data table
      patient: null, // Individual patient info
      search: '', // Search bar 
      /// Headers define the labels for the data table and the values take the values from patient
      headers: [
        { text: 'Patient Name', value: 'name' },
        { text: 'DoB', value: 'dob'},
        { text: 'Gender', value: 'gender' },
        { text: 'PPSN', value: 'ppsn' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      gender: null, // Gender value passes from db to buttons and highlights active one
      selectedBlood: null, // Used to store the selected blood type
      bloods: [
        {text: 'None'},
        {text: 'A Positive'},
        {text: 'A Negative'},
        {text: 'B Positive'},
        {text: 'B Negative'},
        {text: 'O Positive'},
        {text: 'O Negative'},
        {text: 'AB Positive'},
        {text: 'AB Negative'},
      ],

      medicalForm: {
        weight: null, // Used to store weight
        height: null, // Used to store height
        pulse: null,  // Used to store pulse
        systolic: null, // Used to store systolic
        diastolic: null, // Used to store diastolic
        bloodGlucoseLevel: null, // Used to store bloodGlucoseLevel
        cholesterol: null, // Used to store cholesterol
        cholesterolLDL: null, // Used to store cholesterolLDL
        cholesterolHDL: null, // Used to store cholesterolHDL
        cholesterolTriglycerides: null, // Used to store cholesterolTriglycerides
      },

      allergies: [], // Store allergies here to display to user
      conditions: [], // Store conditions here to display to user
      immunisations: [], // Store immunisations here to display to user
      // Tabs for upcoming and past
      tab: null,
      tabs: [
      { tabName: 'Allergies' },
      { tabName: 'Conditions' },
      { tabName: 'Immunisations' },
      ],
      // Everything for Allergies
      dialogAllergies: false,
      allergyList: [
          { text: 'Drug Allergy', value: 'Drug Allergy'},
          { text: 'Food Allergy', value: 'Food Allergy'},
          { text: 'Pollen Allergy', value: 'Pollen Allergy'},
          { text: 'Insect Allergy', value: 'Insect Allergy'},
          { text: 'Latex Allergy', value: 'Latex Allergy'},
          { text: 'Other', value: 'Other'}, 
      ],
      severityList: [
          { text: 'Mild', value: 'Mild'},
          { text: 'Moderate', value: 'Moderate'},
          { text: 'Severe', value: 'Severe'},
          { text: 'Life Threatening', value: 'Life Threatening'},
          ],
      allergyForm: {
          allergyName: null,
          selectedAllergyType: null, // Value holds the allergy selected by the user
          allergyDetails: null, // Value holds user details
          selectedSeverity: null, // Value holds the severity selected by the user
      },
      // Everything for Conditions
      dialogConditions: false,
      menu: false,
      // Condition Name Autocomplete Selection Field Name & Values
      conditionsList: [
        { name: 'Alzheimer`s Disease', value: 'Alzheimer`s Disease'},
        { name: 'Anemia', value: 'Anemia'},
        { name: 'Anxiety Disorder', value: 'Anxiety Disorder'},
        { name: 'Asthma', value: 'Asthma'},
        { name: 'Atopic Dermatitis', value: 'Atopic Dermatitis'},
        { name: 'Atrial Fibrillation', value: 'Atrial Fibrillation'},
        { name: 'Attention Deficit Hyperactivity Disorder', value: 'Attention Deficit Hyperactivity Disorder'},
        { name: 'Autism or Asperger`s Syndrome', value: 'Autism or Asperger`s Syndrome'},
        { name: 'Bipolar Mood Disorder', value: 'Bipolar Mood Disorder'},
        { name: 'Bronchiectasis', value: 'Bronchiectasis'},
        { name: 'Cancer', value: 'Cancer'},
        { name: 'Cardiac Failure', value: 'Cardiac Failure'},
        { name: 'Cardiomyopathy', value: 'Cardiomyopathy'},
        { name: 'Cerebral Palsy', value: 'Cerebral Palsy'},
        { name: 'Cerebrovascular Disease', value: 'Cerebrovascular Disease'},
        { name: 'Chronic Fatigue Syndrome', value: 'Chronic Fatigue Syndrome'},
        { name: 'Chronic Hepatitis', value: 'Chronic Hepatitis'},
        { name: 'Chronic Kidney Disease', value: 'Chronic Kidney Disease'},
        { name: 'Chronic Obstructive Pulmonary Disorder', value: 'Chronic Obstructive Pulmonary Disorder'},
        { name: 'Chronic Renal Disease', value: 'Chronic Renal Disease'},
        { name: 'Coeliac Disease', value: 'Coeliac Disease'},
        { name: 'Complex Regional Pain Syndrome', value: 'Complex Regional Pain Syndrome'},
        { name: 'Coronary Artery Disease', value: 'Coronary Artery Disease'},
        { name: 'Crohn`s Disease', value: 'Crohn`s Disease'},
        { name: 'Deafness & Hearing Impairment', value: 'Deafness & Hearing Impairment'},
        { name: 'Dermatological Conditions', value: 'Dermatological Conditions'},
        { name: 'Diabetes Insipidus', value: 'Diabetes Insipidus'},
        { name: 'Diabetes Mellitus Types 1 & 2', value: 'Diabetes Mellitus Types 1 & 2'},
        { name: 'Dysrhythmias', value: 'Dysrhythmias'},
        { name: 'Ehlers-Danlos Syndrome', value: 'Ehlers-Danlos Syndrome'},
        { name: 'Endometriosis', value: 'Endometriosis'},
        { name: 'Epilepsy', value: 'Epilepsy'},
        { name: 'Fetal Alcohol Spectrum Disorder', value: 'Fetal Alcohol Spectrum Disorder'},
        { name: 'Fibromyalgia', value: 'Fibromyalgia'},
        { name: 'Gestational Diabetes', value: 'Gestational Diabetes'},
        { name: 'Glaucoma  ', value: 'Glaucoma  '},
        { name: 'Haemophilia', value: 'Haemophilia'},
        { name: 'Hashimoto`s Thyroiditis / Hashimoto`s Disease', value: 'Hashimoto`s Thyroiditis / Hashimoto`s Disease'},
        { name: 'HIV/AIDS', value: 'HIV/AIDS'},
        { name: 'Huntington`s Disease', value: 'Huntington`s Disease'},
        { name: 'Hyperlipidaemia', value: 'Hyperlipidaemia'},
        { name: 'Hypertension', value: 'Hypertension'},
        { name: 'Hypothyroidism', value: 'Hypothyroidism'},
        { name: 'Ischemic Cardiomyopathy', value: 'Ischemic Cardiomyopathy'},
        { name: 'Mental Illness', value: 'Mental Illness'},
        { name: 'Migraines', value: 'Migraines'},
        { name: 'Multiple Sclerosis', value: 'Multiple Sclerosis'},
        { name: 'Myasthenia Gravis', value: 'Myasthenia Gravis'},
        { name: 'Narcolepsy', value: 'Narcolepsy'},
        { name: 'Obesity', value: 'Obesity'},
        { name: 'Osteoarthritis', value: 'Osteoarthritis'},
        { name: 'Osteoporosis', value: 'Osteoporosis'},
        { name: 'Parkinson`s Disease', value: 'Parkinson`s Disease'},
        { name: 'Periodontal Disease', value: 'Periodontal Disease'},
        { name: 'Polycystic Ovary Syndrome', value: 'Polycystic Ovary Syndrome'},
        { name: 'Postural Orthostatic Tachycardia Syndrome', value: 'Postural Orthostatic Tachycardia Syndrome'},
        { name: 'Post-Vasectomy Pain Syndrome', value: 'Post-Vasectomy Pain Syndrome'},
        { name: 'Pre-Diabetes', value: 'Pre-Diabetes'},
        { name: 'Psoriasis', value: 'Psoriasis'},
        { name: 'Relapsing Polychondritis', value: 'Relapsing Polychondritis'},
        { name: 'Rheumatoid Arthritis', value: 'Rheumatoid Arthritis'},
        { name: 'Schizophrenia', value: 'Schizophrenia'},
        { name: 'Sleep Apnea', value: 'Sleep Apnea'},
        { name: 'Substance Abuse Disorders', value: 'Substance Abuse Disorders'},
        { name: 'Systemic Lupus Erythematosus', value: 'Systemic Lupus Erythematosus'},
        { name: 'Thyroid Disease', value: 'Thyroid Disease'},
        { name: 'Ulcerative Colitis', value: 'Ulcerative Colitis'},
      ],
      conditionForm: {
      condtionName: null,
      conditionDetails: null,
      conditionDate: null,
      },
      // Everything for Immunisations
      dialogImmunisation: false,
      menu2: false,
      selectedImmunisation: null,
      immunisationsList: [
          { name: 'Anthrax Vaccine Adsorbed', abbr: 'AVA', value: 'Anthrax Vaccine Adsorbed', id: 1 },
          { name: 'Bacille Calmette-Guérin (Tuberculosis) Vaccine', abbr: 'BCG', value: 'Bacille Calmette-Guérin (Tuberculosis) Vaccine', id: 2},
          { name: 'Diphtheria, Tetanus & Pertussis Vaccine', abbr: 'DTaP', value: 'Diphtheria, Tetanus & Pertussis / Whopping Cough Vaccine', id: 3},
          { name: 'Hepatitis A Vaccine', abbr: 'HepA', value: 'Hepatitis A Vaccine', id: 4 },
          { name: 'Hepatitis B Vaccine', abbr: 'HepB', value: 'Hepatitis B Vaccine', id: 5 },
          { name: 'Haemophilus Influenzae Type B', abbr: 'Hib', value: 'Haemophilus Influenzae Type B', id: 6 },
          { name: 'Human Papillomavirus', abbr: 'HPV', value: 'Human Papillomavirus', id: 7 },
          { name: 'Inactivated Poliovirus Vaccine', abbr: 'IPV', value: 'Inactivated Poliovirus Vaccine', id: 8 },
          { name: 'Inactivated Influenza Vaccine', abbr: 'IIV', value: 'Inactivated Influenza Vaccine', id: 9 },
          { name: 'Japanese Encephalitis', abbr: 'JE', value: 'Japanese Encephalitis', id: 10 },
          { name: 'Live, Attenuated Influenza Vaccine (Quadrivalent)', abbr: 'LAIV4	', value:  'Live, Attenuated Influenza Vaccine (Quadrivalent)', id: 11 },
          { name: 'Meningococcal A, C, W, Y', abbr: 'MenACWY', value: 'Meningococcal A, C, W, Y', id: 12 },
          { name: 'Meningococcal B', abbr: 'MenB', value: 'Meningococcal B', id: 13 },
          { name: 'Measles, Mumps, & Rubella', abbr: 'MMR', value: 'Measles, Mumps, & Rubella', id: 14 },
          { name: 'Measles-Rubella Vaccine', abbr: 'MR', value: 'Measles-Rubella Vaccine', id: 15 },
          { name: 'Pneumococcal Conjugate Vaccine', abbr: 'PCV13', value: 'Pneumococcal Conjugate Vaccine', id: 16 },
          { name: 'Pneumococcal Polysaccharide Vaccine', abbr: 'PPSV23', value: 'Pneumococcal Polysaccharide Vaccine', id: 17 },
          { name: 'Recombinant Influenza Vaccine', abbr: 'RIV3', value: 'Recombinant Influenza Vaccine', id: 18 },
          { name: 'Rotavirus Vaccine', abbr: 'ROTA', value: 'Rotavirus Vaccine', id: 19 },
          { name: 'Recombinant Zoster Vaccine', abbr: 'RZV', value: 'Recombinant Zoster Vaccine', id: 20 },
          { name: 'Tetanus & Diphtheria Vaccine', abbr: 'Td', value: 'Tetanus & Diphtheria Vaccine', id: 21 },
          { name: 'Tetanus, Diphtheria & Acellular Pertussis Vaccine', abbr: 'Tdap', value: 'Tetanus, Diphtheria & Acellular Pertussis Vaccine', id: 22 },
          { name: 'Varicella Vaccine', abbr: 'VAR', value: 'Varicella Vaccine', id: 23 },
          { name: 'Varicella Zoster Virus', abbr: 'VZV', value: 'Varicella Zoster Virus', id: 24 },
          { name: 'Yellow Fever', abbr: 'YF', value: 'Yellow Fever', id: 25 },
          { name: 'Zoster Vaccine Live', abbr: 'ZVL', value: 'Zoster Vaccine Live', id: 26 },       
      ],
      reactionList: [
          { text: 'None', value: 'None'},
          { text: 'Pain', value: 'Pain'},
          { text: 'Swelling', value: 'Swelling'},
          { text: 'Redness', value: 'Redness'},
          { text: 'Fever', value: 'Fever'},
          { text: 'Irritability', value: 'Irritability'},
          { text: 'Malaise', value: 'Malaise'},
          { text: 'Systemic Symptoms', value: 'Systemic Symptoms'},  
      ],
      immunisationForm: {
          immunisationSelected: null,
          immunisationDate: null,
          immunisationReaction: null,
          immunisationDetails: null
      },
   }
  },
  validations: {
    medicalForm: {
      weight: { required, numeric },
      height: { required, numeric },
      pulse: { required, numeric, minLength: minLength(2), between: between(60, 120) },
      systolic: { required, numeric, minLength: minLength(2), between: between(70, 190) },
      diastolic: { required, numeric, minLength: minLength(2), between: between(40, 100) },
      bloodGlucoseLevel: { required },
      cholesterol: { required },
      cholesterolLDL: { required },
      cholesterolHDL: { required },
      cholesterolTriglycerides: { required },
  
   },

   allergyForm: {
      allergyName: { required },
      selectedAllergyType: { required },
      allergyDetails: { required },
      selectedSeverity: { required },
    },
    conditionForm: {
      conditionName: { required },
      conditionDetails: { required },
      conditionDate: { required }
    },
    immunisationForm: {
      selectedImmunisation: { required },
      immunisationDate: { required },
      immunisationReaction: { required },
      immunisationDetails: { required },
    }
  },
  methods: {
    storeID (id) {
      // Store the ID of the record of which the action is pressed on
      this.patientID = id
      db.collection("users").doc(this.patientID).onSnapshot(doc => {
        let patientInfo = doc.data()
        patientInfo.id = doc.id
        // Populate these values to display patient medical record fields that are currently holding info
        this.gender = patientInfo.gender
        this.selectedBlood = patientInfo.bloodType
        this.medicalForm.weight = patientInfo.weight
        this.medicalForm.height = patientInfo.height
        this.medicalForm.pulse = patientInfo.pulse
        this.medicalForm.systolic = patientInfo.systolic
        this.medicalForm.diastolic = patientInfo.diastolic
        this.medicalForm.bloodGlucoseLevel = patientInfo.bloodGlucoseLevel
        this.medicalForm.cholesterol = patientInfo.cholesterol
        this.medicalForm.cholesterolLDL = patientInfo.cholesterolLDL
        this.medicalForm.cholesterolHDL = patientInfo.cholesterolHDL
        this.medicalForm.cholesterolTriglycerides = patientInfo.cholesterolTriglycerides
        // Populate the arrays with corresponding data from users record
        this.allergies = patientInfo.allergy
        this.conditions = patientInfo.condition
        this.immunisations = patientInfo.immunisation
      })
    },
    onGenderChange (gender) {
      // Access the users collection then update gender value of patient
      db.collection("users").doc(this.patientID).get().then(() =>{
        if(gender != null){
          db.collection("users").doc(this.patientID).update({
            gender: gender
          })
        }
      })
    },
    onBloodsChange(selectedBlood) {
      // Access the users collection then update blood type of patient
      db.collection("users").doc(this.patientID).get().then(() =>{
        if(selectedBlood != null){
          db.collection("users").doc(this.patientID).update({
            bloodType: selectedBlood
          })
        }
      })
    },
    onWeightChange (weight) {
      // Check to see if entered data is dirty before updating the db
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.weight.$anyDirty
      this.errors = this.$v.medicalForm.weight.$anyError
      if(this.errors === false && this.formTouched === false){
         db.collection("users").doc(this.patientID).get().then(() =>{
        // Access the users collection then update weight of patient if not null
        if(weight != null){
          db.collection("users").doc(this.patientID).update({
            weight: weight
          })
        }
      })
      }
    },
    onHeightChange (height) {
      // Check to see if entered data is dirty before updating the db
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.height.$anyDirty
      this.errors = this.$v.medicalForm.height.$anyError
      if(this.errors === false && this.formTouched === false){
        // Access the users collection then update height of patient if not null
        db.collection("users").doc(this.patientID).get().then(() =>{
          if(height != null){
            db.collection("users").doc(this.patientID).update({
              height: height
            })
          }
        })
      }
    },    
    onPulseChange (pulse) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.pulse.$anyDirty
      this.errors = this.$v.medicalForm.pulse.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update pulse of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(pulse != null){
          db.collection("users").doc(this.patientID).update({
            pulse: pulse
          })
        }
      })
      }
    },
    onSystolicChange (systolic) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.systolic.$anyDirty
      this.errors = this.$v.medicalForm.systolic.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update systolic of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(systolic != null){
          db.collection("users").doc(this.patientID).update({
            systolic: systolic
          })
        }
      })
      }

    },
    onDiastolicChange (diastolic) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.diastolic.$anyDirty
      this.errors = this.$v.medicalForm.diastolic.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update diastolic of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(diastolic != null){
          db.collection("users").doc(this.patientID).update({
            diastolic: diastolic
          })
        }
      })
      }
    },
    onLevelChange (bloodGlucoseLevel) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.bloodGlucoseLevel.$anyDirty
      this.errors = this.$v.medicalForm.bloodGlucoseLevel.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update bloodGlucoseLevel of patient
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(bloodGlucoseLevel != null){
          db.collection("users").doc(this.patientID).update({
            bloodGlucoseLevel: bloodGlucoseLevel
          })
        }
      })
      }
    },
    onTotalCholChange (cholesterol) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.cholesterol.$anyDirty
      this.errors = this.$v.medicalForm.cholesterol.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update cholesterol of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterol != null){
          db.collection("users").doc(this.patientID).update({
            cholesterol: cholesterol
          })
        }
      })
      }
    },
    onLDLChange (cholesterolLDL) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.cholesterolLDL.$anyDirty
      this.errors = this.$v.medicalForm.cholesterolLDL.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update cholesterolLDL of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterolLDL != null){
          db.collection("users").doc(this.patientID).update({
            cholesterolLDL: cholesterolLDL
          })
        }
      })
      }
    },
    onHDLChange (cholesterolHDL) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.cholesterolHDL.$anyDirty
      this.errors = this.$v.medicalForm.cholesterolHDL.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update cholesterolHDL of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterolHDL != null){
          db.collection("users").doc(this.patientID).update({
            cholesterolHDL: cholesterolHDL
          })
        }
      })
      }
    },
    onTriglyceridesChange (cholesterolTriglycerides) {
      this.$v.$touch()
      this.formTouched = !this.$v.medicalForm.cholesterolTriglycerides.$anyDirty
      this.errors = this.$v.medicalForm.cholesterolTriglycerides.$anyError
      if(this.errors === false && this.formTouched === false){
      // Access the users collection then update cholesterolTriglycerides of patient 
      db.collection("users").doc(this.patientID).get().then(()=> {
        if(cholesterolTriglycerides != null){
          db.collection("users").doc(this.patientID).update({
            cholesterolTriglycerides: cholesterolTriglycerides
          })
        }
      })
      }
    },
    close() {
      this.$v.$reset()
      this.dialog = false
    },
    cancel() {
      this.snackbar = false
      this.dialogAllergies = false
      this.dialogConditions = false
      this.dialogImmunisation = false
      this.$v.$reset()
      this.allergyForm.allergyName = null
      this.allergyForm.selectedAllergyType = null
      this.allergyForm.allergyDetails = null
      this.allergyForm.selectedSeverity = null
      this.conditionForm.conditionName = null
      this.conditionForm.conditionDetails = null
      this.conditionForm.conditionDate = null
      this.immunisationForm.selectedImmunisation = null
      this.immunisationForm.immunisationDate = null
      this.immunisationForm.immunisationReaction = null
      this.immunisationForm.immunisationDetails = null  
    },
    saveAllergy () { 
      this.$v.$touch()
      this.formTouched = !this.$v.allergyForm.$anyDirty
      this.errors = this.$v.allergyForm.$anyError
          
      if(this.errors === false && this.formTouched === false){
          var addAllergy = {
          allergyName: this.allergyForm.allergyName,
          allergyType: this.allergyForm.selectedAllergyType,
          allergyDetails: this.allergyForm.allergyDetails,
          allergySeverity: this.allergyForm.selectedSeverity
          }
          var allergyRecord = { 
          allergy: fieldValue.arrayUnion(addAllergy)
          }
          this.triggerSnackbar("Allergy Was Successfully Added!", "success")
          db.collection("users").doc(this.patientID).update(allergyRecord).then(() => {
          // Clear the form values
          this.$v.$reset()
          this.allergyForm.allergyName = null
          this.allergyForm.selectedAllergyType = null
          this.allergyForm.allergyDetails = null
          this.allergyForm.selectedSeverity = null
          }).catch(error => {
          console.log(error)
          }).then(() => {
            this.dialogAllergies = false
            this.snackbar = false
          })
      }else{
          this.triggerSnackbar("There Are Errors Preventing You From Submitting This Form", "error")
      }
    },
    deleteAllergy(allergy){
      // Use arrayRemove to remove all instances of the record
      db.collection("users").doc(this.patientID).update({
        allergy: fieldValue.arrayRemove(allergy)
      })
    },
    saveCondition () {
      this.$v.$touch()
      this.formTouched = !this.$v.conditionForm.$anyDirty
      this.errors = this.$v.conditionForm.$anyError

      if(this.errors === false && this.formTouched === false){
          var addCondition = {
            conditionName: this.conditionForm.conditionName,
            conditionDetails: this.conditionForm.conditionDetails,
            conditionDate: this.conditionForm.conditionDate,
          }
          var conditionRecord = {
            condition: fieldValue.arrayUnion(addCondition)
          }
          this.triggerSnackbar("Condition Was Successfully Added!", "success")
          db.collection("users").doc(this.patientID).update(conditionRecord).then(() => {
              // Clear the form values
              this.$v.$reset()
              this.conditionForm.conditionName = null
              this.conditionForm.conditionDetails = null
              this.conditionForm.conditionDate = null
          }).catch(error => {
          console.log(error)
          }).then(() =>{
              this.dialogConditions = false
              this.snackbar = false
          })
      }
      else{
          this.triggerSnackbar("There Are Errors Preventing You From Submitting This Form", "error")
      }
    },   
    deleteCondition (condition) {
        // Use arrayRemove to remove all instances of the record
        db.collection("users").doc(this.patientID).update({
          condition: fieldValue.arrayRemove(condition)
      })
    },
    saveImmunisation () {
      this.$v.$touch()
      this.formTouched = !this.$v.immunisationForm.$anyDirty
      this.errors = this.$v.immunisationForm.$anyError
      if(this.errors === false && this.formTouched === false){
        var addImmunisation = {
            immunisationName: this.immunisationForm.selectedImmunisation,
            immunisationDate: this.immunisationForm.immunisationDate,
            immunisationsReaction: this.immunisationForm.immunisationReaction,
            immunisationDetails: this.immunisationForm.immunisationDetails,
        }
        var immunisationRecord = {
            immunisation: fieldValue.arrayUnion(addImmunisation)
        }
        this.triggerSnackbar("Immunisation Was Successfully Added!", "success")
        db.collection("users").doc(this.patientID).update(immunisationRecord).then(() => {
            this.$v.$reset()
            this.immunisationForm.selectedImmunisation = null
            this.immunisationForm.immunisationDate = null
            this.immunisationForm.immunisationReaction = null
            this.immunisationForm.immunisationDetails = null
        }).catch(error => {
            console.log(error)
        }).then(() => {
            this.dialogImmunisation = false
            this.snackbar = false
        })
      }else{
          this.triggerSnackbar("There Are Errors Preventing You From Submitting This Form", "error")
      }
    },
    deleteImmunisation (immunisation) {
      // Use arrayRemove to remove all instances of the record
      db.collection("users").doc(this.patientID).update({
        immunisation: fieldValue.arrayRemove(immunisation)
      })
    },
    triggerSnackbar (message, color) {
      this.snackbarText = message,
      this.color = color,
      this.snackbar = true
    },
    getUsersDob () {
      if(this.patientID != null){
        db.collection("users").doc(this.patientID).get().then(doc => {
          let patientRecord = doc.data()
          patientRecord.id = doc.id
        //   // Get DoB
          this.dob = patientRecord.date
        })
        return this.dob
      }    
    },
    getTodaysDate () {
      let today = new Date ()
      today.setDate(today.getDate())
      return today.toISOString()
    },
    customFilter (item, queryText) {
      const textOne = item.name.toLowerCase()
      const textTwo = item.abbr.toLowerCase()
      const searchText = queryText.toLowerCase()

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },  
  },
};
</script>