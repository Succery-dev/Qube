import { StatusEnum } from "../../enums";

interface ProjectDetailInterface {
  id: string;
  project: string;
  deadline: string;
  amount: number;
  status: StatusEnum;
}

export type { ProjectDetailInterface };
