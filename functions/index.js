const functions = require('firebase-functions');
const admin = require('firebase-admin') // Require the admin package from firebase
admin.initializeApp() //Initialise admin server side

const db = admin.firestore()

exports.AddUserRole = functions.auth.user().onCreate(async (user) => {

    if (user.email) {
        const customClaims = {
          patient: true,
        };

        // const customClaims = {
        //   role: 'patient',
        // };

        try {
          var _ = await admin.auth().setCustomUserClaims(user.uid, customClaims)
    
          return db.collection("roles").doc(user.uid).set({
            email: user.email,
            role: customClaims
          })
    
        } catch (error) {
          console.log(error)
        }
    
    
      }


})

exports.setUserRole = functions.https.onCall(async (data, context) => {

    if (!context.auth.token.admin) return
  
  
    try {
      var _ = await admin.auth().setCustomUserClaims(data.uid, data.role)
  
      return db.collection("roles").doc(data.uid).update({
        role: data.role
      })
  
    } catch (error) {
      console.log(error)
    }
  
  });