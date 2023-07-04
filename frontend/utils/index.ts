import { convertSeconds } from "./convertSeconds";

/**
 * @dev TEMPORARILY commenting this firebase app
 * @todo use this app for production
 */
// import { firebaseApp } from "./firebase";
import { app, database } from "./firebase";

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
  isValidEthereumContractAddress,
  isNftContract,
  checkNftOwnership,
  approveProjectDetails,
  updateProjectDetails,
  getDataFromFireStore,
};
