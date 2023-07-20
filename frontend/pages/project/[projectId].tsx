import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

// Interfaces Imports
import {
  ProjectScaffold,
  Notification,
  SubmitProjectModal,
} from "../../components";

const ContractDetails: NextPage = () => {
  const router = useRouter();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <div>
      <Notification />
      {/* Submit Modal */}
      <SubmitProjectModal
        showSubmitModal={showSubmitModal}
        setShowSubmitModal={setShowSubmitModal}
      />
      <ProjectScaffold setShowSubmitModal={setShowSubmitModal} projectId={router.query.projectId as string}/>
    </div>
  );
};

export default ContractDetails;
