import React from "react";
import { Card, CardBody, Button, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface AlertsProps {
  tankId?: number;
}

interface Alert {
  id: number;
  title: string;
  message: string;
  type: "warning" | "danger" | "info";
  time: string;
  isRead: boolean;
}

export const Alerts: React.FC<AlertsProps> = ({ tankId = 1 }) => {
  // Different alerts based on tank ID
  const alertsByTank = {
    1: [
      {
        id: 1,
        title: "pH elevado",
        message: "El pH del agua está por encima del rango recomendado (7.8).",
        type: "warning" as const,
        time: "Hace 35 minutos",
        isRead: false
      },
      {
        id: 2,
        title: "Nivel de amonio",
        message: "El nivel de amonio está ligeramente elevado (0.25 ppm).",
        type: "warning" as const,
        time: "Hace 2 horas",
        isRead: false
      }
    ],
    2: [
      {
        id: 1,
        title: "Nivel de CO₂ bajo",
        message: "El nivel de CO₂ está por debajo del rango óptimo para plantas (8 ppm).",
        type: "info" as const,
        time: "Hace 20 minutos",
        isRead: false
      }
    ]
  };

  const [alerts, setAlerts] = React.useState(alertsByTank[tankId as keyof typeof alertsByTank] || alertsByTank[1]);

  // Update alerts when tankId changes
  React.useEffect(() => {
    setAlerts(alertsByTank[tankId as keyof typeof alertsByTank] || alertsByTank[1]);
  }, [tankId]);

  const markAsRead = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const alertTypeIcons = {
    warning: "lucide:alert-triangle",
    danger: "lucide:alert-octagon",
    info: "lucide:info"
  };

  const alertTypeColors = {
    warning: "warning",
    danger: "danger",
    info: "primary"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Alertas</h3>
          {unreadCount > 0 && (
            <Badge color="danger" content={unreadCount} shape="circle" size="sm" />
          )}
        </div>
        <Button variant="light" size="sm">
          Ver historial
        </Button>
      </div>
      
      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={`${!alert.isRead ? 'border-l-4' : ''}`}
                style={{ borderLeftColor: !alert.isRead ? `hsl(var(--heroui-${alertTypeColors[alert.type]}))` : '' }}
              >
                <CardBody className="p-4">
                  <div className="flex gap-3">
                    <div className={`mt-1 text-${alertTypeColors[alert.type]}`}>
                      <Icon icon={alertTypeIcons[alert.type]} className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <span className="text-xs text-foreground-500">{alert.time}</span>
                      </div>
                      <p className="text-sm text-foreground-600 mb-3">{alert.message}</p>
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          variant="light" 
                          color={alertTypeColors[alert.type]}
                          onPress={() => markAsRead(alert.id)}
                        >
                          {alert.isRead ? 'Archivado' : 'Marcar como leído'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-8 flex flex-col items-center justify-center">
            <Icon icon="lucide:check-circle" className="text-success text-3xl mb-2" />
            <p className="text-foreground-500">No hay alertas activas</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};