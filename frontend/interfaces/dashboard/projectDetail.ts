import { StatusEnum } from "../../enums";

interface ProjectDetailInterface {
  id: string;
  project: string;
  deadline: string;
  amount: number;
  status: StatusEnum;
  tokenSymbol: string;
  createdBy: string;
}

export type { ProjectDetailInterface };
