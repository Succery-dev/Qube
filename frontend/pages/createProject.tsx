import React from "react";
import type { NextPage } from "next";

import { ProjectScaffold, Notification } from "../components";

const CreateProject: NextPage = () => {
  return (
    <div>
      <Notification />
      <ProjectScaffold />
    </div>
  );
};

export default CreateProject;
