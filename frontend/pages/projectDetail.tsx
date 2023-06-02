import React from "react";
import type { NextPage } from "next";

// Interfaces Imports
import { ProjectScaffold, Notification } from "../components";

const ContractDetails: NextPage = () => {
  return (
    <div>
      <Notification />
      <ProjectScaffold />
    </div>
  )
};

export default ContractDetails;
