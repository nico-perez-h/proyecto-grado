import React from "react";
import { Card, CardBody, Progress, Button, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { WaterParameters } from "./water-parameters";
import { TemperatureChart } from "./temperature-chart";
import { DeviceControls } from "./device-controls";
import { Alerts } from "./alerts";

// Modificar la definición del componente para que tenga un valor por defecto para selectedTank
export const Dashboard = ({ selectedTank = null }) => {
  // Definir los tanques disponibles
  const [tanks, setTanks] = React.useState([
    {
      id: 1,
      name: "Acuario Principal",
      waterLevel: 85,
      lastUpdate: "hace 5 minutos"
    },
    {
      id: 2,
      name: "Acuario Plantado",
      waterLevel: 72,
      lastUpdate: "hace 15 minutos"
    }
  ]);
  
  // Estado para el tanque seleccionado
  const [selectedTankIndex, setSelectedTankIndex] = React.useState(0);
  const currentTank = selectedTank || tanks[selectedTankIndex];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{currentTank.name}</h2>
          <p className="text-foreground-500 text-sm">Última actualización: {currentTank.lastUpdate}</p>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" color="primary" endContent={<Icon icon="lucide:chevron-down" />}>
              Cambiar
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Seleccionar acuario">
            {tanks.map((tank, index) => (
              <DropdownItem 
                key={tank.id} 
                onPress={() => setSelectedTankIndex(index)}
                startContent={
                  <div className={`w-2 h-2 rounded-full ${tank.id === currentTank.id ? 'bg-primary' : 'bg-default-300'}`} />
                }
              >
                {tank.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      
      <Card className="water-bg overflow-hidden">
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:droplet" className="text-default-600" />
              <h3 className="font-medium">Nivel de agua</h3>
            </div>
            <span className="text-sm font-semibold">{currentTank.waterLevel}%</span>
          </div>
          <Progress 
            value={currentTank.waterLevel} 
            color={currentTank.waterLevel < 30 ? "danger" : currentTank.waterLevel < 60 ? "warning" : "primary"}
            className="h-2"
          />
        </CardBody>
      </Card>
      
      <WaterParameters tankId={currentTank.id} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Temperatura</h3>
          <Button variant="light" size="sm" endContent={<Icon icon="lucide:arrow-right" />}>
            Ver más
          </Button>
        </div>
        <Card>
          <CardBody className="p-4">
            <TemperatureChart tankId={currentTank.id} />
          </CardBody>
        </Card>
      </div>
      
      <DeviceControls tankId={currentTank.id} />
      
      <Alerts tankId={currentTank.id} />
    </div>
  );
};