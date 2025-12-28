import React from "react";
import { Button, Card, CardBody, Switch, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabaseClient";

interface DeviceControlProps {
  icon: string;
  label: string;
  isActive: boolean;
  onToggle: () => void;
  activeTime?: string;
}

const DeviceControl: React.FC<DeviceControlProps> = ({
  icon,
  label,
  isActive,
  onToggle,
}) => {
  return (
    <Card className={`device-control ${isActive ? "border-primary" : ""}`}>
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isActive
                  ? "bg-primary-100 text-primary-500"
                  : "bg-default-100 text-default-500"
              }`}
            >
              <Icon icon={icon} className="text-xl" />
            </div>
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-xs text-foreground-500">
                {isActive ? `Activo` : "Inactivo"}
              </p>
            </div>
          </div>
          <Switch
            isSelected={isActive}
            onValueChange={onToggle}
            size="sm"
            color={isActive ? "primary" : "default"}
          />
        </div>
      </CardBody>
    </Card>
  );
};

interface DeviceControlsProps {
  setSelected: (section: string) => void;
}

export const DeviceControls: React.FC<DeviceControlsProps> = ({
  setSelected,
}: DeviceControlsProps) => {
  const { acuarioSeleccionado, modificarAcuarioSeleccionado } =
    useUserContext();

  const toggleLuz = async () => {
    // Actualizar el estado local
    modificarAcuarioSeleccionado({
      ...acuarioSeleccionado,
      luz: !acuarioSeleccionado.luz,
    });

    // Aquí iría la lógica para activar/desactivar la luz en el backend
    await supabase
      .from("acuarios")
      .update({ luz: !acuarioSeleccionado.luz })
      .eq("id", acuarioSeleccionado.id);
  };

  const toggleFiltro = async () => {
    // Actualizar el estado local
    modificarAcuarioSeleccionado({
      ...acuarioSeleccionado,
      filtro: !acuarioSeleccionado.filtro,
    });

    // Aquí iría la lógica para activar/desactivar la filtro en el backend
    await supabase
      .from("acuarios")
      .update({ filtro: !acuarioSeleccionado.filtro })
      .eq("id", acuarioSeleccionado.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dispositivos</h3>
        <Button
          variant="light"
          size="sm"
          endContent={<Icon icon="lucide:arrow-right" />}
          onPress={() => setSelected("devices")}
        >
          Ver más
        </Button>
      </div>
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 * 0.1 }}
        >
          <DeviceControl
            icon="lucide:sun"
            label="Luz"
            isActive={acuarioSeleccionado.luz}
            onToggle={toggleLuz}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 * 0.1 }}
        >
          <DeviceControl
            icon="lucide:filter"
            label="Filtro"
            isActive={acuarioSeleccionado.filtro}
            onToggle={toggleFiltro}
          />
        </motion.div>
      </div>
    </div>
  );
};
