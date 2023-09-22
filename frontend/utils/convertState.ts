import { StatusEnum } from "../enums";

// TODO: fix this
export const convertState = (status: any) => {
  if (status === StatusEnum.WaitingForConnectingLancersWallet) {
    return "Waiting for connecting freelancer’s wallet";
  } else if (status === StatusEnum.CompleteNoSubmissionByLancer) {
    return "Complete (No Submission By Freelancer)";
  } else {
    return status;
  }
}