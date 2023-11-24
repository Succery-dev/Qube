import { CreateProjectFormInterface } from "../index";

interface DescriptionProjectDetailsInterface
  extends CreateProjectFormInterface {
  "Client's Wallet Address": `0x${string}`;
  "Lancer's Wallet Address": `0x${string}`;
  createdBy: string;
}

export type { DescriptionProjectDetailsInterface };
