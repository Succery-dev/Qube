// Interface Imports
import { ProjectDetailInterface } from "../../../interfaces";

// Type Imports
import { LineOptionsType, LineDataType } from "../../../types";

export function getLineChartConfig(
  mockData: ProjectDetailInterface[]
): [data: LineDataType, totalAmount: number, options: LineOptionsType] {
  let totalAmount: number = 0;
  const data: LineDataType = mockData.reduce(
    (accumulator: LineDataType, current: ProjectDetailInterface) => {
      if (!accumulator.labels) {
        accumulator.labels = [];
      }

      if (!accumulator.datasets) {
        accumulator.datasets = [
          {
            data: [],
          },
        ];
      }

      accumulator.labels.push(current.project);
      accumulator.datasets[0].data?.push(current.amount);

      totalAmount += current.amount;

      return accumulator;
    },
    {} as LineDataType
  );

  data.datasets[0] = {
    ...data.datasets[0],
    label: "Price-Project",
    backgroundColor: "transparent",
    borderColor: "#3E8EEC",
    pointBackgroundColor: "#3E8EEC",
  };

  const options: LineOptionsType = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          color: (context) => {
            if (context.index === 0) {
              return "white";
            } else {
              return "black";
            }
          },
        },
        ticks: {
          display: false,
          color: "white",
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          display: true,
          color: "white",
          callback: (value: number | string): string => {
            if (typeof value === "number") {
              if (value >= 0 && value < 1000) {
                return `$${value}`;
              } else if (value >= 1000 && value < 1000000) {
                return `$${Math.round(value / 1000)}K`;
              } else if (value >= 1000000 && value < 1000000000) {
                return `$${Math.round(value / 1000)}M`;
              } else {
                return `$${value}`;
              }
            } else {
              return value;
            }
          },
        },
        grid: {
          display: true,
          color: (context) => {
            if (context.index === 0) {
              return "white";
            } else {
              return "black";
            }
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    layout: {
      padding: {
        top: 10,
      },
    },
  };

  return [data, totalAmount, options];
}
