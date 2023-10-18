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

export const checkSignByFreelancer = onSchedule("30 23 * * *", async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  // Filter the projects
  const projects = await getFirestore()
    .collection("projects")
    .where("Status", "==", "Waiting for connecting lancer’s wallet")
    .where("createdAt", "<=", oneWeekAgo.toISOString())
    .get();

  // Change the status to "Cancel"
  projects.forEach(async (doc) => {
    await getFirestore()
      .collection("projects")
      .doc(doc.id)
      .set({
        "Status": "Cancel",
      }, {merge: true});
  });
});

const formatDateToUTC = (dateObj: Date) => {
  const year = dateObj.getUTCFullYear();
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getUTCDate().toString().padStart(2, '0');
  const hour = dateObj.getUTCHours().toString().padStart(2, '0');
  const minute = dateObj.getUTCMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hour}:${minute}`;
};

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

  const projectLink = `${process.env.BASE_URL}/projectDetails/${id}`;
  const qubeMailAddress = '"Qube" <official@0xqube.xyz>';

  const beforeData = event.data?.before;
  const beforeStatus = beforeData?.get("Status");
  const beforeInDispute = beforeData?.get("InDispute");
  const afterData = event.data?.after;
  const afterStatus = afterData?.get("Status");
  const afterInDispute = afterData?.get("InDispute");
  logger.info("before: ", beforeStatus, beforeInDispute);
  logger.info("after: ", afterStatus, afterInDispute);

  const title = afterData?.get("Title");
  const now = new Date();
  const submissionDeadline = new Date(afterData?.get("Deadline(UTC)"));
  const extendedSubmissionDeadline = new Date(afterData?.get("Deadline(UTC)"));
  extendedSubmissionDeadline.setUTCDate(extendedSubmissionDeadline.getUTCDate() + 14);
  const paymentDeadline = new Date(afterData?.get("Deadline(UTC) For Payment"));
  const extendedPaymentDeadline = new Date(afterData?.get("Deadline(UTC) For Payment"));
  extendedPaymentDeadline.setUTCDate(extendedPaymentDeadline.getUTCDate() + 14);
  const formattedNow = formatDateToUTC(now);
  const formattedSubmissionDeadline = formatDateToUTC(submissionDeadline);
  const formattedExtendedSubmissionDeadline = formatDateToUTC(extendedSubmissionDeadline);
  const formattedPaymentDeadline = formatDateToUTC(paymentDeadline);
  const formattedExtendedPaymentDeadline = formatDateToUTC(extendedPaymentDeadline);

  if (beforeStatus == StatusEnum.WaitingForConnectingLancersWallet && afterStatus == StatusEnum.PayInAdvance) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The contract has been signed. 

Please prepay the reward to Escrow as soon as possible. 
Make sure that until you don't finish the prepay, the freelancer won't start working and won't be able to submit the work.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.PayInAdvance && afterStatus == StatusEnum.WaitingForSubmission) {
    const prepayTxHash = afterData?.get("prepayTxHash");
    const prepayTxUrl = `${process.env.POLYGONSCAN_URL}/tx/${prepayTxHash}`;

    const docRef = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The prepay has been done by the client. Finish your work and submit it before ${formattedSubmissionDeadline}(UTC). 
If you don't submit it before ${formattedSubmissionDeadline}(UTC), the money in Escrow will be refunded to the client automatically.

You can review the details and verify the transaction by clicking on the link below:
${prepayTxUrl}

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.WaitingForSubmission && afterStatus == StatusEnum.WaitingForPayment) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The Submission has been done. Visit the page to check the submissions and take the appropriate action before ${formattedPaymentDeadline}(UTC).

Make sure the following things. 
1. If you approve the payment will be done right after the approval. 

2. If the submission is inappropriate, discuss it with the opposite person and request a Deadline Extension system. 
*By doing this, The Payment date will be extended to ${formattedExtendedPaymentDeadline}(UTC) so that the opposite party can redo the task.

*Make sure if you don't take any action of the two mentioned above, the payment will be executed on ${formattedPaymentDeadline}(UTC) automatically. 

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.CompleteApproval) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The submission the freelancer made has been approved and the payment has also been executed on ${formattedNow}(UTC).

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: qubeMailAddress,
      to: doc2.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The submission the freelancer made has been approved and the payment has also been executed on ${formattedNow}(UTC).

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.InDispute) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The Deadline Extension Request has been disapproved. The fund has been FROZEN in the Escrow for 9 months. 

After 9 months the fund in the Escrow will be refunded to the client.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: qubeMailAddress,
      to: doc2.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The Deadline Extension Request has been disapproved. The fund has been FROZEN in the Escrow for 9 months. 

After 9 months the fund in the Escrow will be refunded to the client.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.WaitingForSubmissionDER) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The deadline extension has been accepted! The payment date has been extended to ${formattedPaymentDeadline}(UTC) successfully.

Next required Action

The Freelancer

Make the submission of the new version before ${formattedSubmissionDeadline}(UTC).

The Client

Wait until the new version of the submission is made. The submission will be made before ${formattedSubmissionDeadline}(UTC).

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: qubeMailAddress,
      to: doc2.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The deadline extension has been accepted! The payment date has been extended to ${formattedPaymentDeadline}(UTC) successfully.

Next required Action

The Freelancer

Make the submission of the new version before ${formattedSubmissionDeadline}(UTC).

The Client

Wait until the new version of the submission is made. The submission will be made before ${formattedSubmissionDeadline}(UTC).

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForSubmissionDER && afterStatus == StatusEnum.WaitingForPayment) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The submission deadline has come. Visit the contract to check the submission. 

Make sure the things below before you proceed.

1. If you approve the submission the payment will be done to the freelancer right after that.
2. If you disapprove the submission, the fund in Escrow will be FROZEN for 9 months.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.CompleteDisapproval) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`As the submission was disapproved even after Extending the timeline, the fund in Escrow has been FROZEN. 
The fund will be released to the client after 9 months. 

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: qubeMailAddress,
      to: doc2.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`As the submission was disapproved even after Extending the timeline, the fund in Escrow has been FROZEN. 
The fund will be released to the client after 9 months. 

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForPayment && afterStatus == StatusEnum.CompleteNoContactByClient) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`Due to not having any action by the client against the submission, the payment has been executed automatically.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    transporter.sendMail(mailOptions);

    const docRef2 = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc2 = await docRef2.get();

    const mailOptions2 = {
      from: qubeMailAddress,
      to: doc2.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`Due to not having any action by the client against the submission, the payment has been executed automatically.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions2);
  } else if (beforeStatus == StatusEnum.WaitingForConnectingLancersWallet && afterStatus == StatusEnum.Cancel) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Client's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`As there was no action, the contract has been dismissed.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions);
  } else if (!beforeInDispute && afterInDispute) {
    const docRef = getFirestore().collection("users").doc(afterData?.get("Lancer's Wallet Address"));
    const doc = await docRef.get();

    const mailOptions = {
      from: qubeMailAddress,
      to: doc.get("email"),
      subject: `Project Name: ${title}`,
      text: 
`The client has made a Deadline Extension Request. 

Accept the request if you agree. By doing so, the payment date will be extended to ${formattedExtendedPaymentDeadline}(UTC) and you will be required to submit the new version of the task before ${formattedExtendedSubmissionDeadline}(UTC). 

Make sure if you disagree with this, the fund in the Escrow will be FROZEN and will be released to the client after 9 months.

To go to the project: ${projectLink}
If you have any questions feel free to reply to this mail. Don't forget to explain the issue you are having.`,
    };
    
    return transporter.sendMail(mailOptions);
  }

  return null;
});