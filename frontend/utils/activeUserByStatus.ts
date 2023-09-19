import { StatusEnum } from "../enums";
import { DisplayProjectDetailsInterface } from "../interfaces";

export const activeUserByStatus = (projectDetails: DisplayProjectDetailsInterface) => {
  const freelancer = "Freelancer";
  const client = "Client";

  if (projectDetails.Status === StatusEnum.WaitingForConnectingLancersWallet) {
    return freelancer;
  } else if (projectDetails.Status === StatusEnum.PayInAdvance) {
    return client;
  } else if (projectDetails.Status === StatusEnum.WaitingForSubmission) {
    return freelancer;
  } else if (projectDetails.Status === StatusEnum.WaitingForSubmissionDER) {
    return freelancer;
  } else if (projectDetails.InDispute) {
    return freelancer;
  } else if (projectDetails.Status === StatusEnum.WaitingForPayment) {
    return client;
  }
}