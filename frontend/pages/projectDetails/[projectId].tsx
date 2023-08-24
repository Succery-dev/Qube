import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

// Interfaces Imports
import { ProjectScaffold, Notification } from "../../components";

// Components Imports
import { ProjectDetails } from "../../components";

const ContractDetails: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
    <div>
      <Notification />
      {/* <ProjectScaffold /> */}
      <ProjectDetails projectId={projectId} />
    </div>
  );
};

export default ContractDetails;
