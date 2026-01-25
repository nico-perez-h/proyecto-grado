import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Alerta } from "../interfaces";
import { supabase } from "../lib/supabaseClient";
import { useUserContext } from "../context/userContext";
import { timeAgo } from "../utils/timeAgo";
import { formatFechaBonita } from "../utils/formatFechaBonita";

interface Props {
  viewAlerts: boolean;
  setViewAlerts: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Alerts = ({ viewAlerts, setViewAlerts }: Props) => {
  const { acuarioSeleccionado } = useUserContext();
  const [alerts, setAlerts] = useState<Alerta[]>([]);

  const fetchAlerts = async () => {
    const { data, error } = await supabase
      .from("alertas")
      .select("*")
      .filter("id_acuario", "eq", acuarioSeleccionado.id)
      .order("fecha_hora", { ascending: false });

    if (error) console.error(error);
    else setAlerts(data);
  };

  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel("public:alertas")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alertas",
        },
        (payload) => {
          const alert = payload.new as Alerta;

          if (payload.eventType === "INSERT") {
            if (alert.id_acuario !== acuarioSeleccionado.id) return;
            setAlerts((prev) => [alert, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            if (alert.id_acuario !== acuarioSeleccionado.id) return;
            setAlerts((prev) =>
              prev.map((item) => (item.id === alert.id ? alert : item)),
            );
          } else if (payload.eventType === "DELETE") {
            setAlerts((prev) =>
              prev.filter((item) => item.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [acuarioSeleccionado.id]);

  const alertTypeIcons = {
    warning: "lucide:alert-triangle",
    danger: "lucide:alert-octagon",
    info: "lucide:info",
  };

  const alertTypeColors = {
    warning: "warning",
    danger: "danger",
    info: "primary",
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("alertas").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar la alerta:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Alertas</h3>
        </div>
        <Button
          onPress={() => setViewAlerts((prev) => !prev)}
          variant="light"
          size="sm"
        >
          {viewAlerts ? "Ver dashboard" : "Ver historial"}
        </Button>
      </div>

      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts
            .filter((_, i) => !!viewAlerts || i <= 1)
            .map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardBody className="p-4">
                    <div className="flex gap-3">
                      <div className={`mt-1 text-${alertTypeColors.warning}`}>
                        <Icon
                          icon={alertTypeIcons.warning}
                          className="text-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{alert.titulo}</h4>
                          <span className="text-xs text-foreground-500">
                            {formatFechaBonita(alert.fecha_hora)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground-600 mb-3">
                          {alert.descripcion}
                        </p>
                      </div>
                    </div>
                    <Button onPress={() => handleDelete(alert.id)}>
                      Eliminar
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-8 flex flex-col items-center justify-center">
            <Icon
              icon="lucide:check-circle"
              className="text-success text-3xl mb-2"
            />
            <p className="text-foreground-500">No hay alertas activas</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
