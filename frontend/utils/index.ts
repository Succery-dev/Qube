import { convertSeconds } from "./convertSeconds";

/**
 * @dev TEMPORARILY commenting this firebase app
 * @todo use this app for production
 */
// import { firebaseApp } from "./firebase";
import { app, database, storage } from "./firebase";

import { formatBytes } from "./formatBytes";

import { getDoughnutChartConfig, getLineChartConfig } from "./dashboard/charts";

import {
  hoverVariant,
  glowVariant,
  modalVariant,
  modalLinksVariant,
  textVariant,
  fadeIn,
} from "./motion";

import { isValidEthereumContractAddress, isNftContract } from "./createProject";

import {
  checkNftOwnership,
  approveProjectDetails,
  updateProjectDetails,
  getDataFromFireStore,
  assingProject,
  populateStates,
} from "./projectDetail";

export {
  convertSeconds,
  getDoughnutChartConfig,
  getLineChartConfig,
  hoverVariant,
  glowVariant,
  modalVariant,
  modalLinksVariant,
  textVariant,
  fadeIn,
  // firebaseApp,
  app,
  database,
  storage,
  isValidEthereumContractAddress,
  isNftContract,
  checkNftOwnership,
  approveProjectDetails,
  updateProjectDetails,
  getDataFromFireStore,
  assingProject,
  populateStates,
  formatBytes,
};
