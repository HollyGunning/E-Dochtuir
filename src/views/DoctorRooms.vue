<template>
<v-container>
<DoctorNavbar />
    <v-card>
        <v-card-title></v-card-title>
        
            <v-row>
                <v-col cols="12" sm="6" md="6" lg="6">
                <v-select 
                class="ml-9"
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
                class="primary white--text ml-6 mt-3"
                block 
                @click="createRoom()"
                >
                Join Room
                </v-btn>
                </v-col>
            </v-row>
        
    </v-card>
  
    <!-- Chat Card -->
    <v-card v-if="chatRoom" class="mt-6 mb-9">
        <v-card-title class="primary lighten-1 white--text">Online Consultation</v-card-title>
        <v-container>
        <v-card outlined class="messages" v-chat-scroll>
            <v-card-text class="chat-message" v-for="(message, index) in messages" :key="index">
            <v-div class="right-bubble" v-if="message.name === userName ">
               <v-subtitle-1 class="overline">{{ message.name }}&nbsp;</v-subtitle-1>
                <span class="green-text">{{ message.text }}</span>  
            </v-div>
            <v-div class="left-bubble right-align" v-if="message.name !== userName">
                <v-subtitle-1 class="overline">{{ message.name }}&nbsp;</v-subtitle-1>
                <span class="green-text">{{ message.text }}</span>
            </v-div>
            </v-card-text>
        </v-card>

        <v-card flat class="mt-6">
            <v-card-text>
            <v-row>
                <v-col cols="7">
                    <v-textarea
                    rows="1"
                    auto-grow
                    v-model="message"
                    outlined
                    ></v-textarea>
                </v-col>
            
            <v-col cols="2">
                <v-btn 
                class="primary white--text ml-6"
                block 
                @click="sendMessage()"
                >
                Send
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="3" class="ml-2">
                <v-btn type="file" v-model="uploadFile" icon>
                    <!-- <v-file-input type="file" multiple prepend-icon="fa-camera" hide-input v-model="file" @click="uploadFile(file)"></v-file-input> -->
                </v-btn>  
            </v-col>
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
export default {
    components: {
        DoctorNavbar,
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
                // Get the appointments on todays date
                if(patient.appointmentDate == this.today){
                    this.patients.push({
                        name: patient.firstname + ' ' + patient.surname,
                        value: patient.id
                    })
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

            
            patients: [], // Patient array containing list of patients for todays date
            chosenPatient: null,
            roomID: null,
            timestamp: null,
            message: null,
            messages: [],
        }
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
                            this.chatRoom = true
                            this.loadMessages()
                        }
                }).catch(error => {
                    console.log("Rooms error", error)
                })
            }
        },

        sendMessage () {
            db.collection("rooms").where("patientID", "==", this.chosenPatient).where("doctorID", "==", this.currentUser).get().then(snap => {
                snap.forEach(doc =>{
                    let room = doc.id
                    this.roomID = room
                }) 

                var addMessage = {
                    doctorId: this.currentUser,
                    name: this.userName,
                    text: this.message,
                    timestamp: this.timestamp = new Date()
                }

                var messageSaved = {
                    message: fieldValue.arrayUnion(addMessage)
                }

                db.collection("rooms").doc(this.roomID).update(messageSaved).then(() => {
                  this.message = null  
                })
            })
        },

        loadMessages () {
            // Load all rooms where DoctorID is the same as the user
            db.collection("rooms").where("doctorID", "==", this.currentUser).onSnapshot(snap => {
                let rooms = snap.docChanges()
                // This gets the data of each doc connected to the user
                rooms.forEach(rooms => {
                    let roomDoc = rooms.doc.data() 
                    this.messages = roomDoc.message

                    // Sorting can only occur once their are messages to be sorted
                    if(this.messages != null) {
                        this.messages.sort((a, b) => {
                        if(a.timestamp > b.timestamp) return 1
                        if(a.timestamp < b.timestamp) return -1
                        })

                        let len = this.messages.length
                        let numMessages = this.messages.length < 50 ? this.messages.length : 50
                        this.messages = this.messages.slice(len - numMessages, len)
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
  width: 80%;
  min-height: 40px;
}
.chat-message .right-bubble {
  position: relative;
  background: #dcf8c6;
  border-top-left-radius: .4em;
  border-bottom-left-radius: .4em;
  border-bottom-right-radius: .4em;
  padding: 5px 10px 10px;
  margin-bottom: 10px;
  left: 50%;
  width: 85%
}
.chat-message .right-bubble:after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border: 1px solid transparent;
  border-left-color: #dcf8c6;
  border-right: 0;
  border-top: 0;
  margin-top: 1px;
  margin-right: 200px;
}
.chat-message .left-bubble {
  position: relative;
  background: #efefef;
  border-top-right-radius: .4em;
  border-bottom-left-radius: .4em;
  border-bottom-right-radius: .4em;
  padding: 5px 10px 10px;
  margin-bottom: 10px;
  left: 0%;
  width: 200%;
}
.chat-message .left-bubble:after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  border: 1px solid transparent;
  border-right-color: #efefef;
  border-left: 0;
  border-top: 0;
  margin-top: 1px;
  margin-left: 1px;
}
</style>