import admin from "firebase-admin";

// ✅ Use relative import path — no need for path.resolve
const serviceAccount = require("./srm-portal-2025-firebase-adminsdk-fbsvc-7b1c354a92.json");

// Prevent reinitializing during hot reload
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id, // this is optional but clean
  });
}

// ✅ Export admin.firestore() directly
export const db = admin.firestore();
