import { DisplayProjectDetailsInterface } from "../index";

interface StoreProjectDetailsInterface extends DisplayProjectDetailsInterface {
  approveProof: string;
  createdAt: string;
}

export type { StoreProjectDetailsInterface };
