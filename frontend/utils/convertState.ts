import { StatusEnum } from "../enums";

// TODO: fix this
export const convertState = (status: StatusEnum, createdBy: string) => {
  if (status === StatusEnum.WaitingForConnectingLancersWallet) {
    if (createdBy === "depositor") {
      return "Waiting for connecting creator's wallet";
    } else {
      return "Waiting for connecting company's wallet";
    }
  } else if (status === StatusEnum.CompleteNoSubmissionByLancer) {
    return "Complete (No Submission By Creator)";
  } else {
    return status;
  }
}