<template>
<v-container>
<Navbar />
    <v-card v-if="preMessageView">
        <v-card-title></v-card-title>
        <v-card-text>
        <v-row>
        <v-col cols="12" md="6" lg="6">
            <h2 class="overline black--text ml-4" justify="center">You do not have any Online Appointments!</h2>
        </v-col>
        <v-col cols="12" md="6" lg="6">
            <router-link to="/appointments" tag="button">
                <v-btn class="primary white--text">Create An Appointment</v-btn>
            </router-link>
        </v-col>
        </v-row>
        </v-card-text>
    </v-card>

        <v-card v-if="chatRoom">
            <v-card-title>Delete Chat Room History
                <v-spacer></v-spacer>
                <v-btn @click="destroyRoom()"><span>Delete</span></v-btn>
            </v-card-title>
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

            <v-card flat class="mt-4">
                <v-card-text>
                <v-row>
                    <v-col cols="12" sm="12" md="6">
                        <v-textarea
                        rows="1"
                        auto-grow
                        v-model="message"
                        outlined
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
                <!-- <v-col cols="3">
                    <v-btn icon>
                        <v-file-input type="file" multiple prepend-icon="fa-camera" hide-input v-model="file" @click="uploadFile(file)"></v-file-input>
                    </v-btn>  
                </v-col> -->
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
import Navbar from '../components/Navbars/Navbar'
// import { auth, db, fieldValue, storage } from '../firebase'
import { auth, db, fieldValue } from '../firebase'

export default {
    components: {
        Navbar,
    },
    computed: {
        
    },
    created() {
            this.currentUser = auth.currentUser.uid // Get current users ID
            this.today = this.getTodaysDate(this.today)
            // Get current users name
            db.collection("users").doc(this.currentUser).get().then(doc => {
                let user = doc.data()
                this.userName = user.firstname + ' ' + user.surname
            })
            // Get appointments pertaining to the current patient
            db.collection("appointments").where("patientID", "==", this.currentUser).onSnapshot(snap => {
                let appointment = snap.docChanges()
                appointment.forEach(appointment => {
                    let doctor = appointment.doc.data()
                    doctor.id = doctor.doctorID
                    // Get appointments for todays date to get the specific doctor ID
                    if(doctor.appointmentDate == this.today){
                        this.chosenDoctor = doctor.id
                        this.triggerSnackbar("Room Is Active", "success")

                        db.collection("rooms").where("doctorID", "==", this.chosenDoctor).where("patientID", "==", this.currentUser).onSnapshot(snap => {
                        let rooms = snap.docChanges()
                        rooms.forEach(rooms => {
                            let room = rooms.doc.data()
                            room.id = rooms.doc.id

                            if(rooms.type == "added"){
                                this.triggerSnackbar("Room Session Has Begun!")
                            }
                            else if(rooms.type == "removed"){
                                this.triggerSnackbar("Room Session Has Ended!")
                                this.roomID = null
                                this.chatRoom = false
                                this.preMessageView = true
                            }
                            else{
                                console.log("new message")
                            }
                        })

                        this.loadMessages() // Load in messages for this chat
                    })
                    }
                    else if (doctor.appointmentDate != this.today){
                        this.snackbar = null
                        // Appointment is not for today
                        this.message = null
                        this.chatRoom = false
                        this.preMessageView = true
                        // this.triggerSnackbar("Room Is Currently InActive, No Appointment Today", "error")
                    }
                    else{
                        this.message = null
                        this.chatRoom = false
                        this.preMessageView = true
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
            preMessageView: true,
            chatRoom: false,
            roomID: null,
            chosenDoctor: null,
            message: null,
            messages: [],
         
            //    file: [],
            //    LOADING_IMAGE_URL: null,
        }
    },
    validations: {

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
        destroyRoom () {
            if(this.roomID == null){
                this.message = null
                this.chatRoom = false
                this.preMessageView = true
            }
            else{
                db.collection("rooms").doc(this.roomID).delete().then(() => {
                    this.triggerSnackbar("Room Has Been Deleted!", "success")
                }).then(()=> {
                    this.message = null
                    this.chatRoom = false
                    this.preMessageView = true
                })
            }
        },
       loadMessages () {
            // Load all rooms where DoctorID is the same as the user
            db.collection("rooms").where("patientID", "==", this.currentUser).onSnapshot(snap => {
                let rooms = snap.docChanges()
                // This gets the data of each doc connected to the user
                rooms.forEach(rooms => {

                    let room = rooms.doc.data() 
                    this.messages = room.message

                    if(rooms.type == "added"){
                    // Sorting can only occur once their are messages to be sorted
                    if(this.messages != null) {
                        this.preMessageView = false
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
                        this.preMessageView = true
                    }
                    }
                    else if(rooms.type == "removed"){
                        this.roomID = null
                        this.chatRoom = false
                        this.preMessageView = true
                    }
                  

                    
                  
                })
            })
       },
       sendMessage () {
            db.collection("appointments").where("patientID", "==", this.currentUser).onSnapshot(snap => {
                let appointment = snap.docChanges()
                appointment.forEach(appointment => {
                    let doctor = appointment.doc.data()
                    doctor.id = doctor.doctorID
                    //Get appointments for todays date to get the specific doctor ID
                    if(doctor.appointmentDate == this.today){
                        this.chosenDoctor = doctor.id // Grab the ID of the doctor of appointment
                        // Where doctor and patient share the same room with their IDs
                        db.collection("rooms").where("doctorID", "==", this.chosenDoctor).where("patientID", "==", this.currentUser).get().then(snap => {
                        snap.forEach(doc =>{
                            let room = doc.id
                            this.roomID = room
                        }) 
                        if(this.roomID != null){
                            
                            var addMessage = {
                            patientId: this.currentUser,
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
                
                        }
                        else{
                            this.message = null
                            this.chatRoom = false
                            this.preMessageView = true
                        }

                        })
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