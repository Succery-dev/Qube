import React from "react";

// Chart Imports
import { Chart as Chartjs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Enums  Imports
import { StatusEnum } from "../../../enums";

// Interface Imports
import { ProjectDetailInterface } from "../../../interfaces";

// Helper Function Imports
import { getDoughnutChartConfig } from "../../../utils";

// Type Imports
import { DoughnutDataType, DoughnutOptionsType } from "../../../types";

Chartjs.register(ArcElement, Tooltip, Legend);

const DoughnutChartLegend = ({
  frequencyCount,
  chartColors,
}: {
  frequencyCount: Record<StatusEnum, number>;
  chartColors: string[];
}): JSX.Element => {
  return (
    <div className="h-1/3 w-4/5 mx-auto flex flex-row sm:flex-col flex-wrap px-4 pb-4 sm:pb-0">
      {Object.keys(frequencyCount).map((status, index) => {
        return (
          <div
            className="flex flex-row items-center gap-1 sm:gap-4 basis-1/2 sm:basis-0 text-sm sm:text-xs lg:text-sm xl:text-lg text-secondary font-light"
            key={`doughnut-chart-legend-${index}`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: `${chartColors[index]}`,
              }}
            ></div>
            <p>{status}</p>
          </div>
        );
      })}
    </div>
  );
};

const DoughnutChart = ({
  mockData,
  chartColors,
}: {
  mockData: ProjectDetailInterface[];
  chartColors: string[];
}): JSX.Element => {
  const [data, totalProjects, options, frequencyCount]: [
    data: DoughnutDataType,
    totalProjects: number,
    options: DoughnutOptionsType,
    frequencyCount: Record<StatusEnum, number>
  ] = getDoughnutChartConfig(mockData, chartColors);

  return (
    <div className="relative sm:w-1/3 w-full h-80 xl:h-[500px] lg:h-[350px] sm:h-[300px] rounded-lg lg:p-[3px] p-[2px] blue-transparent-green-gradient-vertical shadow-card">
      <div className="relative w-full h-full bg-black rounded-lg">
        <div className="relative w-full h-2/3 p-4 grid place-items-center">
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="font-bold xl:text-2xl">{`${totalProjects}`}</span>
            <br />
            <span className=" text-sm sm:text-[10px] xl:text-lg">
              Total Projects
            </span>
          </p>
          <Doughnut data={data} options={options} />
        </div>
        {/* Legend */}
        <DoughnutChartLegend
          frequencyCount={frequencyCount}
          chartColors={chartColors}
        />
      </div>
    </div>
  );
};

export default DoughnutChart;
