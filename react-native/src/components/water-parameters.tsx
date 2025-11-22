import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { supabase } from "../lib/supabaseClient";
import { useUserContext } from "../context/userContext";
import { Parametro, ParametroTipo } from "../interfaces";
import { formatFechaBonita } from "../utils/formatFechaBonita";
import { useParametersRealTime } from "../hooks/useParametersRealTime";

const parameterValues: Record<
  ParametroTipo,
  {
    unit: string;
    info: string;
    icon: string;
    status: "normal" | "warning" | "danger";
  }
> = {
  [ParametroTipo.TEMPERATURA]: {
    unit: "°C",
    info: "Rango ideal: 23-26°C",
    icon: "lucide:thermometer",
    status: "normal",
  },
  [ParametroTipo.PH]: {
    unit: "",
    info: "Rango ideal: 6.5-7.5",
    icon: "lucide:activity",
    status: "normal",
  },
  [ParametroTipo.DUREZA]: {
    unit: "dGH",
    info: "Rango ideal: 4-8 dGH",
    icon: "lucide:droplets",
    status: "normal",
  },
  [ParametroTipo.AMONIO]: {
    unit: "ppm",
    info: "Ideal: < 0.25 ppm",
    icon: "lucide:flask-conical",
    status: "warning",
  },
  [ParametroTipo.NITRITOS]: {
    unit: "ppm",
    info: "Ideal: 0 ppm",
    icon: "lucide:triangle-alert",
    status: "warning",
  },
  [ParametroTipo.NITRATOS]: {
    unit: "ppm",
    info: "Ideal: < 40 ppm",
    icon: "lucide:beaker",
    status: "warning",
  },
  [ParametroTipo.ALCALINIDAD]: {
    unit: "dKH",
    info: "Rango ideal: 3-8 dGH",
    icon: "lucide:waves",
    status: "warning",
  },
  [ParametroTipo.TDS]: {
    unit: "ppm",
    info: "Rango ideal: 150-300 ppm",
    icon: "lucide:scale",
    status: "warning",
  },
};

interface Props {
  tipoSeleccionado: ParametroTipo | null;
  setTipoSeleccionado: (tipo: ParametroTipo | null) => void;
}

export const WaterParameters = ({
  tipoSeleccionado,
  setTipoSeleccionado,
}: Props) => {
  const statusColors = {
    normal: "text-success-500",
    warning: "text-warning-500",
    danger: "text-danger-500",
  };

  const { filteredParameters, loading } =
    useParametersRealTime(tipoSeleccionado);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Parámetros del agua</h3>
        </div>
        {tipoSeleccionado && (
          <Button
            onPress={() => setTipoSeleccionado(null)}
            variant="light"
            size="sm"
          >
            Volver
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filteredParameters.map((param) => (
          <button
            key={param.id}
            onClick={() => {
              setTipoSeleccionado(param.tipo);
            }}
          >
            <Card className="parameter-card">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon={parameterValues[param.tipo].icon}
                      className={`${
                        statusColors[parameterValues[param.tipo].status]
                      }`}
                    />
                    <span className="text-sm font-mediusm">{param.tipo}</span>
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-semibold">{param.valor}</span>
                  <span className="text-xs text-foreground-500 mb-1">
                    {parameterValues[param.tipo].unit}
                  </span>
                </div>
                <p className="text-[10px] opacity-60">
                  {parameterValues[param.tipo].info}
                </p>
                <p className="text-[10px] opacity-60">
                  {formatFechaBonita(param.fecha_hora)}
                </p>
              </CardBody>
            </Card>
          </button>
        ))}
        {filteredParameters.length === 0 && (
          <div className="col-span-2 text-center text-foreground-500 text-xs py-4">
            {loading ? "Cargando..." : "No hay parámetros disponibles aún."}
          </div>
        )}
      </div>
    </div>
  );
};
