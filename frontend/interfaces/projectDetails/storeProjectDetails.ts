import { CreateProjectFormInterface } from "../index";

interface StoreProjectDetailsInterface extends CreateProjectFormInterface {
  "Client's Wallet Address": `0x${string}`;
  "Lancer's Wallet Address": `0x${string}`;
  approveProof: string;
}

export type { StoreProjectDetailsInterface };
