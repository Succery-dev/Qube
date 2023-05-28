import { CreateProjectFormInterface } from "./createProjectFormInterface";

interface CreateProjectFormContextInterface {
  form: CreateProjectFormInterface;
  setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>;
}

export type { CreateProjectFormContextInterface };
