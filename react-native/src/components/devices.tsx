import React from "react";
import { Card, CardBody, Button, Switch, Input, Slider, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface Device {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
  type: string;
  schedule: {
    isScheduled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
  intensity?: number;
}

export const Devices = () => {
  const [devices, setDevices] = React.useState<Device[]>([
    {
      id: 1,
      name: "Iluminación principal",
      icon: "lucide:sun",
      isActive: true,
      type: "light",
      intensity: 80,
      schedule: {
        isScheduled: true,
        startTime: "08:00",
        endTime: "20:00",
        days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      }
    },
    {
      id: 2,
      name: "Iluminación nocturna",
      icon: "lucide:moon",
      isActive: false,
      type: "light",
      intensity: 30,
      schedule: {
        isScheduled: true,
        startTime: "20:00",
        endTime: "23:00",
        days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      }
    },
    {
      id: 3,
      name: "Filtro principal",
      icon: "lucide:filter",
      isActive: true,
      type: "filter",
      schedule: {
        isScheduled: false,
        startTime: "",
        endTime: "",
        days: []
      }
    },
    {
      id: 4,
      name: "Calentador",
      icon: "lucide:flame",
      isActive: false,
      type: "heater",
      schedule: {
        isScheduled: false,
        startTime: "",
        endTime: "",
        days: []
      }
    },
    {
      id: 5,
      name: "Aireador",
      icon: "lucide:wind",
      isActive: true,
      type: "air",
      schedule: {
        isScheduled: true,
        startTime: "10:00",
        endTime: "22:00",
        days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      }
    }
  ]);

  const [selectedTab, setSelectedTab] = React.useState("all");
  
  const toggleDevice = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, isActive: !device.isActive } : device
    ));
  };
  
  const updateIntensity = (id: number, value: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, intensity: value } : device
    ));
  };
  
  const toggleSchedule = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { 
        ...device, 
        schedule: { 
          ...device.schedule, 
          isScheduled: !device.schedule.isScheduled 
        } 
      } : device
    ));
  };
  
  const filteredDevices = selectedTab === "all" 
    ? devices 
    : devices.filter(device => device.type === selectedTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dispositivos</h2>
        <Button 
          color="primary" 
          variant="light"
          endContent={<Icon icon="lucide:plus" />}
        >
          Añadir
        </Button>
      </div>
      
      <Tabs 
        aria-label="Filtrar dispositivos"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab as any}
        color="primary"
        variant="light"
      >
        <Tab key="all" title="Todos" />
        <Tab key="light" title="Iluminación" />
        <Tab key="filter" title="Filtros" />
        <Tab key="heater" title="Calentadores" />
        <Tab key="air" title="Aireadores" />
      </Tabs>
      
      <div className="space-y-4">
        {filteredDevices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={device.isActive ? "border-primary" : ""}>
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${device.isActive ? 'bg-primary-100 text-primary-500' : 'bg-default-100 text-default-500'}`}>
                      <Icon icon={device.icon} className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-xs text-foreground-500">
                        {device.schedule.isScheduled 
                          ? `Programado: ${device.schedule.startTime} - ${device.schedule.endTime}` 
                          : 'Sin programación'}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    isSelected={device.isActive}
                    onValueChange={() => toggleDevice(device.id)}
                    color="primary"
                  />
                </div>
                
                {device.intensity !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Intensidad</span>
                      <span className="text-sm font-medium">{device.intensity}%</span>
                    </div>
                    <Slider 
                      aria-label="Intensidad"
                      value={device.intensity}
                      onChange={(value) => updateIntensity(device.id, value as number)}
                      color="primary"
                      step={5}
                      showTooltip
                      className={!device.isActive ? "opacity-50" : ""}
                      isDisabled={!device.isActive}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-divider">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:clock" className="text-sm text-foreground-500" />
                    <span className="text-sm">Programación</span>
                  </div>
                  <Switch 
                    isSelected={device.schedule.isScheduled}
                    onValueChange={() => toggleSchedule(device.id)}
                    size="sm"
                  />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};