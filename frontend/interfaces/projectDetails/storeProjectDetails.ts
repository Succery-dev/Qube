import { DisplayProjectDetailsInterface } from "../index";

interface StoreProjectDetailsInterface extends DisplayProjectDetailsInterface {
  approveProof: string;
  createdAt: string;
  prepayTxHash: string;
}

export type { StoreProjectDetailsInterface };
