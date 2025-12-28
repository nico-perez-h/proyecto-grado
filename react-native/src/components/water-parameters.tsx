import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { supabase } from "../lib/supabaseClient";
import { useUserContext } from "../context/userContext";
import { Parametro, ParametroTipo } from "../interfaces";
import { formatFechaBonita } from "../utils/formatFechaBonita";
import { useParametersRealTime } from "../hooks/useParametersRealTime";
import celsiusToFarenheit from "../utils/celsiusToFarenheit";

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
    unit: "",
    info: "",
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
    info: "Rango ideal: 3-8 dKH",
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
  isNewParameter: boolean;
  setIsNewParameter: (value: boolean) => void;
}

export const WaterParameters = ({
  tipoSeleccionado,
  setTipoSeleccionado,
  isNewParameter,
  setIsNewParameter,
}: Props) => {
  const statusColors = {
    normal: "text-success-500",
    warning: "text-warning-500",
    danger: "text-danger-500",
  };

  const { user, acuarioSeleccionado } = useUserContext();
  const { filteredParameters, loading } =
    useParametersRealTime(tipoSeleccionado);

  const [newParameterForm, setNewParameterForm] = useState({
    valor: "",
    tipo: "",
  });

  const sendNewParameter = async () => {
    if (!newParameterForm.valor.trim()) {
      return alert("Ingresa un valor válido para el nuevo parámetro.");
    }
    if (!newParameterForm.tipo) {
      return alert("Selecciona un tipo de parámetro.");
    }

    const { data, error } = await supabase
      .from("parametros")
      .insert([
        {
          id_acuario: acuarioSeleccionado.id,
          tipo: newParameterForm.tipo as ParametroTipo,
          valor: parseFloat(newParameterForm.valor),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error al agregar el nuevo parámetro:", error);
      return alert("Hubo un error al agregar el nuevo parámetro.");
    }

    setNewParameterForm({ valor: "", tipo: "" });
    setIsNewParameter(false);
    alert("Nuevo parámetro agregado correctamente.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Parámetros del agua</h3>
        </div>
        {tipoSeleccionado || isNewParameter ? (
          <Button
            onPress={() => {
              setTipoSeleccionado(null);
              setIsNewParameter(false);
            }}
            variant="light"
            size="sm"
          >
            Volver
          </Button>
        ) : (
          <Button
            onPress={() => setIsNewParameter(true)}
            variant="light"
            size="sm"
            endContent={<Icon icon="lucide:plus" />}
          >
            Nuevo
          </Button>
        )}
      </div>
      {isNewParameter && (
        <div className="flex flex-col gap-4">
          <div className="text-sm text-foreground-500 flex gap-4">
            <Input
              label="Nuevo valor"
              type="number"
              className="input-no-zoom"
              value={newParameterForm.valor}
              onChange={(e) =>
                setNewParameterForm((prev) => ({
                  ...prev,
                  valor: e.target.value,
                }))
              }
            />
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  color="primary"
                  endContent={<Icon icon="lucide:chevron-down" />}
                  className="h-[56px]"
                >
                  {newParameterForm.tipo || "Seleccionar parámetro"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Seleccionar acuario">
                {Object.values(ParametroTipo).map((tipo) => (
                  <DropdownItem
                    key={tipo}
                    onPress={() =>
                      setNewParameterForm((prev) => ({
                        ...prev,
                        tipo,
                      }))
                    }
                    startContent={
                      <div className={`w-2 h-2 rounded-full bg-gray-200`} />
                    }
                  >
                    {tipo}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <Button onPress={sendNewParameter} variant="solid" color="primary">
            Guardar
          </Button>
        </div>
      )}
      {!isNewParameter && (
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
                    <span className="text-xl font-semibold">
                      {param.tipo === ParametroTipo.TEMPERATURA
                        ? user.celsius
                          ? param.valor
                          : celsiusToFarenheit(param.valor)
                        : param.valor}
                    </span>
                    <span className="text-xs text-foreground-500 mb-1">
                      {param.tipo === ParametroTipo.TEMPERATURA
                        ? user.celsius
                          ? "°C"
                          : "°F"
                        : parameterValues[param.tipo].unit}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-60">
                    {param.tipo === ParametroTipo.TEMPERATURA
                      ? user.celsius
                        ? `Rango ideal: ${acuarioSeleccionado.temp_min}-${acuarioSeleccionado.temp_max}°C`
                        : `Rango ideal: ${celsiusToFarenheit(
                            acuarioSeleccionado.temp_min
                          )}-${celsiusToFarenheit(
                            acuarioSeleccionado.temp_max
                          )}°C`
                      : parameterValues[param.tipo].info}
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
      )}
    </div>
  );
};
