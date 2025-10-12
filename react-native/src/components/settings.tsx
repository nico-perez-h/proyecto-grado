import React from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Switch,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAppTheme } from "../hooks/useAppTheme";
import { useTheme } from "@heroui/use-theme";
import { useThemeContext } from "../context/themeContext";

export const Settings = () => {
  const [tankName, setTankName] = React.useState("Acuario Principal");
  const [tankSize, setTankSize] = React.useState("120");
  const [tankUnit, setTankUnit] = React.useState("L");
  const [notifications, setNotifications] = React.useState(true);
  const [criticalAlerts, setCriticalAlerts] = React.useState(true);
  const [dailyReports, setDailyReports] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("general");

  const [temperatureUnit, setTemperatureUnit] = React.useState("C");
  const [autoBackup, setAutoBackup] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const [minTemp, setMinTemp] = React.useState("23");
  const [maxTemp, setMaxTemp] = React.useState("26");
  const [minPh, setMinPh] = React.useState("6.5");
  const [maxPh, setMaxPh] = React.useState("7.5");

  const { isDark } = useThemeContext();
  const { toggleAppTheme } = useAppTheme();

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
                value={tankName}
                onValueChange={setTankName}
                className="input-no-zoom"
              />

              <div className="flex gap-4">
                <Input
                  label="Capacidad"
                  placeholder="Litros"
                  type="number"
                  value={tankSize}
                  onValueChange={setTankSize}
                  className="flex-1 input-no-zoom"
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
                    variant={temperatureUnit === "C" ? "solid" : "bordered"}
                    color={temperatureUnit === "C" ? "primary" : "default"}
                    onPress={() => setTemperatureUnit("C")}
                  >
                    °C
                  </Button>
                  <Button
                    size="sm"
                    variant={temperatureUnit === "F" ? "solid" : "bordered"}
                    color={temperatureUnit === "F" ? "primary" : "default"}
                    onPress={() => setTemperatureUnit("F")}
                  >
                    °F
                  </Button>
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Copia de seguridad automática</p>
                  <p className="text-sm text-foreground-500">Guarda tus datos cada 24 horas</p>
                </div>
                <Switch 
                  isSelected={autoBackup}
                  onValueChange={setAutoBackup}
                />
              </div> */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo oscuro</p>
                  <p className="text-sm text-foreground-500">
                    Cambia la apariencia de la aplicación
                  </p>
                </div>
                <Switch isSelected={isDark} onChange={toggleAppTheme} />
              </div>
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

              {/*  <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas críticas</p>
                  <p className="text-sm text-foreground-500">Notificaciones para valores fuera de rango</p>
                </div>
                <Switch 
                  isSelected={criticalAlerts}
                  onValueChange={setCriticalAlerts}
                  isDisabled={!notifications}
                />
              </div> */}

              {/* <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Informes diarios</p>
                  <p className="text-sm text-foreground-500">
                    Resumen diario del estado del acuario
                  </p>
                </div>
                <Switch
                  isSelected={dailyReports}
                  onValueChange={setDailyReports}
                  isDisabled={!notifications}
                />
              </div> */}
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
                      value={minTemp}
                      onValueChange={setMinTemp}
                      endContent="°C"
                      className="input-no-zoom"
                    />
                    <Input
                      label="Máximo"
                      type="number"
                      value={maxTemp}
                      onValueChange={setMaxTemp}
                      endContent="°C"
                      className="input-no-zoom"
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
                      value={minPh}
                      onValueChange={setMinPh}
                      className="input-no-zoom"
                    />
                    <Input
                      label="Máximo"
                      type="number"
                      value={maxPh}
                      onValueChange={setMaxPh}
                      className="input-no-zoom"
                    />
                  </div>
                </div>
              </div>

              <Button color="primary" className="mt-2">
                Guardar cambios
              </Button>
            </CardBody>
          </Card>
        </Tab>

        {/* <Tab key="help" title="Ayuda">
          <Card className="mt-4">
            <CardBody className="p-4 space-y-4">
              <h3 className="text-lg font-medium">Centro de ayuda</h3>

              <div className="space-y-3">
                <Button
                  variant="flat"
                  color="default"
                  className="w-full justify-start"
                  startContent={<Icon icon="lucide:book-open" />}
                >
                  Guía de usuario
                </Button>

                <Button
                  variant="flat"
                  color="default"
                  className="w-full justify-start"
                  startContent={<Icon icon="lucide:help-circle" />}
                >
                  Preguntas frecuentes
                </Button>

                <Button
                  variant="flat"
                  color="default"
                  className="w-full justify-start"
                  startContent={<Icon icon="lucide:message-circle" />}
                >
                  Contactar soporte
                </Button>

                <Button
                  variant="flat"
                  color="default"
                  className="w-full justify-start"
                  startContent={<Icon icon="lucide:info" />}
                >
                  Acerca de AquaMonitor v1.0
                </Button>
              </div>
            </CardBody>
          </Card>
        </Tab> */}
      </Tabs>
    </div>
  );
};
