import { StatusEnum } from "../../enums";

interface ProjectDetailInterface {
  project: string;
  deadline: number;
  amount: number;
  status: StatusEnum;
}

export type { ProjectDetailInterface };
