import { CreateProjectFormInterface } from "../index";

interface DescriptionProjectDetailsInterface
  extends CreateProjectFormInterface {
  "Client's Wallet Address": `0x${string}`;
  "Lancer's Wallet Address": `0x${string}`;
}

export type { DescriptionProjectDetailsInterface };
