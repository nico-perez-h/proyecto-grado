import React from "react";
import {
  Card,
  CardBody,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
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
    modificarAcuarioSeleccionado,
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
  const [codigoCentral, setCodigoCentral] = React.useState("");

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
  const showUIwithESP = !!acuarioSeleccionado?.id_central;

  const handleSendCodigoCentral = async () => {
    const codigo = codigoCentral.trim();

    if (codigo.length === 0) {
      alert("Por favor, ingresa un código válido.");
      return;
    }

    try {
      const { data: central, error: centralError } = await supabase
        .from("centrales")
        .select("*")
        .eq("codigo_esp", codigo)
        .single();

      if (centralError || !central) {
        alert("Por favor, ingresa un código válido.");
        return;
      }

      const { data: acuarioExistente } = await supabase
        .from("acuarios")
        .select("*")
        .eq("id_central", codigo)
        .maybeSingle();

      if (acuarioExistente) {
        alert("Ya existe un acuario asociado a ese código.");
        return;
      }

      const { error: insertError } = await supabase
        .from("acuarios")
        .update({ id_central: codigo })
        .eq("id", acuarioSeleccionado.id);

      if (insertError) {
        alert("Error al guardar el código.");
        return;
      }

      alert(
        "Código guardado correctamente 🎉 — Reinicia la central para comenzar a leer datos de tu pecera."
      );

      modificarAcuarioSeleccionado({
        ...acuarioSeleccionado,
        id_central: codigo,
      });
    } catch (e) {
      alert("Error inesperado.");
    }
  };

  return (
    <div className="space-y-6">
      {showUI && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {acuarioSeleccionado.nombre}
              </h2>
              <p className="text-foreground-500 text-xs">
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
                  {acuarios.map((acuario) => (
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

      {!showUIwithESP && (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-800">
                Este acuario no tiene una central ESP configurada, por favor
                coloca el código que se muestra en la pantalla de la central y
                reiniciala.
              </span>
            </div>
          </div>
          <Input
            label="Código de la central"
            className="input-no-zoom"
            value={codigoCentral}
            onChange={(e) => {
              setCodigoCentral(e.target.value);
            }}
          />
          <Button
            variant="solid"
            color="primary"
            size="sm"
            onPress={handleSendCodigoCentral}
          >
            Conectar
          </Button>
        </div>
      )}

      {(showUI || tipoSeleccionado) && showUIwithESP && (
        <WaterParameters
          setTipoSeleccionado={setTipoSeleccionado}
          tipoSeleccionado={tipoSeleccionado}
        />
      )}

      {showUI && showUIwithESP && (
        <>
          <DeviceControls />
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
                <TemperatureChart />
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {(showUI || viewAlerts) && showUIwithESP && (
        <Alerts viewAlerts={viewAlerts} setViewAlerts={setViewAlerts} />
      )}
    </div>
  );
};
