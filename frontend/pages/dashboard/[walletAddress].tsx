import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";

// Custom Components Imports
import {
  DoughnutChart,
  LineChart,
  CustomButton,
  Glow,
  Table,
} from "../../components";

// Constants Imports
import { 
  mockData,
  aesthetics,
  chartColors
} from "../../constants";

// Interfaces Imports
import {
  ProjectDataInterface,
  ProjectDetailInterface,
  SectionWrapperPropsInterface,
} from "../../interfaces";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { 
  fadeIn,
  textVariant
} from "../../utils";

// StatusEnum Import
import { StatusEnum } from "../../enums";

import { useAccount } from "wagmi";

const SectionWrapper: React.FC<SectionWrapperPropsInterface> = ({
  children,
  // bgColor,
  // glowStyles,
}): JSX.Element => {
  return (
    <motion.div
      className={`w-full h-screen grid grid-cols-12 xl:py-20 sm:py-14 py-14 overflow-hidden relative xl:min-h-[1024px] lg:min-h-[760px] sm:min-h-[500px] bg-custom-background bg-contain`}
    >
      {/* {glowStyles && <Glow styles={glowStyles} />} */}
      <div className="col-start-2 col-end-12 font-semibold relative">
        {children}
      </div>
    </motion.div>
  );
};

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { address, isDisconnected } = useAccount();
  const [data, setData] = useState({} as ProjectDataInterface);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/project/${address}`);
        const projects: ProjectDetailInterface[] = [];
        res.data.map((project: any) => {
          projects.push({
            project: project["Title"],
            deadline: project["Deadline(UTC)"],
            amount: parseInt(project["Reward(USDC)"]),  // string -> number
            status: Object.entries(StatusEnum).find(([key, value]) => value == project["Status"])[1] as StatusEnum,
            id: project["id"],
            tokenSymbol: project["tokenSymbol"],
            createdBy: project["createdBy"],
          });
        });
        mockData.data = projects;
        setData(mockData);
      } catch (error) {
        console.log("Error has occured with /api/project/[walletAddress].ts");
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    if (isDisconnected) {
      router.push("/");
    }
  }, [isDisconnected]);

  if (!data) {
    return null;
  }

  return (
    <div className="font-nunito text-secondary">
      {/* Dashboard Section */}
      <SectionWrapper
        bgColor="bg-bg_primary"
        glowStyles={aesthetics.glow.dashboardGlowStyles}
      >
        <div className="grid grid-cols-12 gap-1 pb-12">
          {/* Heading and Charts */}
          <div className="lg:col-start-2 lg:col-end-12 col-start-1 col-end-13">
            {/* Heading */}
            <div className="flex flex-row xs:gap-28 gap-8 items-center justify-between py-12 pb-6">
              <motion.h1
                variants={textVariant()}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="xl:text-6xl lg:text-5xl md:text-3xl sm:text-3xl text-3xl font-extrabold text-[#DF57EA]"
              >
                Projects
              </motion.h1>
              <CustomButton
                text="+ Create Project"
                styles="bg-[#DF57EA] lg:text-2xl sm:text-lg rounded-md text-center text-white px-3 py-2 md:px-6 md:py-3"
                type="button"
                onClick={() => router.push("/createProject")}
              />
            </div>
            {/* Charts */}
            {/* TODO: Remove the charts temporarily for the final pitch (Issue#67) */}
            {/* <div className="flex sm:flex-row flex-col gap-8 w-full">
              {data.data?.length > 0 && (
                <DoughnutChart mockData={data.data} chartColors={chartColors} />
              )}
              {data.data?.length > 0 && <LineChart mockData={data.data} />}
            </div> */}
          </div>
          {/* Table */}
          <motion.div
            variants={fadeIn("bottom", 0.4)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="lg:col-start-2 lg:col-end-12 col-start-1 col-end-13 my-8 bg-black rounded-lg xs:grid grid-rows-10 lg:p-[3px] p-[2px] border border-[#DF57EA] shadow-custom-pink"
          >
            {
              data.data?.length > 0 
                ? <Table projectData={data} />
                : <p className="m-5 text-center text-3xl">No Project Yet</p>
            }
          </motion.div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Dashboard;