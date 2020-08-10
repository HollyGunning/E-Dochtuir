<template>
<v-row>
<v-col cols="12" md="12">

<!-- Contains the top toolbar with the today, prev, next btn options and a menu that switches the calendar view--> 
<v-sheet height="64">
    <v-toolbar  flat color="white">
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

<!-- Contains the main body of the caldendar -->
<v-sheet height="600">
    <v-calendar
    ref="calendar"
    v-model="focus"
    color="primary"
    :type="type"
    :events="events"
     @click:event="showEvent"
    @click:date="viewDay"
    >
    </v-calendar>
</v-sheet>

</v-col>
            
</v-row>
</template>

<script>
export default {
    data () {
        return{
            focus: '',
            type: 'month',
            typeToLabel: {
                month: 'Month',
                week: 'Week',
                day: 'Day',
            }
        }
    },
    mounted () {
        this.$refs.calendar.checkChange()
    },
    methods: {
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