import React from "react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useParametersRealTime } from "../hooks/useParametersRealTime";
import { ParametroTipo } from "../interfaces";
import { useUserContext } from "../context/userContext";
import celsiusToFarenheit from "../utils/celsiusToFarenheit";

interface DataPoint {
  time: string;
  temperature: number;
}

const chartSettings: Record<
  ParametroTipo,
  {
    color: string;
    medida: string;
    min: number;
    max: number;
  }
> = {
  [ParametroTipo.TEMPERATURA]: {
    color: "hsl(var(--heroui-primary-500))",
    medida: ":temperature_unit",
    min: 0,
    max: 0,
  },
  [ParametroTipo.PH]: {
    color: "hsl(var(--heroui-secondary-500))",
    medida: "",
    min: 6.5,
    max: 7.5,
  },
  [ParametroTipo.DUREZA]: {
    color: "hsl(var(--heroui-danger-500))",
    medida: "dGH",
    min: 4,
    max: 8,
  },
  [ParametroTipo.AMONIO]: {
    color: "hsl(var(--heroui-warning-500))",
    medida: "ppm",
    min: 0,
    max: 0.25,
  },
  [ParametroTipo.NITRITOS]: {
    color: "hsl(var(--heroui-info-500))",
    medida: "ppm",
    min: 0,
    max: 0,
  },
  [ParametroTipo.NITRATOS]: {
    color: "hsl(var(--heroui-success-500))",
    medida: "ppm",
    min: 0,
    max: 40,
  },
  [ParametroTipo.ALCALINIDAD]: {
    color: "hsl(var(--heroui-purple-500))",
    medida: "dKH",
    min: 3,
    max: 8,
  },
  [ParametroTipo.TDS]: {
    color: "hsl(var(--heroui-pink-500))",
    medida: "ppm",
    min: 150,
    max: 300,
  },
};

const calculatePercentage = (
  value: number,
  min: number,
  max: number
): number => {
  const percent = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(percent, 100)); // garantiza que esté entre 0 y 100
};

export const Statistics = () => {
  const [selectedParameter, setSelectedParameter] =
    React.useState<ParametroTipo>(ParametroTipo.TEMPERATURA);

  const { acuarioSeleccionado, user } = useUserContext();
  const { filteredParameters, parameters } =
    useParametersRealTime(selectedParameter);

  const reversed = [...filteredParameters].reverse();

  const data: DataPoint[] = reversed.map((param) => {
    const date = new Date(param.fecha_hora);
    date.setHours(date.getHours() - 4);
    return {
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature:
        param.tipo === ParametroTipo.TEMPERATURA
          ? user.celsius
            ? param.valor
            : celsiusToFarenheit(param.valor)
          : param.valor,
    };
  });

  const lastTemp = parameters
    .filter((p) => p.tipo === ParametroTipo.TEMPERATURA)
    .sort(
      (a, b) =>
        new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
    )[0]?.valor;
  const lastTempPercent = calculatePercentage(
    lastTemp ?? acuarioSeleccionado.temp_min,
    acuarioSeleccionado.temp_min,
    acuarioSeleccionado.temp_max
  );

  const lastPh = parameters
    .filter((p) => p.tipo === ParametroTipo.PH)
    .sort(
      (a, b) =>
        new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
    )[0]?.valor;
  const lastPhPercent = calculatePercentage(
    lastPh ?? acuarioSeleccionado.ph_min,
    acuarioSeleccionado.ph_min,
    acuarioSeleccionado.ph_max
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Estadísticas</h2>

      <Card>
        <CardBody className="p-4">
          <Tabs
            aria-label="Parámetros"
            selectedKey={selectedParameter}
            onSelectionChange={setSelectedParameter as any}
            variant="bordered"
            color="primary"
            size="sm"
            className="mb-6"
          >
            {Object.values(ParametroTipo).map((tipo) => (
              <Tab key={tipo} title={tipo} />
            ))}
          </Tabs>

          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="dynamicGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartSettings[selectedParameter].color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartSettings[selectedParameter].color}
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
                  domain={[
                    selectedParameter === ParametroTipo.TEMPERATURA
                      ? user.celsius
                        ? acuarioSeleccionado.temp_min
                        : celsiusToFarenheit(acuarioSeleccionado.temp_min)
                      : chartSettings[selectedParameter].min,
                    selectedParameter === ParametroTipo.TEMPERATURA
                      ? user.celsius
                        ? acuarioSeleccionado.temp_max
                        : celsiusToFarenheit(acuarioSeleccionado.temp_max)
                      : chartSettings[selectedParameter].max,
                  ]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--heroui-content1))",
                    borderColor: "hsl(var(--heroui-divider))",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [
                    `${value}${chartSettings[selectedParameter].medida.replace(
                      ":temperature_unit",
                      user.celsius ? "°C" : "°F"
                    )}`,
                    "Temperatura",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke={chartSettings[selectedParameter].color}
                  fill="url(#dynamicGradient)"
                  strokeWidth={2}
                  activeDot={{
                    r: 6,
                    stroke: chartSettings[selectedParameter].color,
                    strokeWidth: 1,
                    fill: "hsl(var(--heroui-background))",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-4">
          <h3 className="text-lg font-semibold mb-4">Rangos ideales</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    lastTempPercent >= 100 ? "text-[#FF0000]" : ""
                  }`}
                >
                  Temperatura
                </span>
                <span className="text-sm text-foreground-500">
                  {user.celsius
                    ? acuarioSeleccionado.temp_min
                    : celsiusToFarenheit(acuarioSeleccionado.temp_min)}
                  {user.celsius ? "°C" : "°F"} -{" "}
                  {user.celsius
                    ? acuarioSeleccionado.temp_max
                    : celsiusToFarenheit(acuarioSeleccionado.temp_max)}
                  {user.celsius ? "°C" : "°F"}
                </span>
              </div>
              <div className="h-2 bg-default-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full  ${
                    lastTempPercent >= 100 ? "bg-[#FF0000]" : "bg-primary-500"
                  }`}
                  style={{ width: `${lastTempPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    lastPhPercent >= 100 ? "text-[#FF0000]" : ""
                  }`}
                >
                  pH
                </span>
                <span className="text-sm text-foreground-500">
                  {acuarioSeleccionado.ph_min} - {acuarioSeleccionado.ph_max}
                </span>
              </div>
              <div className="h-2 bg-default-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    lastPhPercent >= 100 ? "bg-[#FF0000]" : "bg-secondary-500"
                  }`}
                  style={{ width: `${lastPhPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
