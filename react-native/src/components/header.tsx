import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "@heroui/use-theme";
import { Logo } from "./logo";
import { useUserContext } from "../context/userContext";
import { useAppTheme } from "../hooks/useAppTheme";
import { useThemeContext } from "../context/themeContext";

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { isDark } = useThemeContext();
  const { toggleAppTheme } = useAppTheme();
  const { user } = useUserContext();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-divider">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo size="sm" />

        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="light"
            aria-label="Cambiar tema"
            onPress={toggleAppTheme}
          >
            <Icon
              icon={isDark ? "lucide:sun" : "lucide:moon"}
              className="text-lg"
            />
          </Button>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <Avatar size="sm" src={user.foto} className="cursor-pointer" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Acciones de usuario">
              <DropdownItem key="logout" color="danger" onPress={onLogout}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
