import React, { useEffect, useId, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUserContext } from "../context/userContext";
import { Parametro, ParametroTipo } from "../interfaces";

export const useParametersRealTime = (
  tipoSeleccionado?: ParametroTipo,
  max: number = 20
) => {
  const [parameters, setParameters] = useState<Parametro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { acuarioSeleccionado } = useUserContext();
  const id = useId();

  const fetchParameters = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("parametros")
      .select("*")
      .filter("id_acuario", "eq", acuarioSeleccionado.id)
      .order("fecha_hora", { ascending: false });

    setLoading(false);
    if (error) console.error(error);
    else setParameters(data);
  };

  useEffect(() => {
    if (!acuarioSeleccionado.id) return;

    fetchParameters();

    const channel = supabase
      .channel(`public:parametros-${id}`)
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
      .subscribe((status) => console.log("Subscription status: ", status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [acuarioSeleccionado.id]);

  const filteredParameters = React.useMemo(() => {
    const filteredTemperatureParameters = parameters.filter((p) =>
      p.tipo === ParametroTipo.TEMPERATURA ? p.valor !== -127 : true
    );

    if (tipoSeleccionado) {
      return filteredTemperatureParameters
        .filter((p) => p.tipo === tipoSeleccionado)
        .filter((_, i) => i < max)
        .sort(
          (a, b) =>
            new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime()
        );
    } else {
      const uniqueParams = filteredTemperatureParameters.reduce(
        (acc: Parametro[], curr) => {
          if (!acc.find((p) => p.tipo === curr.tipo)) {
            acc.push(curr);
          }
          return acc;
        },
        []
      );

      const enumOrder = Object.values(ParametroTipo);
      uniqueParams.sort(
        (a, b) => enumOrder.indexOf(a.tipo) - enumOrder.indexOf(b.tipo)
      );

      return uniqueParams;
    }
  }, [parameters, tipoSeleccionado]);

  const existingParameters: ParametroTipo[] = [
    ...new Set(parameters.map((p) => p.tipo)),
  ];

  return { filteredParameters, parameters, existingParameters, loading };
};
