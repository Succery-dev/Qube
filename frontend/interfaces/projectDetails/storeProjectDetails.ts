import { DisplayProjectDetailsInterface } from "../index";

interface StoreProjectDetailsInterface extends DisplayProjectDetailsInterface {
  approveProof: string;
  createdAt: string;
  prepayTxHash: string;
  tokenSymbol: string;
  tokenAddress: string;
}

export type { StoreProjectDetailsInterface };
