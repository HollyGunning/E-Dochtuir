<template>
<v-container>
    <Navbar />

        <v-row><v-col cols="12">
        
            <v-card>
                <v-card-title>
                    <!-- <v-icon>fa-comment-medical</v-icon> -->
                    Chat
                </v-card-title>
                <v-container>
                    <v-card flat id="messages">
                        <v-card-text v-for="(message, index) in messages" :key="index">
                        <span>{{ message.name }}: </span>
                        <span>{{ message.text }}</span>
                        </v-card-text>
                    </v-card>

                        <v-card flat>
                            <v-row>
                            <v-col cols="6">
                                <v-text-field
                                v-model="message"
                                outlined
                                ></v-text-field>
                            </v-col>
                            <v-card-actions>
                            <v-row>
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
                            <v-col cols="4">
                                <v-btn icon>
                                    <v-file-input type="file" multiple prepend-icon="fa-camera" hide-input v-model="file" @click="uploadFile(file)"></v-file-input>
                                </v-btn>
                                 
                            </v-col>
                            </v-row>
                            </v-card-actions>
                        
                     </v-row>


                        </v-card>

                </v-container>
            </v-card>        
        </v-col></v-row>

</v-container>
</template>

<script>
import Navbar from '../components/Navbars/Navbar'
import { auth, db, fieldValue, storage } from '../firebase'
export default {
   components: {
       Navbar,
   },
   computed: {
       
   },
   created() {
        this.currentUser = auth.currentUser.uid // Get current users ID
        // Get current users name
        db.collection("users").doc(this.currentUser).get().then(doc => {
            let user = doc.data()
            this.userName = user.firstname + ' ' + user.surname
        })

        this.loadMessages()

     
   },
   data() {
       return {
           currentUser: null,
           userName: null,
           message: null,
           messages: [],
           file: [],
           LOADING_IMAGE_URL: null,
       }
   },
   validations: {

   },
   methods: {
       loadMessages () {
        var load = db.collection("messages").orderBy('timestamp').limit(12)
        load.onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                if(change.type === 'removed'){
                    console.log("Add deleteMessage")
                    // deleteMessage(change.doc.id)
                }
                else{
                    var message = change.doc.data()
                    this.messages.push(message)
                }
            })
        })

       },
       sendMessage () {
           // Add a new message to DB
           db.collection("messages").add({
               id: this.currentUser,
               name: this.userName,
               text: this.message,
               timestamp: fieldValue.serverTimestamp()
           }).catch(error => {
               console.log("Error writing message to db", error)
           })
       },
       uploadFile (file) {
           db.collection("messages").add({
               id: this.currentUser,
               name: this.userName,
               imageUrl: this.LOADING_IMAGE_URL,
               timestamp: fieldValue.serverTimestamp(),
           }).then(snap => {
                var filePath = this.currentUser + '/' + snap.id + file.name
                return storage.ref(filePath).put(file).then(fileSnap => {
                    return fileSnap.ref.getDownloadURL().then((url) => {
                        return snap.update({
                            imageUrl: url,
                            storageUri: fileSnap.metadata.fullPath
                        })
                    })
                })
           }).catch(error => {
               console.log("There was an error uploading file to Cloud Storage", error)
           })


           
       }
   },
}
</script>