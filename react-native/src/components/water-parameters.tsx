import React from "react";
import { Card, CardBody, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ParameterCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "danger";
  info?: string;
}

const ParameterCard: React.FC<ParameterCardProps> = ({
  icon,
  label,
  value,
  unit,
  status,
  info,
}) => {
  const statusColors = {
    normal: "text-success-500",
    warning: "text-warning-500",
    danger: "text-danger-500",
  };

  return (
    <Card className="parameter-card">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon icon={icon} className={`${statusColors[status]}`} />
            <span className="text-sm font-mediusm">{label}</span>
          </div>
          {/* {info && (
            <Tooltip content={info}>
              <button className="text-foreground-400">
                <Icon icon="lucide:info" className="text-sm" />
              </button>
            </Tooltip>
          )} */}
        </div>
        <div className="flex items-end gap-1">
          <span className="text-xl font-semibold">{value}</span>
          <span className="text-xs text-foreground-500 mb-1">{unit}</span>
        </div>
        <p className="text-[10px] opacity-60">{info}</p>
      </CardBody>
    </Card>
  );
};

interface WaterParametersProps {
  tankId: number;
}

export const WaterParameters: React.FC<WaterParametersProps> = ({ tankId }) => {
  // Different parameters based on tank ID
  const parametersByTank = {
    1: [
      {
        icon: "lucide:thermometer",
        label: "Temperatura",
        value: 24.5,
        unit: "°C",
        status: "normal" as const,
        info: "Rango ideal: 23-26°C",
      },
      {
        icon: "lucide:activity",
        label: "pH",
        value: 6.8,
        unit: "",
        status: "normal" as const,
        info: "Rango ideal: 6.5-7.5",
      },
      {
        icon: "lucide:droplets",
        label: "Dureza",
        value: 8,
        unit: "dGH",
        status: "normal" as const,
        info: "Rango ideal: 4-8 dGH",
      },
      {
        icon: "lucide:flask-conical",
        label: "Amonio",
        value: 0.25,
        unit: "ppm",
        status: "warning" as const,
        info: "Ideal: < 0.25 ppm",
      },
      {
        icon: "lucide:triangle-alert",
        label: "Nitritos (No2)",
        value: 0,
        unit: "ppm",
        status: "warning" as const,
        info: "Ideal: 0 ppm",
      },
      {
        icon: "lucide:beaker",
        label: "Nitratos(No3)",
        value: 20,
        unit: "ppm",
        status: "warning" as const,
        info: "Ideal: < 40 ppm",
      },
      {
        icon: "lucide:waves",
        label: "Alcalinidad",
        value: 8,
        unit: "dKH",
        status: "warning" as const,
        info: "Rango ideal: 3-8 dGH",
      },
      {
        icon: "lucide:scale",
        label: "TDS",
        value: 250,
        unit: "ppm",
        status: "warning" as const,
        info: "Rango ideal: 150-300 ppm",
      },
    ],
    2: [
      {
        icon: "lucide:thermometer",
        label: "Temperatura",
        value: 25.2,
        unit: "°C",
        status: "normal" as const,
        info: "Rango ideal: 24-28°C",
      },
      {
        icon: "lucide:activity",
        label: "pH",
        value: 7.2,
        unit: "",
        status: "normal" as const,
        info: "Rango ideal: 6.8-7.5",
      },
      {
        icon: "lucide:flask-conical",
        label: "Amonio",
        value: 0.1,
        unit: "ppm",
        status: "normal" as const,
        info: "Ideal: <0.25 ppm",
      },
      {
        icon: "lucide:droplets",
        label: "CO₂",
        value: 15,
        unit: "ppm",
        status: "normal" as const,
        info: "Rango ideal: 10-30 ppm",
      },
    ],
  };

  const parameters =
    parametersByTank[tankId as keyof typeof parametersByTank] ||
    parametersByTank[1];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Parámetros del agua</h3>
      <div className="grid grid-cols-2 gap-3">
        {parameters.map((param, index) => (
          <ParameterCard
            key={index}
            icon={param.icon}
            label={param.label}
            value={param.value}
            unit={param.unit}
            status={param.status}
            info={param.info}
          />
        ))}
      </div>
    </div>
  );
};
