<template>
<v-container>
<DoctorNavbar />
    <v-card v-if="joinRoom">
        <v-card-title></v-card-title>
        <v-card-text>
        <v-row>
            <v-col cols="12" sm="6" md="6" lg="6">
            <v-select 
            label="Todays Patients"
            :items="patients"
            item-text="name"
            item-value="value"
            outlined
            @change="onPatientChanged($event)"
            ></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="4">
            <v-btn 
            class="primary white--text"
            block 
            @click="createRoom()"
            >
            Join Room
            </v-btn>
            </v-col>
        </v-row>
        </v-card-text>
    </v-card>

    <v-card v-if="closeRoom">
        <v-card-text>
            <v-row>
            <v-col cols="12" sm="4" md="4" lg="4">
                <v-btn 
                class="primary white--text"
                block 
                @click="destroyRoom()"
                >
                Close Room
                </v-btn>
            </v-col>
            </v-row>
        </v-card-text>
    </v-card>
  
    <!-- Chat Card -->
    <v-card v-if="chatRoom" class="mt-6 mb-9">
        <v-card-title class="primary lighten-1 white--text">Online Consultation</v-card-title>
        <v-container>
        <v-card outlined class="messages">
            <v-card-text class="chat-message" v-for="(message, index) in messages" :key="index">
            <div class="right-bubble" v-if="message.name === userName ">
                <div class="subtitle-1">{{ message.name }}&nbsp;</div>
                <span class="green-text">{{ message.text }}</span>  
            </div>
            <div class="left-bubble right-align" v-if="message.name !== userName">
                <div class="subtitle-1">{{ message.name }}&nbsp;</div>
                <span class="green-text">{{ message.text }}</span>
            </div>
            </v-card-text>
        </v-card>

        <v-card flat class="mt-6">
            <v-card-text>
            <v-row>
                <v-col cols="12" sm="12" md="6">
                    <v-textarea
                    rows="1"
                    auto-grow
                    v-model="message"
                    outlined
                    :error-messages="messageErrors"
                    @input="$v.message.$touch()"
                    @blur="$v.message.$touch()"
                    ></v-textarea>
                </v-col>
            
            <v-col cols="12" sm="12" md="2">
                <v-btn 
                class="primary white--text ml-6"
                block 
                @click="sendMessage()"
                >
                Send
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            </v-row>
            </v-card-text>
        </v-card>
        </v-container>
    </v-card>
    <v-snackbar
        :color="color"
        v-model="snackbar"
        :timeout="timeout"
        :multi-line="multiLine"
    >{{ snackbarText }}
    </v-snackbar>

</v-container>
</template>

<script>
import DoctorNavbar from '../components/Navbars/DoctorNavbar'
import { auth, db, fieldValue } from '../firebase'
import { required } from 'vuelidate/lib/validators'

