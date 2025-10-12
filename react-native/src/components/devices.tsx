import { Card, CardBody, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabaseClient";

export const Devices = () => {
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

  const toggleLuzProgramada = async () => {
    // Actualizar el estado local
    modificarAcuarioSeleccionado({
      ...acuarioSeleccionado,
      luz_programada: !acuarioSeleccionado.luz_programada,
    });

    // Aquí iría la lógica para activar/desactivar la luz_programada en el backend
    await supabase
      .from("acuarios")
      .update({ luz_programada: !acuarioSeleccionado.luz_programada })
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

  const toggleFiltroProgramado = async () => {
    // Actualizar el estado local
    modificarAcuarioSeleccionado({
      ...acuarioSeleccionado,
      filtro_programado: !acuarioSeleccionado.filtro_programado,
    });

    // Aquí iría la lógica para activar/desactivar la filtro_programado en el backend
    await supabase
      .from("acuarios")
      .update({ filtro_programado: !acuarioSeleccionado.filtro_programado })
      .eq("id", acuarioSeleccionado.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dispositivos</h2>
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 * 0.1 }}
        >
          <Card className={acuarioSeleccionado.luz ? "border-primary" : ""}>
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      acuarioSeleccionado.luz
                        ? "bg-primary-100 text-primary-500"
                        : "bg-default-100 text-default-500"
                    }`}
                  >
                    <Icon icon="lucide:sun" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">Luz</h3>
                    <p className="text-xs text-foreground-500">
                      {acuarioSeleccionado.luz_programada
                        ? `Programado: ${acuarioSeleccionado.luz_inicio} - ${acuarioSeleccionado.luz_final}`
                        : "Sin programación"}
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={acuarioSeleccionado.luz}
                  onValueChange={toggleLuz}
                  color="primary"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-divider">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:clock"
                    className="text-sm text-foreground-500"
                  />
                  <span className="text-sm">Programación</span>
                </div>
                <Switch
                  isSelected={acuarioSeleccionado.luz_programada}
                  onValueChange={toggleLuzProgramada}
                  size="sm"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 * 0.1 }}
        >
          <Card className={acuarioSeleccionado.filtro ? "border-primary" : ""}>
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      acuarioSeleccionado.filtro
                        ? "bg-primary-100 text-primary-500"
                        : "bg-default-100 text-default-500"
                    }`}
                  >
                    <Icon icon="lucide:sun" className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">Filtro</h3>
                    <p className="text-xs text-foreground-500">
                      {acuarioSeleccionado.filtro_programado
                        ? `Programado: ${acuarioSeleccionado.filtro_inicio} - ${acuarioSeleccionado.filtro_final}`
                        : "Sin programación"}
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={acuarioSeleccionado.filtro}
                  onValueChange={toggleFiltro}
                  color="primary"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-divider">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:clock"
                    className="text-sm text-foreground-500"
                  />
                  <span className="text-sm">Programación</span>
                </div>
                <Switch
                  isSelected={acuarioSeleccionado.filtro_programado}
                  onValueChange={toggleFiltroProgramado}
                  size="sm"
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
