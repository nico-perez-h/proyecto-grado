import React from "react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface DataPoint {
  time: string;
  temperature: number;
}

interface TemperatureChartProps {
  tankId?: number;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ tankId = 1 }) => {
  // Different temperature data based on tank ID
  const dataByTank = {
    1: [
      { time: "00:00", temperature: 24.2 },
      { time: "04:00", temperature: 24.0 },
      { time: "08:00", temperature: 24.3 },
      { time: "12:00", temperature: 24.8 },
      { time: "16:00", temperature: 25.1 },
      { time: "20:00", temperature: 24.7 },
      { time: "Ahora", temperature: 24.5 },
    ],
    2: [
      { time: "00:00", temperature: 25.0 },
      { time: "04:00", temperature: 24.8 },
      { time: "08:00", temperature: 25.2 },
      { time: "12:00", temperature: 25.5 },
      { time: "16:00", temperature: 25.7 },
      { time: "20:00", temperature: 25.4 },
      { time: "Ahora", temperature: 25.2 },
    ]
  };

  const [data, setData] = React.useState<DataPoint[]>(dataByTank[tankId as keyof typeof dataByTank] || dataByTank[1]);

  // Update data when tankId changes
  React.useEffect(() => {
    setData(dataByTank[tankId as keyof typeof dataByTank] || dataByTank[1]);
  }, [tankId]);

  return (
    <div className="chart-container w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--heroui-primary-500))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--heroui-primary-500))" stopOpacity={0} />
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
              backgroundColor: 'hsl(var(--heroui-content1))', 
              borderColor: 'hsl(var(--heroui-divider))',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => [`${value}°C`, 'Temperatura']}
          />
          <Area 
            type="monotone" 
            dataKey="temperature" 
            stroke="hsl(var(--heroui-primary-500))" 
            fill="url(#temperatureGradient)" 
            strokeWidth={2}
            activeDot={{ 
              r: 6, 
              stroke: 'hsl(var(--heroui-primary-600))',
              strokeWidth: 1,
              fill: 'hsl(var(--heroui-background))'
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};