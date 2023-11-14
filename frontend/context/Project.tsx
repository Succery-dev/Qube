import React, { ReactNode, createContext, useContext, useState } from "react";

// Interfaces Imports
import {
  CreateProjectFormInterface,
  CreateProjectFormContextInterface,
} from "../interfaces";
import { StatusEnum } from "../enums";

const initialFormValue = {
  Title: "",
  Detail: "",
  "Deadline(UTC)": "",
  "Deadline(UTC) For Payment": "",
  "Reward(USDC)": 0,
  // "NFT(Contract Address)": "" as `0x${string}`,
  Status: StatusEnum.WaitingForConnectingLancersWallet,
  tokenSymbol: "USDC",
};

// Create the context
const ProjectContext = createContext<CreateProjectFormContextInterface>({
  form: initialFormValue,
  setForm: () => {},
});

// Create the context provider component
const ProjectProvider = ({ children }: { children: ReactNode }) => {
  // State to store the form values
  const [form, setForm]: [
    form: CreateProjectFormInterface,
    setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>
  ] = useState(initialFormValue);

  return (
    <ProjectContext.Provider value={{ form, setForm }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Use the context
function useProjectContext() {
  return useContext(ProjectContext);
}

export { ProjectProvider, useProjectContext };
