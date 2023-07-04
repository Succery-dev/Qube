import React, { useEffect } from "react";

// Interface Imports
import { DisplayProjectDetailsInterface } from "../../interfaces";

// Constant Imports
import { addressZero } from "../../constants";

const ProjectDetailsDescription = ({
  projectDetails,
}: {
  projectDetails: DisplayProjectDetailsInterface;
}) => {
  console.log("projectDetails: ", projectDetails);
  return (
    <div className="flex flex-col gap-4 xs:mt-8 mt-4 sm:w-[80%] w-full">
      {Object.keys(projectDetails).map((descriptionSection, index) => {
        let descriptionText = projectDetails[descriptionSection];
        if (
          descriptionSection === "Lancer's Wallet Address" &&
          descriptionText === addressZero
        ) {
          descriptionText = new String("unassigned").toUpperCase();
        }
        return (
          <div key={`description-section-${index}`}>
            <h2 className="xs:text-base text-sm text-white">
              {descriptionSection}
            </h2>
            {descriptionSection.toLowerCase().includes("address") ? (
              <p className={`text-[10px] xs:text-base font-normal break-words`}>
                {descriptionText}
              </p>
            ) : (
              <p className={`xs:text-base text-xs font-normal break-words`}>
                {descriptionText}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectDetailsDescription;
