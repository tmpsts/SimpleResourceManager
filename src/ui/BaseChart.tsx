import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";

type BaseChartProps = {
  data: { value: number | undefined }[];
  fill: string;
  stroke: string;
};

export function BaseChart(props: BaseChartProps) {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <AreaChart
        data={props.data}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Area
          fillOpacity={0.3}
          fill={props.fill}
          stroke={props.stroke}
          strokeWidth={1}
          type="monotone"
          dataKey="value"
          isAnimationActive={false}
        />
        <XAxis stroke="transparent" height={0} />
        <YAxis domain={[0, 100]} stroke="transparent" width={0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
