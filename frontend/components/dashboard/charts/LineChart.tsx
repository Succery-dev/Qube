import React from "react";

// Chart Imports
import { Line } from "react-chartjs-2";
import {
  Chart as Chartjs,
  LineElement,
  CategoryScale, // x-axis
  LinearScale, //y-axis
  PointElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";

// Interface Imports
import { ProjectDetailInterface } from "../../../interfaces";

// Helper Funtions Imports
import { getLineChartConfig } from "../../../utils";

// Type Imports
import { LineDataType, LineOptionsType } from "../../../types";

Chartjs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  Filler
);

const LineChart = ({
  mockData,
}: {
  mockData: ProjectDetailInterface[];
}): JSX.Element => {
  const [data, totalAmount, options]: [
    data: LineDataType,
    totalAmount: number,
    options: LineOptionsType
  ] = getLineChartConfig(mockData);

  return (
    <div className="sm:w-2/3 w-full h-80 xl:h-[500px] lg:h-[350px] sm:h-[300px] rounded-lg lg:p-[3px] p-[2px] blue-transparent-green-gradient-vertical shadow-card">
      <div className="w-full h-full bg-black rounded-lg p-4 grid place-items-center">
        <div className="h-[90%] w-[100%]">
          <Line data={data} options={options} />
        </div>
        <div className="md:text-lg font-semibold">
          <p>
            Total Amount:{" "}
            <span className="font-bold text-primary md:text-xl">
              ${totalAmount}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
