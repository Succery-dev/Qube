import { CreateProjectFormInterface } from "../index";

interface DisplayProjectDetailsInterface extends CreateProjectFormInterface {
  "Client's Wallet Address": `0x${string}`;
  "Lancer's Wallet Address": `0x${string}`;
}

export type { DisplayProjectDetailsInterface };
