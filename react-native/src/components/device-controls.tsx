import React from "react";
import { Card, CardBody, Switch, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

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
  activeTime,
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
              {activeTime && (
                <p className="text-xs text-foreground-500">
                  {isActive ? `Activo: ${activeTime}` : "Inactivo"}
                </p>
              )}
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
  tankId?: number;
}

export const DeviceControls: React.FC<DeviceControlsProps> = ({
  tankId = 1,
}) => {
  // Different devices based on tank ID
  const devicesByTank = {
    1: [
      {
        id: 1,
        name: "Iluminación",
        icon: "lucide:sun",
        isActive: true,
        activeTime: "6h 23m",
      },
      {
        id: 2,
        name: "Filtro",
        icon: "lucide:filter",
        isActive: true,
        activeTime: "12h 05m",
      },
      /* { id: 4, name: "Aireador", icon: "lucide:wind", isActive: true, activeTime: "8h 15m" } */
    ],
    2: [
      {
        id: 1,
        name: "Iluminación LED",
        icon: "lucide:sun",
        isActive: true,
        activeTime: "8h 45m",
      },
      {
        id: 2,
        name: "Filtro Canister",
        icon: "lucide:filter",
        isActive: true,
        activeTime: "24h 00m",
      },
    ],
  };

  const [devices, setDevices] = React.useState(
    devicesByTank[tankId as keyof typeof devicesByTank] || devicesByTank[1]
  );

  // Update devices when tankId changes
  React.useEffect(() => {
    setDevices(
      devicesByTank[tankId as keyof typeof devicesByTank] || devicesByTank[1]
    );
  }, [tankId]);

  const toggleDevice = (id: number) => {
    setDevices(
      devices.map((device) =>
        device.id === id
          ? {
              ...device,
              isActive: !device.isActive,
              activeTime: !device.isActive ? "0m" : device.activeTime,
            }
          : device
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dispositivos</h3>
        <Tooltip content="Programar dispositivos">
          <button className="text-primary">
            <Icon icon="lucide:clock" />
          </button>
        </Tooltip>
      </div>
      <div className="space-y-3">
        {devices.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: device.id * 0.1 }}
          >
            <DeviceControl
              icon={device.icon}
              label={device.name}
              isActive={device.isActive}
              onToggle={() => toggleDevice(device.id)}
              activeTime={device.activeTime}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
