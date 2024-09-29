const admin = require('firebase-admin');
const serviceAccount = require('./restriction-service-1bf6b-firebase-adminsdk-jem60-0d1fd48830.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;