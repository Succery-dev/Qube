interface StoreFileDeliverableInterface {
  fileName: string;
  fileSize: string;
  downloadUrl: string;
}

interface ProjectsCollectionInterface {
  Title: string;
  Detail: string;
  "Deadline(UTC)": string;
  "Reward(USDC)": string;
  "NFT(Contract Address)": `0x${string}`;
  clientInfoObj: { uid: string | ""; address: `0x${string}` | "" };
  lancerInfoObj: { uid: string | ""; address: `0x${string}` | "" };
  fileDeliverable: StoreFileDeliverableInterface[];
  textDeliverable: string[];
  approveProof: string;
}

interface ProjectDisplayInterface {
  Title: string;
  Detail: string;
  "Deadline(UTC)": string;
  "Reward(USDC)": string;
  "NFT(Contract Address)": `0x${string}`;
  "Client's Wallet Address": string;
  "Lancer's Wallet Address": string;
  fileDeliverable: StoreFileDeliverableInterface[];
  textDeliverable: string[];
  approveProof: string;
}

export type {
  StoreFileDeliverableInterface,
  ProjectDisplayInterface,
  ProjectsCollectionInterface,
};
