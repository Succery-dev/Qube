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

import {
  withdrawTokensToDepositorByOwner,
  withdrawTokensToRecipientByOwner,
} from "./Escrow";

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

  // Filter the projects after the Deadline-Extension
  const projectsAfterDE = await firestore
    .collection("projects")
    .where("Status", "==", "Waiting for Submission (DER)")
    .where("Deadline(UTC)", "<=", now.toISOString())
    .get();

  // Change the status to "Waiting for Payment"
  projectsAfterDE.forEach(async (doc) => {
    await firestore
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Waiting for Payment"}, {merge: true});
  });
});

export const checkPaymentDeadline = onSchedule("30 0 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await firestore
    .collection("projects")
    .where("Status", "==", "Waiting for Payment")
    .where("InDispute", "==", false)
    .where("Deadline(UTC) For Payment", "<=", now.toISOString())
    .get();

  // Pay tokens to freelancers "⑦ No Approval ( Ignored By Client)"
  projects.forEach(async (doc) => {
    // Log the project ID
    logger.log("⑦ No Approval ( Ignored By Client): ", doc.id);
    // Withdraw tokens to recipient by owner
    const withdrawResult = await withdrawTokensToRecipientByOwner(doc.id);
    // Log the result
    logger.log("Withdraw Result: ", withdrawResult);
    // Change the status to "Complete (No Contact By Client)"
    await firestore
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Complete (No Contact By Client)"}, {merge: true});
    logger.log("Changed the status 'Complete (No Contact By Client)'");
  });
});

export const checkDisapproveRefund = onSchedule("0 1 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await firestore
    .collection("projects")
    .where("Status", "==", "Complete (Disapproval)")
    .where("Deadline(UTC) For Payment", "<=", now.toISOString())
    .get();

  // Refund tokens to clients "④ Disapprove The Submission"
  projects.forEach(async (doc) => {
    // Log the project ID
    logger.log("④ Disapprove The Submission: ", doc.id);
    // Withdraw tokens to client by owner
    const withdrawResult = await withdrawTokensToDepositorByOwner(doc.id);
    // Log the result
    logger.log("Withdraw Result: ", withdrawResult);
  });
});

export const checkDisputeRefund = onSchedule("30 1 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await firestore
    .collection("projects")
    .where("Status", "==", "In Dispute")
    .where("Deadline(UTC) For Payment", "<=", now.toISOString())
    .get();

  // Refund tokens to clients "⑥ Deadline-Extension Request (Disapproval)"
  projects.forEach(async (doc) => {
    // Log the project ID
    logger.log("⑥ Deadline-Extension Request (Disapproval)", doc.id);
    // Withdraw tokens to client by owner
    const withdrawResult = await withdrawTokensToDepositorByOwner(doc.id);
    // Log the result
    logger.log("Withdraw Result: ", withdrawResult);
    // Change the status to "Complete (Dispute)"
    await firestore
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Complete (Dispute)"}, {merge: true});
    logger.log("Changed the status 'Complete (Dispute)'");
  });
});

export const checkInDispute = onSchedule("0 2 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await firestore
    .collection("projects")
    .where("InDispute", "==", true)
    .where("RequestedDeadlineExtension", "<=", now.toISOString())
    .get();

  // Change the status to "Waiting for Submission (DER)"
  projects.forEach(async (doc) => {
    const submissionDeadline = new Date(doc.data()["Deadline(UTC)"]);
    const paymentDeadline = new Date(doc.data()["Deadline(UTC) For Payment"]);
    submissionDeadline.setDate(submissionDeadline.getDate() + 14);
    paymentDeadline.setDate(paymentDeadline.getDate() + 14);

    await firestore
      .collection("projects")
      .doc(doc.id)
      .set({
        "Status": "Waiting for Submission (DER)",
        "Deadline(UTC)": submissionDeadline.toISOString(),
        "Deadline(UTC) For Payment": paymentDeadline.toISOString(),
        "InDispute": false,
      }, {merge: true});
  });
});
