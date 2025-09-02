import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "@heroui/use-theme";
import { Logo } from "./logo";

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-divider">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo size="sm" />
        
        <div className="flex items-center gap-3">
          <Button 
            isIconOnly 
            variant="light" 
            aria-label="Cambiar tema"
            onPress={toggleTheme}
          >
            <Icon icon={isDark ? "lucide:sun" : "lucide:moon"} className="text-lg" />
          </Button>
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <Avatar 
                  size="sm" 
                  src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1" 
                  className="cursor-pointer"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Acciones de usuario">
              <DropdownItem key="profile">Mi Perfil</DropdownItem>
              <DropdownItem key="tanks">Mis Acuarios</DropdownItem>
              <DropdownItem key="help">Ayuda</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={onLogout}>Cerrar Sesión</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};