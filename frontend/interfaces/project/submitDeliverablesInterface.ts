import { FileWithPath } from "react-dropzone";

interface SumbitFileInterface extends FileWithPath {
  progress: number;
}

interface SubmitDeliverablesInterface {
  files: SumbitFileInterface[];
  text: string;
}

export type { SubmitDeliverablesInterface, SumbitFileInterface };
