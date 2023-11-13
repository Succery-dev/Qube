import { StatusEnum } from "../../enums";

interface CreateProjectFormInterface {
  Title: string;
  Detail: string;
  "Deadline(UTC)": string;
  "Deadline(UTC) For Payment": string;
  "Reward(USDC)": number;
  // "NFT(Contract Address)": `0x${string}`;
  Status: StatusEnum;
  tokenSymbol: string,
}

export type { CreateProjectFormInterface };
