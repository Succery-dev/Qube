import { StatusEnum } from "../../enums";

interface CreateProjectFormInterface {
  Title: string;
  Detail: string;
  "Deadline(UTC)": string;
  "Reward(USDC)": number;
  // "NFT(Contract Address)": `0x${string}`;
  Status: StatusEnum,
}

export type { CreateProjectFormInterface };
