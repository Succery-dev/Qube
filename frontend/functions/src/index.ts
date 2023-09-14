// Import types
import {App} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
import * as functions from "firebase-functions";
const logger = functions.logger;

// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin/app";
import * as firestoreAdmin from "firebase-admin/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";

import {withdrawTokensToDepositorByOwner} from "./Escrow";

const app: App = admin.initializeApp();
const firestore: Firestore = firestoreAdmin.getFirestore(app);

export const checkSubmissionDeadline = onSchedule("0 0 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await firestore
    .collection("projects")
    .where("Status", "==", "Waiting for Submission")
    .where("Deadline(UTC)", "<=", now.toISOString())
    .get();

  // Return tokens to clients "② No Submission By Lancer"
  projects.forEach(async (doc) => {
    // Log the project ID
    logger.log("② No Submission By Lancer: ", doc.id);
    // Withdraw tokens to depositor by owner
    const withdrawResult = await withdrawTokensToDepositorByOwner(doc.id);
    // Log the result
    logger.log("Withdraw Result: ", withdrawResult);
    // Change the status to "Complete (No Submission By Lancer)"
    await firestore
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Complete (No Submission By Lancer)"}, {merge: true});
    logger.log("Changed the status 'Complete (No Submission By Lancer)'");
  });
});
