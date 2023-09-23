import { SectionWrapperPropsInterface } from "./sectionWrapper";

// Dashboard Imports
import { ProjectDataInterface, ProjectDetailInterface } from "./dashboard";

// HP Imports
import {
  ProblemsInterface,
  FeaturesInterface,
  WalkthroughInterface,
  SupportInterface,
} from "./hp";

// Project Imports
import {
  CreateProjectFieldInterface,
  CreateProjectFormInterface,
  CreateProjectFormContextInterface,
  TypeDataDomainInterface,
  SubmitDeliverablesInterface,
  SumbitFileInterface,
} from "./project";

// projectDetails Imports
import {
  StoreProjectDetailsInterface,
  DisplayProjectDetailsInterface,
  // StoreFileDeliverableInterface,
  DisplayFileDeliverableInterface,
  DescriptionProjectDetailsInterface,
  DisplayTextDeliverableInterface,
} from "./projectDetails";

// Notification Imports
import {
  NotificationContextInterface,
  NotificationConfigurationInterface,
} from "./notificationContextInterface";

// Lighthouse
import { ProgressDataInterface } from "./lighthouse";

// Firestore Interfaces
import {
  // Projects Collection
  StoreFileDeliverableInterface,
  ProjectDisplayInterface,
  ProjectsCollectionInterface,
  // Users Collection
  UsersCollectionIterface,
} from "./Firestore";

export type {
  ProjectDataInterface,
  ProjectDetailInterface,
  WalkthroughInterface,
  SupportInterface,
  ProblemsInterface,
  FeaturesInterface,
  SectionWrapperPropsInterface,
  CreateProjectFieldInterface,
  CreateProjectFormInterface,
  CreateProjectFormContextInterface,
  TypeDataDomainInterface,
  NotificationContextInterface,
  NotificationConfigurationInterface,
  StoreProjectDetailsInterface,
  DisplayProjectDetailsInterface,
  // StoreFileDeliverableInterface,
  DisplayFileDeliverableInterface,
  DescriptionProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  SubmitDeliverablesInterface,
  SumbitFileInterface,
  ProgressDataInterface,
  // Projects Collection
  StoreFileDeliverableInterface,
  ProjectDisplayInterface,
  ProjectsCollectionInterface,
  // Users Collection
  UsersCollectionIterface,
};
