import { convertSeconds } from "./convertSeconds";

import { firebaseApp } from "./firebase";

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
  firebaseApp,
  isValidEthereumContractAddress,
  isNftContract,
};
