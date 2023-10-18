import { convertSeconds } from "./convertSeconds";

/**
 * @dev TEMPORARILY commenting this firebase app
 * @todo use this app for production
 */
// import { firebaseApp } from "./firebase";
import { firebaseApp, database, storage } from "./firebase";

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

// import { isValidEthereumContractAddress, isNftContract } from "./createProject";

import {
  // checkNftOwnership,
  approveProjectDetails,
  updateProjectDetails,
  getDataFromFireStore,
  assignProject,
  populateStates,
} from "./projectDetail";

import { uploadDeliverables } from "./project/uploadDeliverables";

import { convertState } from "./convertState";
import { activeUserByStatus } from "./activeUserByStatus";

import { getFormattedDate } from "./getFormattedDate";

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
  firebaseApp,
  database,
  storage,
  // isValidEthereumContractAddress,
  // isNftContract,
  // checkNftOwnership,
  approveProjectDetails,
  updateProjectDetails,
  getDataFromFireStore,
  assignProject,
  populateStates,
  formatBytes,

  // firebaseApp,
  uploadDeliverables,

  convertState,
  activeUserByStatus,

  getFormattedDate,
};
