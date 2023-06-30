import { ChartData, ChartOptions } from "chart.js";

type LineDataType = ChartData<"line", number[], string>;
type LineOptionsType = ChartOptions<"line">;

export type { LineDataType, LineOptionsType };
