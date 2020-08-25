<template>
    <v-row class="fill-height">
        <v-col>

        <!-- Contains the top toolbar with the today, prev, next btn options and a menu that switches the calendar view--> 
        <v-sheet height="64">
            <v-toolbar flat>
                <v-btn outlined color="primary" @click="setToday">Today</v-btn>
                <v-btn fab text small color="primary" @click="prev">
                    <v-icon small >mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small color="primary" @click="next">
                    <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title  }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                        outlined
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                        >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>
                        <v-list>
                            <v-list-item @click="type = 'day'">
                                <v-list-item-title>Day</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'week'">
                                <v-list-item-title>Week</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'month'">
                                <v-list-item-title>Month</v-list-item-title>
                            </v-list-item>
                        </v-list>
                </v-menu>
            </v-toolbar>
        </v-sheet>

        <v-sheet height="500">
            <v-calendar
            ref="calendar"
            color="primary"
            :type="type"
            v-model="focus"
            :events="events"
            @click:date="viewDay"
            @click:event="showEvent"
            >
            </v-calendar>

                <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
                >
                <v-card
                color="grey lighten-4"
                min-width="350px"
                flat
                >
                <v-toolbar class="primary"
                :color="selectedEvent.color"
                dark
                >
          
                <v-toolbar-title class="primary white--text" v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                text
                color="white"
                @click="selectedOpen = false"
                >
                Cancel
                </v-btn>
                </v-toolbar>
                <v-card-text>
                <span v-html="selectedEvent.details"></span>
                </v-card-text>
                <v-card-actions>
            
                </v-card-actions>
                </v-card>
                </v-menu>

        </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
import { auth, db } from '../firebase'

export default {
    data() {
        return {
            focus: '',
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
            },

            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
        }
    },
    mounted() {
        this.getAppointments()
    },
    methods: {
        getAppointments () {
            // Set current user to the currently logged in user
            var currentUser = auth.currentUser.uid
            db.collection("appointments").where("doctorID", "==", currentUser).onSnapshot( snap => {
                let appointment = snap.docChanges()
                appointment.forEach(appointment => { 
                    let record = appointment.doc.data()
                
                    let time = record.appointmentTime.replace(".", ":")
                    let endTime = time.substr(0, time.length -2)
                    let endTimeMinutes = time.substr(time.length -2, 2)
                    endTime = endTime + (parseInt(endTimeMinutes) + 25)

                    let event = {
                        name: record.firstname + ' ' + record.surname,
                        details : record.appointmentDetails,
                        start: record.appointmentDate + " " + time,
                        end: record.appointmentDate + " " + endTime
                    }
                    this.events.push(event)
                  
                
                })
            })
        },

        viewDay ({ date }) {
            this.focus = date
            this.type = 'day'
      },
        setToday () {
            this.focus = ''
        },
        prev () {
            this.$refs.calendar.prev()
        },
        next () {
            this.$refs.calendar.next()
        },

        showEvent ({ nativeEvent, event }) {
            const open = () => {
            this.selectedEvent = event
            this.selectedElement = nativeEvent.target
            setTimeout(() => this.selectedOpen = true, 10)
            }

            if (this.selectedOpen) {
            this.selectedOpen = false
            setTimeout(open, 10)
            } else {
            open()
            }

            nativeEvent.stopPropagation()
      },
    },
}
</script>