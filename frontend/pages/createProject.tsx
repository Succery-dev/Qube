import React, { useState } from "react";
import type { NextPage } from "next";

import { ProjectScaffold } from "../components";

const CreateProject: NextPage = () => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return <ProjectScaffold setShowSubmitModal={setShowSubmitModal} />;
};

export default CreateProject;
