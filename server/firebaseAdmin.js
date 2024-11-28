const admin = require("firebase-admin");
const serviceAccount = require("./data/lab4-88757-firebase-adminsdk-nv6lz-e36928fd6d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firestore instance
module.exports = { admin, db };
