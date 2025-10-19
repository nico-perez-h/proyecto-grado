import React from "react";
import {
  Card,
  CardBody,
  Progress,
  Button,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { WaterParameters } from "./water-parameters";
import { TemperatureChart } from "./temperature-chart";
import { DeviceControls } from "./device-controls";
import { Alerts } from "./alerts";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabaseClient";
import { ParametroTipo } from "../interfaces";

interface Props {
  setSelected: (section: string) => void;
}

export const Dashboard = ({ setSelected }: Props) => {
  const {
    user,
    acuarios,
    acuarioSeleccionado,
    setAcuarioSeleccionadoId,
    anadirAcuario,
  } = useUserContext();
  const [viewAlerts, setViewAlerts] = React.useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] =
    React.useState<ParametroTipo | null>(null);

  // Definir los tanques disponibles
  const [tanks, setTanks] = React.useState([
    {
      id: 1,
      name: "Acuario Principal",
      waterLevel: 85,
      lastUpdate: "hace 5 minutos",
    },
    {
      id: 2,
      name: "Acuario Plantado",
      waterLevel: 72,
      lastUpdate: "hace 15 minutos",
    },
  ]);

  // Estado para el tanque seleccionado
  const [selectedTankIndex] = React.useState(0);
  const currentTank = tanks[selectedTankIndex];

  const handleNuevoAcuario = async () => {
    const { data, error } = await supabase
      .from("acuarios")
      .insert([
        {
          id_usuario: user.id,
        },
      ])
      .select("*")
      .single();

    if (error) return;

    anadirAcuario(data);
    setAcuarioSeleccionadoId(data.id);
  };

  const showUI = !viewAlerts && !tipoSeleccionado;

  return (
    <div className="space-y-6">
      {showUI && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {acuarioSeleccionado.nombre}
              </h2>
              <p className="text-foreground-500 text-sm">
                Última actualización: hace 5 minutos
              </p>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  color="primary"
                  endContent={<Icon icon="lucide:chevron-down" />}
                >
                  Cambiar
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Seleccionar acuario">
                <>
                  {acuarios.map((acuario, index) => (
                    <DropdownItem
                      key={acuario.id}
                      onPress={() => setAcuarioSeleccionadoId(acuario.id)}
                      startContent={
                        <div
                          className={`w-2 h-2 rounded-full ${
                            acuario.id === acuarioSeleccionado.id
                              ? "bg-primary"
                              : "bg-default-300"
                          }`}
                        />
                      }
                    >
                      {acuario.nombre}
                    </DropdownItem>
                  ))}
                  <DropdownItem
                    key="nuevo"
                    onPress={handleNuevoAcuario}
                    startContent={
                      <div className={`w-2 h-2 rounded-full bg-gray-200`} />
                    }
                  >
                    Nuevo
                  </DropdownItem>
                </>
              </DropdownMenu>
            </Dropdown>
          </div>
        </>
      )}

      {(showUI || tipoSeleccionado) && (
        <WaterParameters
          setTipoSeleccionado={setTipoSeleccionado}
          tipoSeleccionado={tipoSeleccionado}
        />
      )}

      {showUI && (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Temperatura</h3>
              <Button
                variant="light"
                size="sm"
                endContent={<Icon icon="lucide:arrow-right" />}
                onPress={() => setSelected("statistics")}
              >
                Ver más
              </Button>
            </div>
            <Card>
              <CardBody className="p-4">
                <TemperatureChart tankId={currentTank.id} />
              </CardBody>
            </Card>
          </div>
          <DeviceControls />
        </>
      )}

      {(showUI || viewAlerts) && (
        <Alerts viewAlerts={viewAlerts} setViewAlerts={setViewAlerts} />
      )}
    </div>
  );
};
