import React, { useState } from "react";
import type { NextPage } from "next";

import { ProjectScaffold, Notification } from "../components";

const CreateProject: NextPage = () => {
<!--   const [showSubmitModal, setShowSubmitModal] = useState(false);

  return <ProjectScaffold setShowSubmitModal={setShowSubmitModal} />; -->
  return (
    <div>
      <Notification />
      <ProjectScaffold />
    </div>
  );
};

export default CreateProject;
