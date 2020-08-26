<template>
<v-container>
<Navbar />
    <v-card v-if="preMessageView">
        <v-card-title></v-card-title>
        <v-card-text>
        <v-row>
        <v-col cols="12" md="6" lg="6">
            <h2 class="overline black--text ml-4" justify="center">You do not have any appointments!</h2>
        </v-col>
        <v-col cols="12" md="6" lg="6">
            <router-link to="/appointments" tag="button">
                <v-btn class="primary white--text">Create An Appointment</v-btn>
            </router-link>
        </v-col>
        </v-row>
        </v-card-text>
    </v-card>

        <!-- Chat Card -->
        <v-card v-if="chatRoom" class="mt-6">
        <v-container>
        <v-card outlined class="messages">
            <v-card-text class="chat-message" v-for="(message, index) in messages" :key="index">
            <v-col cols="12" md="6" lg="6">
            <div class="right-bubble" v-if="message.name === userName ">
                <div class="subtitle-1">{{ message.name }}&nbsp;</div>
                <span class="green-text">{{ message.text }}</span>  
            </div>
            </v-col>
            <v-col cols="12" md="6" lg="6">
           <div class="left-bubble right-align" v-if="message.name !== userName">
                <div class="subtitle-1">{{ message.name }}&nbsp;</div>
                <span class="green-text">{{ message.text }}</span>
            </div>
            </v-col>
 
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
        this.loadMessages() // Load in messages for this chat
       
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
       loadMessages () {
            // Load all rooms where DoctorID is the same as the user
            db.collection("rooms").where("patientID", "==", this.currentUser).onSnapshot(snap => {
                let rooms = snap.docChanges()
                // This gets the data of each doc connected to the user
                rooms.forEach(rooms => {
                    let roomDoc = rooms.doc.data() 
                    this.messages = roomDoc.message

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
                })
            })
       },
       sendMessage () {
            db.collection("appointments").where("patientID", "==", this.currentUser).onSnapshot(snap => {
                let appointment = snap.docChanges()
                appointment.forEach(appointment => {
                    let doctor = appointment.doc.data()
                    doctor.id = doctor.doctorID
                    // Get appointments for todays date to get the specific doctor ID
                    if(doctor.appointmentDate == this.today){
                        this.chosenDoctor = doctor.id
                        console.log(this.chosenDoctor)
                        console.log("Appointment today") 
                    
                        db.collection("rooms").where("doctorID", "==", this.chosenDoctor).where("patientID", "==", this.currentUser).get().then(snap => {
                        snap.forEach(doc =>{
                            let room = doc.id
                            this.roomID = room
                        }) 
                        
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
                    })

                    }
                })
            })
       },
    //    uploadFile (file) {
    //        db.collection("messages").add({
    //            id: this.currentUser,
    //            name: this.userName,
    //            imageUrl: this.LOADING_IMAGE_URL,
    //            timestamp: fieldValue.serverTimestamp(),
    //        }).then(snap => {
    //             var filePath = this.currentUser + '/' + snap.id + file.name
    //             return storage.ref(filePath).put(file).then(fileSnap => {
    //                 return fileSnap.ref.getDownloadURL().then((url) => {
    //                     return snap.update({
    //                         imageUrl: url,
    //                         storageUri: fileSnap.metadata.fullPath
    //                     })
    //                 })
    //             })
    //        }).catch(error => {
    //            console.log("There was an error uploading file to Cloud Storage", error)
    //        })


           
    //    }
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