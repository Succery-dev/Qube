// Assets Imports
import {
  DollarDownArrow,
  Ellipse25_17,
  Ellipse70,
  EscrowIcon,
  JuryIcon,
  LinkIcon,
  SmartContractIcon,
} from "../assets";

// Interfaces Imports
import {
  WalkthroughInterface,
  ProblemsInterface,
  FeaturesInterface,
  CreateProjectFieldInterface,
} from "../interfaces";

// Types Imports
import { ProjectDetailInterfaceKeysType } from "../types";

// Mock Data Import
import { mockData } from "./mockData";

export { mockData }

export const waitlistUrl: string = "https://docs.google.com/forms/d/e/1FAIpQLSfe3r7ia_OTCHU8tHEtNG_aPY6OpLDsLPl3RDj-wQLutXNTKg/viewform";

export const navLinks = [
  {
    id: "product",
    title: "Product",
  },
  {
    id: "walkthrough",
    title: "Walkthrough",
  },
  {
    id: "features",
    title: "Features",
  },
];

export const currentSystemProblems: ProblemsInterface[] = [
  {
    id: "70%nonPayment",
    image: Ellipse70,
    description: {
      main: "70% of freelancers have experienced nonpayment or late payment at some point",
      footer: "study by the Freelancers Union",
    },
  },
  {
    id: "$5985Loss",
    image: DollarDownArrow,
    description: {
      main: "An Average freelancer loses $5,968 per year due to nonpayment or late payment",
      footer: "study by the Freelancers Union",
    },
  },
  {
    id: "25%-17%Scam",
    image: Ellipse25_17,
    description: {
      main: "25% freelancers and 17% clients reported that they had been scammed",
      footer: "Report by freelancer.com 2019",
    },
  },
];

export const walkthrough: WalkthroughInterface[] = [
  {
    id: "walkthrough-1",
    description:
      "Clients easily create custom smart contracts with the lancer’s wallet address",
  },
  {
    id: "walkthrough-2",
    description: "Lancer reviews and signs the contract",
  },
  {
    id: "walkthrough-3",
    description:
      "Client sends the amount to an Escrow account mutually owned by lancer and Client",
  },
  {
    id: "walkthrough-4",
    description: "Auto payment to lancer on completing the task",
  },
  {
    id: "walkthrough-5",
    description:
      "Fair dispute resolution by neutral  third party using Kleros, if there is any",
  },
];

export const features: FeaturesInterface[] = [
  {
    id: "Escrow",
    title: "Escrow",
    image: EscrowIcon,
    description:
      "Qubepay will hold the hiring company’s money until the company get satisfied with the work and pay the freelancer ",
  },
  {
    id: "Arbitration",
    title: "Arbitration",
    image: JuryIcon,
    description:
      "If there is any disagreement between the hiring party and lancers, we will provide dispute resolution",
  },
  {
    id: "LinkBased",
    title: "Link based",
    image: LinkIcon,
    description:
      "Generate a direct link of a contract describing the project and its payment details to share on any platform",
  },
  {
    id: "SmartContract",
    title: "Smart Contract",
    image: SmartContractIcon,
    description:
      "Qubepay has a protocol stored in the blockchain. Thus it's transparent and trustworthy. No middleman is involved.",
  },
];

export const footerLinks = [
  {
    id: "privacy_policy",
    title: "Privacy Policy",
    link: "https://veroo.notion.site/Privacy-Policy-4538184bcaee4835a2dedcc464496cdd",
  },
  {
    id: "terms_7_conditions",
    title: "Terms & Conditions",
    link: "https://veroo.notion.site/Terms-and-Conditions-e56f60533a834abbbd1213c6bf0cd36f",
  },
  {
    id: "2023_QubePay_org",
    title: "© 2023 QubePay org",
    link: "/",
  },
];

// TODO: remove if not needed
// export const aesthetics = {
//   glow: {
//     introSectionGlowStyles: [
//       "bg-[#2563EB] top-[13%] right-[7%] w-[153px] h-[153px] blur-[150px]",
//       "bg-[#00FFFF] top-[55%] right-[17%] w-[153px] h-[153px] blur-[150px]",
//       "bg-[#2563EB] bottom-[9%] left-[5%] w-[153px] h-[153px] blur-[150px]",
//     ],
//     currentSystemProblemsStyles: [
//       "bg-[#2563EB] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  w-[153px] h-[153px] blur-[150px]",
//     ],
//     walkthroughGlowStyles: [
//       "bg-[#00FFFF] w-[306px] h-[306px] blur-[300px] top-[25%] -left-[5%]",
//       "bg-[#00FFFF] w-[306px] h-[306px] blur-[300px] top-[50%] right-0",
//       "bg-[#2563EB] w-[306px] h-[306px] blur-[300px] top-[60%] left-1/2",
//     ],
//     featuresGlowStyles: [
//       "bg-[#00FFFF] w-[90px] h-[90px] blur-[300px] top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2",
//       "bg-[#00FFFF] w-[90px] h-[90px] blur-[300px] top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2",
//       "bg-[#2563EB] w-[180px] h-[180px] blur-[300px] top-[53%] left-1/2 -translate-x-1/2 -translate-y-1/2",
//       "bg-[#2563EB] w-[180px] h-[180px] blur-[300px] top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2",
//     ],
//   },
// };