export default {
    components: {
        DoctorNavbar,
    },
    computed: {
        messageErrors () {
        const errors = []
        if(!this.$v.message.$dirty) return errors
            !this.$v.message.required && errors.push('Enter A Message Before Sending')
        return errors
        },
    },
    created() {
        this.currentUser = auth.currentUser.uid
        this.today = this.getTodaysDate(this.today)
        // Get Doctors name
        db.collection("users").doc(this.currentUser).get().then(doc => {
            let doctor = doc.data()
            this.userName = 'Dr. ' + doctor.firstname + ' ' + doctor.surname
        })
         this.loadMessages() // Load in the messages for this chat
        // Gets all the appointments for the doctor that is signed in on load
         db.collection("appointments").where("doctorID", "==", this.currentUser).onSnapshot( snap => { 
            let appointment = snap.docChanges()
            appointment.forEach( appointment => {   
                let patient = appointment.doc.data()
                patient.id = patient.patientID
                if(patient.appointmentDate == this.today){
                    if(patient.appointmentType == "Online"){
                            this.patients.push({
                            name: patient.firstname + ' ' + patient.surname,
                            value: patient.id
                        })
                    }
                }
            })
        }) 
    },
    data() {
        return {
            currentUser: null,
            userName: null,
            today: null,
            snackbar: false,
            color: null,
            multiLine: true,
            timeout: 5000,
            snackbarText: "",
            chatRoom: false,
            joinRoom: true,
            closeRoom: false,
            
            patients: [], // Patient array containing list of patients for todays date
            chosenPatient: null,
            roomID: null,
            timestamp: null,
            message: null,
            messages: [],
        }
    },
    validations: {
        message: { required },
    },
    methods: {
        // Append a 0 to month or date of number is less than or equals 9 to match to appointmentDates
        appendLeadingZeroes(n){
            if(n <= 9){
                return "0" + n;
            }
            return n
        },
        getTodaysDate () {
            let today = new Date()
            let formattedDate = today.getFullYear() + "-" + this.appendLeadingZeroes(today.getMonth() + 1) + "-" + this.appendLeadingZeroes(today.getDate()) 
            return formattedDate
        },
        triggerSnackbar (message, color) {
            this.snackbarText = message,
            this.color = color,
            this.snackbar = true
        },
        onPatientChanged (value) {
            // Set the ChosePatient to the value of the selected item
           this.chosenPatient = value
           console.log(this.chosenPatient)
        },
        createRoom (){
            if(this.chosenPatient == null){
                this.triggerSnackbar("Select A Patient To Create A Room For", "error")
            }
            else{
                // Check the rooms collection for any rooms with these two users
                db.collection("rooms").where("patientID", "==", this.chosenPatient).where("doctorID", "==", this.currentUser).get().then(snap => {
                    snap.forEach(doc =>{
                        let room = doc.id
                        this.roomID = room
                    })
                        // There is no room and therefore one must be created
                        if(snap.docs.length == 0) {
                            // Create room collection here and add patientID and doctorID to the room for later reference
                            db.collection("rooms").add({
                                doctorID: this.currentUser,
                                patientID: this.chosenPatient,
                            }).then( () => {
                                this.joinRoom = false
                                this.closeRoom = true
                                this.chatRoom = true
                            }).catch(error => {
                                console.log("Error with Room Creation", error)
                            })
                            this.triggerSnackbar("New Room Created!", "success")
                            
                        }
                        // There is already a room with chosenPatients and doctors/currentUsers ID
                        else{
                            this.triggerSnackbar("Chat Room Opened")
                            // Open the "chat" to this room as a card to test
                            this.joinRoom = false
                            this.closeRoom = true
                            this.chatRoom = true
                            this.loadMessages()
                        }



                }).catch(error => {
                    console.log("Rooms error", error)
                })
            }
        },
        destroyRoom () {
            db.collection("rooms").doc(this.roomID).delete().then(() => {
                this.triggerSnackbar("Room Has Been Deleted!", "success")
            }).then(() => {
                this.roomID = null
                this.chatRoom = false
                this.closeRoom = false
                this.joinRoom = true
            }).catch(error => {
                console.log("Room Deletion Error", error)
            })
        },
        sendMessage () {
            db.collection("rooms").where("patientID", "==", this.chosenPatient).where("doctorID", "==", this.currentUser).get().then(snap => {
                snap.forEach(doc =>{
                    let room = doc.id
                    this.roomID = room
                }) 
                if(this.roomID != null){
                    this.$v.$touch()
                    this.formTouched = !this.$v.message.$anyDirty
                    this.errors = this.$v.message.$anyError
                    // Stop users from entering blank messages
                    if(this.errors === false && this.formTouched === false){ 
                        let messageToSend = this.message 
                        var addMessage = {
                            doctorId: this.currentUser,
                            name: this.userName,
                            text: messageToSend,
                            timestamp: this.timestamp = new Date()
                        }
                        var messageSaved = {
                            message: fieldValue.arrayUnion(addMessage)
                        }
                        db.collection("rooms").doc(this.roomID).update(messageSaved).then(() => {
                            this.message = null  
                            this.$v.$reset()
                        })
                    }
                }
                else{
                    this.message = null
                    this.chatRoom = false
                    this.joinRoom = true
                }  
            })
        },
        loadMessages () {
            // Load all rooms where DoctorID is the same as the user
            db.collection("rooms").where("doctorID", "==", this.currentUser).onSnapshot(snap => {
                let rooms = snap.docChanges()
                // This gets the data of each doc connected to the user
                rooms.forEach(rooms => {
                    let room = rooms.doc.data() 
                    this.messages = room.message

                    if(rooms.type == "added"){
                    // Sorting can only occur once their are messages to be sorted
                    if(this.messages != null) {
                        this.messages.sort((a, b) => {
                        if(a.timestamp > b.timestamp) return 1
                        if(a.timestamp < b.timestamp) return -1
                        })

                        let len = this.messages.length
                        let numMessages = this.messages.length < 50 ? this.messages.length : 50
                        this.messages = this.messages.slice(len - numMessages, len)
                        this.chatRoom = true
                    }
                    else{
                        this.chatRoom = false
                        this.joinRoom = true
                    }
                    }
                    else if(rooms.type == "removed"){
                        this.roomID = null
                        this.chatRoom = false
                        this.joinRoom = true
                    }

                })
            })
        },  

    },
}
</script>


<style>
.container {
  border-radius: 5px;
}
.chat h2{
  font-size: 2.6em;
  margin-bottom: 40px;
}
.chat span {
  font-size: 1.4em;
}
.chat .time {
  display: block;
  font-size: 0.8em;
}
.messages {
  max-height: 400px;
  overflow: auto;
}
.chat-message {
  min-height: 40px;
  word-wrap: break-word;
  margin-bottom: 10px;

}
.right-bubble {
  background: #dcf8c6;
  width:50%;
  margin-left: 50%;
  padding: 5px 10px 10px;
}
.left-bubble {
  background: #efefef;
  width:50%;
  margin-right: 50%;
  padding: 5px 10px 10px;
}
</style>