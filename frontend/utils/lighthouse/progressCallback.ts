// Interface Imports
import {
  DisplayFileDeliverableInterface,
  ProgressDataInterface,
} from "../../interfaces";

// React-Dropzone Imports
import { FileWithPath } from "react-dropzone";

const progressCallbackHelper = (
  setFileDeliverables: React.Dispatch<
    React.SetStateAction<DisplayFileDeliverableInterface[]>
  >,
  index: number,
  file: FileWithPath
) => {
  return (progress: number) => {};
};

const progressCallback = (progressData: ProgressDataInterface) => {
  let percentageDone = (progressData?.uploaded / progressData?.total)?.toFixed(
    2
  );

  console.log("percentageDone: ", percentageDone);
};

export { progressCallback, progressCallbackHelper };
