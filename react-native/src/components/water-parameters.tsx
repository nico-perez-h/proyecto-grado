import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { supabase } from "../lib/supabaseClient";
import { useUserContext } from "../context/userContext";
import { Parametro, ParametroTipo } from "../interfaces";
import { formatFechaBonita } from "../utils/formatFechaBonita";

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
  const [parameters, setParameters] = useState<Parametro[]>([]);
  const { acuarioSeleccionado } = useUserContext();

  const statusColors = {
    normal: "text-success-500",
    warning: "text-warning-500",
    danger: "text-danger-500",
  };

  const fetchParameters = async () => {
    const { data, error } = await supabase
      .from("parametros")
      .select("*")
      .filter("id_acuario", "eq", acuarioSeleccionado.id)
      .order("fecha_hora", { ascending: false });

    if (error) console.error(error);
    else setParameters(data);
  };

  useEffect(() => {
    fetchParameters();

    const channel = supabase
      .channel("public:parametros")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "parametros",
        },
        (payload) => {
          const parameter = payload.new as Parametro;

          if (payload.eventType === "INSERT") {
            if (parameter.id_acuario !== acuarioSeleccionado.id) return;
            setParameters((prev) => [parameter, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            if (parameter.id_acuario !== acuarioSeleccionado.id) return;
            setParameters((prev) =>
              prev.map((item) => (item.id === parameter.id ? parameter : item))
            );
          } else if (payload.eventType === "DELETE") {
            setParameters((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [acuarioSeleccionado.id]);

  const filteredParameters = React.useMemo(() => {
    if (tipoSeleccionado) {
      return parameters
        .filter((p) => p.tipo === tipoSeleccionado)
        .filter((_, i) => i < 20)
        .sort(
          (a, b) =>
            new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
        );
    } else {
      const uniqueParams = parameters.reduce((acc: Parametro[], curr) => {
        if (!acc.find((p) => p.tipo === curr.tipo)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      const enumOrder = Object.values(ParametroTipo);
      uniqueParams.sort(
        (a, b) => enumOrder.indexOf(a.tipo) - enumOrder.indexOf(b.tipo)
      );

      return uniqueParams;
    }
  }, [parameters, tipoSeleccionado]);

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
      </div>
    </div>
  );
};
