import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import 'firebase/messaging'
import 'firebase/performance'

const firebaseConfig = {
    apiKey: "AIzaSyAuaVEBK2WfHRjQj60JaDIuaMlDut7XRbk",
    authDomain: "e-dochtuir.firebaseapp.com",
    databaseURL: "https://e-dochtuir.firebaseio.com",
    projectId: "e-dochtuir",
    storageBucket: "e-dochtuir.appspot.com",
    messagingSenderId: "73425071156",
    appId: "1:73425071156:web:55d7625dd6599fad7e6e61",
    measurementId: "G-NPJX6TG19X"
}

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const functions = firebase.functions()
const fieldValue = firebase.firestore.FieldValue
const storage = firebase.storage()
const messaging = firebase.messaging()
const performance = firebase.performance()

// collections
const usersCollection = db.collection('users')
const rolesCollection = db.collection('roles')

export{
    db,
    auth,
    functions,
    fieldValue,
    storage, 
    messaging,
    performance,
    usersCollection,
    rolesCollection,
}