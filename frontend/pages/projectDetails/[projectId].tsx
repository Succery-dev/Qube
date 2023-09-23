import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

// Components Imports
import { Notification, ProjectDetails } from "../../components";

const ContractDetails: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
    <div>
      <Notification />
      <ProjectDetails projectId={projectId} />
    </div>
  );
};

export default ContractDetails;
