import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Switch,
  Tab,
  Tabs,
} from "@heroui/react";
import React from "react";
import { useThemeContext } from "../context/themeContext";
import { useUserContext } from "../context/userContext";
import { useAppTheme } from "../hooks/useAppTheme";
import { supabase } from "../lib/supabaseClient";

interface Props {
  setSelected: (section: string) => void;
}

export const Settings = ({ setSelected }: Props) => {
  const [tankUnit, setTankUnit] = React.useState("L");
  const [notifications, setNotifications] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("general");

  const { isDark } = useThemeContext();
  const { toggleAppTheme } = useAppTheme();

  const {
    user,
    setUser,
    acuarioSeleccionado,
    modificarAcuarioSeleccionado,
    setAcuarioSeleccionadoId,
    acuarios,
    removerAcuario,
  } = useUserContext();

  const sendAcuario = async () => {
    await supabase
      .from("acuarios")
      .update({
        nombre: acuarioSeleccionado.nombre,
        capacidad: acuarioSeleccionado.capacidad,
      })
      .eq("id", acuarioSeleccionado.id);
  };

  const sendAcuarioMinMaxs = async () => {
    await supabase
      .from("acuarios")
      .update({
        temp_min: acuarioSeleccionado.temp_min,
        temp_max: acuarioSeleccionado.temp_max,
        ph_min: acuarioSeleccionado.ph_min,
        ph_max: acuarioSeleccionado.ph_max,
      })
      .eq("id", acuarioSeleccionado.id);
  };

  const eliminarAcuario = async () => {
    await supabase.from("acuarios").delete().eq("id", acuarioSeleccionado.id);

    removerAcuario(acuarioSeleccionado.id);
    setAcuarioSeleccionadoId(
      acuarios && acuarios.length > 0 ? acuarios[0].id : null
    );
    setSelected("dashboard");
  };

  const changeTemperatureUnit = async (celsius: boolean) => {
    setUser({ ...user, celsius });
    await supabase.from("usuarios").update({ celsius }).eq("id", user.id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ajustes</h2>

      <Tabs
        aria-label="Opciones"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab as any}
        color="primary"
      >
        <Tab key="general" title="General">
          <Card className="mt-4">
            <CardBody className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Información del acuario</h3>

              <Input
                label="Nombre del acuario"
                placeholder="Ingrese un nombre"
                value={acuarioSeleccionado.nombre}
                onValueChange={(newValue) =>
                  modificarAcuarioSeleccionado({
                    ...acuarioSeleccionado,
                    nombre: newValue,
                  })
                }
                className="input-no-zoom"
                onBlur={sendAcuario}
              />

              <div className="flex gap-4">
                <Input
                  label="Capacidad"
                  placeholder="Litros"
                  type="number"
                  value={acuarioSeleccionado.capacidad.toString()}
                  onValueChange={(newValue) =>
                    modificarAcuarioSeleccionado({
                      ...acuarioSeleccionado,
                      capacidad: Number(newValue),
                    })
                  }
                  className="flex-1 input-no-zoom"
                  onBlur={sendAcuario}
                />
                <div className="w-24">
                  <Input
                    label="Unidad"
                    placeholder="L"
                    value={tankUnit}
                    onValueChange={setTankUnit}
                    disabled
                    className="input-no-zoom"
                  />
                </div>
              </div>

              <Divider className="my-4" />

              <h3 className="text-lg font-medium">Preferencias</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Unidad de temperatura</p>
                  <p className="text-sm text-foreground-500">
                    Celsius o Fahrenheit
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={user.celsius ? "solid" : "bordered"}
                    color={user.celsius ? "primary" : "default"}
                    onPress={() => changeTemperatureUnit(true)}
                  >
                    °C
                  </Button>
                  <Button
                    size="sm"
                    variant={!user.celsius ? "solid" : "bordered"}
                    color={!user.celsius ? "primary" : "default"}
                    onPress={() => changeTemperatureUnit(false)}
                  >
                    °F
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo oscuro</p>
                  <p className="text-sm text-foreground-500">
                    Cambia la apariencia de la aplicación
                  </p>
                </div>
                <Switch isSelected={isDark} onChange={toggleAppTheme} />
              </div>

              <Divider className="my-4" />

              <Button
                variant="solid"
                color={acuarios.length <= 1 ? "default" : "danger"}
                disabled={acuarios.length <= 1}
                onPress={eliminarAcuario}
              >
                Eliminar acuario
              </Button>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="notifications" title="Notificaciones">
          <Card className="mt-4">
            <CardBody className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones</p>
                  <p className="text-sm text-foreground-500">
                    Recibe alertas en tu dispositivo
                  </p>
                </div>
                <Switch
                  isSelected={notifications}
                  onValueChange={setNotifications}
                />
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="parameters" title="Parámetros">
          <Card className="mt-4">
            <CardBody className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Rangos ideales</h3>
              <p className="text-sm text-foreground-500 mb-4">
                Configura los rangos ideales para tu acuario. Recibirás alertas
                cuando los valores estén fuera de estos rangos.
              </p>

              <div className="grid gap-4">
                <div>
                  <p className="font-medium mb-2">Temperatura (°C)</p>
                  <div className="flex gap-2">
                    <Input
                      label="Mínimo"
                      type="number"
                      value={acuarioSeleccionado.temp_min.toString()}
                      onValueChange={(newValue) =>
                        modificarAcuarioSeleccionado({
                          ...acuarioSeleccionado,
                          temp_min: Number(newValue),
                        })
                      }
                      endContent="°C"
                      className="input-no-zoom"
                      onBlur={sendAcuarioMinMaxs}
                    />
                    <Input
                      label="Máximo"
                      type="number"
                      value={acuarioSeleccionado.temp_max.toString()}
                      onValueChange={(newValue) =>
                        modificarAcuarioSeleccionado({
                          ...acuarioSeleccionado,
                          temp_max: Number(newValue),
                        })
                      }
                      endContent="°C"
                      className="input-no-zoom"
                      onBlur={sendAcuarioMinMaxs}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <p className="font-medium mb-2">pH</p>
                  <div className="flex gap-2">
                    <Input
                      label="Mínimo"
                      type="number"
                      value={acuarioSeleccionado.ph_min.toString()}
                      onValueChange={(newValue) =>
                        modificarAcuarioSeleccionado({
                          ...acuarioSeleccionado,
                          ph_min: Number(newValue),
                        })
                      }
                      className="input-no-zoom"
                      onBlur={sendAcuarioMinMaxs}
                    />
                    <Input
                      label="Máximo"
                      type="number"
                      value={acuarioSeleccionado.ph_max.toString()}
                      onValueChange={(newValue) =>
                        modificarAcuarioSeleccionado({
                          ...acuarioSeleccionado,
                          ph_max: Number(newValue),
                        })
                      }
                      className="input-no-zoom"
                      onBlur={sendAcuarioMinMaxs}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};
