import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useParametersRealTime } from "../hooks/useParametersRealTime";
import { ParametroTipo } from "../interfaces";

interface DataPoint {
  time: string;
  temperature: number;
}

export const TemperatureChart = () => {
  const { filteredParameters } = useParametersRealTime(
    ParametroTipo.TEMPERATURA,
    10
  );

  const reversed = [...filteredParameters].reverse();

  const data: DataPoint[] = reversed.map((param) => {
    const date = new Date(param.fecha_hora);
    date.setHours(date.getHours() - 4);
    return {
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: param.valor,
    };
  });

  return (
    <div className="chart-container" style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient
              id="temperatureGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--heroui-primary-500))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--heroui-primary-500))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={[23, 26]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            width={30}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--heroui-content1))",
              borderColor: "hsl(var(--heroui-divider))",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number) => [`${value}°C`, "Temperatura"]}
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="hsl(var(--heroui-primary-500))"
            fill="url(#temperatureGradient)"
            strokeWidth={2}
            activeDot={{
              r: 6,
              stroke: "hsl(var(--heroui-primary-600))",
              strokeWidth: 1,
              fill: "hsl(var(--heroui-background))",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
