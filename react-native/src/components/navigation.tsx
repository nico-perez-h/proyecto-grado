import React from "react";
import { Icon } from "@iconify/react";
import { useUserContext } from "../context/userContext";

interface NavigationProps {
  selected: string;
  onSelectionChange: (key: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  selected,
  onSelectionChange,
}) => {
  const { acuarioSeleccionado } = useUserContext();

  const navItems = [
    { key: "dashboard", label: "Inicio", icon: "lucide:layout-dashboard" },
  ];
  if (acuarioSeleccionado.id_central) {
    navItems.push(
      { key: "devices", label: "Dispositivos", icon: "lucide:settings-2" },
      { key: "statistics", label: "Estadísticas", icon: "lucide:bar-chart-2" }
    );
  }
  navItems.push({ key: "settings", label: "Ajustes", icon: "lucide:sliders" });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-divider">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelectionChange(item.key)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                selected === item.key
                  ? "text-primary"
                  : "text-foreground-500 hover:text-foreground-700"
              }`}
            >
              <Icon icon={item.icon} className="text-xl mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
