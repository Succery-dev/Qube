enum StatusEnum {
  WaitingForConnectingLancersWallet = "Waiting for connecting lancer’s wallet",
  PayInAdvance = "Pay in advance",
  WaitingForSubmission = "Waiting for Submission",
  WaitingForSubmissionDER = "Waiting for Submission (DER)",
  WaitingForPayment = "Waiting for Payment",
  CompleteNoSubmissionByLancer = "Complete (No Submission By Lancer)",
  CompleteNoContactByClient = "Complete (No Contact By Client)",
  CompleteApproval = "Complete (Approval)",
  CompleteDisapproval = "Complete (Disapproval)",
  CompleteDispute = "Complete (Dispute)",
  InDispute = "In Dispute",
  Cancel = "Cancel",
}

export { StatusEnum };