export const aesthetics = {
  glow: {
    introSectionGlowStyles: [
      {
        backgroundColor: "#2563EB",
        top: "25%",
        right: "13%",
        width: "153px",
        height: "153px",
        filter: "blur(150px)",
      },

      {
        backgroundColor: "#2563EB",
        bottom: "17%",
        left: "14%",
        width: "153px",
        height: "153px",
        filter: "blur(150px)",
      },
      {
        backgroundColor: "#00FFFF",
        top: "55%",
        right: "20%",
        width: "153px",
        height: "153px",
        filter: "blur(150px)",
      },
    ],

    currentSystemProblemsStyles: [
      {
        backgroundColor: "#2563EB",
        top: "50%",
        left: "50%",
        width: "153px",
        height: "153px",
        filter: "blur(150px)",
        transform: "translate(-50%, -50%)",
      },
    ],

    walkthroughGlowStyles: [
      {
        backgroundColor: "#00FFFF",
        top: "25%",
        left: "-5%",
        width: "200px",
        height: "200px",
        filter: "blur(200px)",
      },
      {
        backgroundColor: "#00FFFF",
        top: "50%",
        right: "0%",
        width: "200px",
        height: "200px",
        filter: "blur(200px)",
      },
      {
        backgroundColor: "#2563EB",
        top: "60%",
        left: "50%",
        width: "200px",
        height: "200px",
        filter: "blur(200px)",
      },
    ],

    featuresGlowStyles: [
      {
        backgroundColor: "#00FFFF",
        top: "50%",
        left: "50%",
        width: "90px",
        height: "90px",
        filter: "blur(300px)",
        transform: "translate(-50%, -50%)",
      },
      {
        backgroundColor: "#00FFFF",
        top: "52%",
        left: "50%",
        width: "90px",
        height: "90px",
        filter: "blur(300px)",
        transform: "translate(-50%, -50%)",
      },
      {
        backgroundColor: "#2563EB",
        top: "49%",
        left: "50%",
        width: "200px",
        height: "200px",
        filter: "blur(300px)",
        transform: "translate(-50%, -50%)",
      },
      {
        backgroundColor: "#2563EB",
        top: "53%",
        left: "50%",
        width: "200px",
        height: "200px",
        filter: "blur(300px)",
        transform: "translate(-50%, -50%)",
      },
    ],
    mobileNavbarGlowStyles: [
      {
        backgroundColor: "#2563EB",
        bottom: "0%",
        left: "0%",
        width: "100px",
        height: "100px",
        filter: "blur(125px)",
      },
      {
        backgroundColor: "#00FFFF",
        top: "0%",
        right: "0%",
        width: "100px",
        height: "100px",
        filter: "blur(125px)",
      },
    ],
    dashboardGlowStyles: [
      {
        backgroundColor: "#00FFFF",
        bottom: "10%",
        left: "45%",
        width: "500px",
        height: "500px",
        filter: "blur(500px)",
      },
      {
        backgroundColor: "#2563EB",
        top: "5%",
        right: "55%",
        width: "500px",
        height: "500px",
        filter: "blur(500px)",
      },
    ],
    createProjectGlowStyles: [
      {
        backgroundColor: "#00FFFF",
        top: "50%",
        right: "10%",
        width: "200px",
        height: "200px",
        filter: "blur(200px)",
        transform: "translateY(-50%)",
      },
      {
        backgroundColor: "#2563EB",
        top: "50%",
        left: "0%",
        width: "200px",
        height: "200px",
        filter: "blur(200px)",
        transform: "translateY(-50%)",
      },
    ],
  },
};

export const chartColors: string[] = [
  "#3E8EEC",
  "#FFAD4E",
  "#F1FF4E",
  "#91FF4E",
  "#FF634E",
];

export const projectDetailsInterfaceKeys: ProjectDetailInterfaceKeysType = [
  "project",
  "deadline",
  "amount",
  "status",
];

export const createProjectFields: CreateProjectFieldInterface[] = [
  {
    title: "Title",
    placeholder: "E-Commerce Website",
    type: "text",
  },
  {
    title: "Detail",
    placeholder: "Description and Features",
    type: "textArea",
  },
  {
    title: "Deadline(UTC)",
    placeholder: "",
    type: "datetime-local",
  },
  {
    title: "Reward(USDC)",
    placeholder: "500",
    type: "number",
  },
  {
    title: "Lancer's Wallet Address",
    placeholder: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    type: "string",
  },
];