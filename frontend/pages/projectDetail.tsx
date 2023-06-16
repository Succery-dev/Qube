import React, { useState } from "react";
import type { NextPage } from "next";

// Interfaces Imports
import {
  ProjectScaffold,
  Notification,
  SubmitProjectModal,
} from "../components";

const ContractDetails: NextPage = () => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <div>
      <Notification />
      {/* Submit Modal */}
      <SubmitProjectModal
        showSubmitModal={showSubmitModal}
        setShowSubmitModal={setShowSubmitModal}
      />
      <ProjectScaffold setShowSubmitModal={setShowSubmitModal} />
    </div>
  );
};

export default ContractDetails;
