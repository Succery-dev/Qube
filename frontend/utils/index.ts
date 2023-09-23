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

import { populateStates, assingProject } from "./projectDetail";

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
  populateStates,
  assingProject,
  formatBytes,
};
