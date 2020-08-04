const functions = require('firebase-functions');
const admin = require('firebase-admin') // Require the admin package from firebase
admin.initializeApp() //Initialise admin server side

const db = admin.firestore()

exports.AddUserRole = functions.auth.user().onCreate(async (user) => {
    // Access the user and returns a promise so a value can be returned to the user
    return admin.auth().getUserByEmail(user.email).then(user => {
        // With the user selected, set a custom claim for admin status
        const customClaims = {
            patient: true
        }
        try{
            admin.auth().setCustomUserClaims(user.uid, customClaims)

           return db.collection("roles").doc(user.uid).set({
            email: user.email,
            role: customClaims
            
            }).catch(error => {
                console.log("Custom claim error is ", error)
            })
        } 
        finally{
            console.log("All Done")
        }
        // return admin.auth().setCustomUserClaims(user.uid, customClaims, {
        //     admin: true,
        //     // role: customClaims
        // });
    // }).then(() => {
        // const customClaims = {
        //     admin: true,
        // }


    })
})