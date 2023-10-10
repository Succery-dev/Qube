// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import nodemailer from "nodemailer";

initializeApp();

import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";

import { StatusEnum } from "./projectStatus";

import dotenv from "dotenv";
dotenv.config();

import {
  withdrawTokensToDepositorByOwner,
  withdrawTokensToRecipientByOwner,
} from "./Escrow";

export const checkSubmissionDeadline = onSchedule("0 21 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await getFirestore()
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
    await getFirestore()
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Complete (No Submission By Lancer)"}, {merge: true});
    logger.log("Changed the status 'Complete (No Submission By Lancer)'");
  });

  // Filter the projects after the Deadline-Extension
  const projectsAfterDE = await getFirestore()
    .collection("projects")
    .where("Status", "==", "Waiting for Submission (DER)")
    .where("Deadline(UTC)", "<=", now.toISOString())
    .get();

  // Change the status to "Waiting for Payment"
  projectsAfterDE.forEach(async (doc) => {
    await getFirestore()
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Waiting for Payment"}, {merge: true});
  });
});

export const checkPaymentDeadline = onSchedule("30 21 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await getFirestore()
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
    await getFirestore()
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Complete (No Contact By Client)"}, {merge: true});
    logger.log("Changed the status 'Complete (No Contact By Client)'");
  });
});

export const checkDisapproveRefund = onSchedule("0 22 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await getFirestore()
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

export const checkDisputeRefund = onSchedule("30 22 * * *", async () => {
  const now = new Date();
  // Filter the projects
  const projects = await getFirestore()
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
    await getFirestore()
      .collection("projects")
      .doc(doc.id)
      .set({Status: "Complete (Dispute)"}, {merge: true});
    logger.log("Changed the status 'Complete (Dispute)'");
  });
});

export const checkInDispute = onSchedule("0 23 * * *", async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  // Filter the projects
  const projects = await getFirestore()
    .collection("projects")
    .where("InDispute", "==", true)
    .where("RequestedDeadlineExtension", "<=", oneWeekAgo.toISOString())
    .get();

  // Change the status to "Waiting for Submission (DER)"
  projects.forEach(async (doc) => {
    const submissionDeadline = new Date(doc.data()["Deadline(UTC)"]);
    const paymentDeadline = new Date(doc.data()["Deadline(UTC) For Payment"]);
    submissionDeadline.setDate(submissionDeadline.getDate() + 14);
    paymentDeadline.setDate(paymentDeadline.getDate() + 14);

    await getFirestore()
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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  }
});

export const sendEmailNotification = onDocumentUpdated("/projects/{documentId}", async (event) => {
  const id = event.params.documentId;
  logger.info("id: ", id);

  const beforeData = event.data?.before;
  const beforeStatus = beforeData?.get("Status");
  const beforeInDispute = beforeData?.get("InDispute");
  const afterData = event.data?.after;
  const afterStatus = afterData?.get("Status");
  const afterInDispute = afterData?.get("InDispute");
  logger.info("before: ", beforeStatus, beforeInDispute);
  logger.info("after: ", afterStatus, afterInDispute);

  if (beforeStatus == StatusEnum.WaitingForConnectingLancersWallet && afterStatus == StatusEnum.PayInAdvance) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.PayInAdvance && afterStatus == StatusEnum.WaitingForSubmission) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.WaitingForSubmission && afterStatus == StatusEnum.WaitingForPayment) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.CompleteApproval) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: process.env.MAIL_ADDRESS,
      to: doc2.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.CompleteDispute) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: process.env.MAIL_ADDRESS,
      to: doc2.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.WaitingForSubmissionDER) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: process.env.MAIL_ADDRESS,
      to: doc2.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForSubmissionDER && afterStatus == StatusEnum.WaitingForPayment) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.CompleteDisapproval) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: process.env.MAIL_ADDRESS,
      to: doc2.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.CompleteNoContactByClient) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: process.env.MAIL_ADDRESS,
      to: doc2.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForConnectingLancersWallet && afterStatus == StatusEnum.CompleteNoSubmissionByLancer) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: process.env.MAIL_ADDRESS,
      to: doc2.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (!beforeInDispute && afterInDispute) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: doc.get("email"),
      subject: 'Project Status Changed',
      text: `The status of the project has changed to ${afterStatus} from ${beforeStatus}`,
    };
    
    return transporter.sendMail(mailOptions);
  }

  return null;
});