import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
  Checkbox,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTheme } from "@heroui/use-theme";
import { Logo } from "../logo";
import { supabase } from "../../lib/supabaseClient";
import "./login.css";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useThemeContext } from "../../context/themeContext";

interface LoginProps {
  onLogin: (email: string) => void;
  onRegisterClick: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const { isDark } = useThemeContext();
  const { toggleAppTheme } = useAppTheme();

  const toggleTheme = () => {
    toggleAppTheme();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: supabaseError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      setIsLoading(false);

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      // Usuario logueado correctamente
      onLogin(email);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Ocurrió un error inesperado");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <Button
          isIconOnly
          variant="light"
          aria-label="Cambiar tema"
          onPress={toggleTheme}
        >
          <Icon
            icon={isDark ? "lucide:sun" : "lucide:moon"}
            className="text-lg"
          />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1 items-center">
            <h2 className="text-xl font-semibold">Iniciar sesión</h2>
            <p className="text-foreground-500 text-sm">
              Accede a tu cuenta para gestionar tus acuarios
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                className="input-no-zoom"
                label="Correo electrónico"
                placeholder="Ingresa tu correo"
                type="email"
                value={email}
                onValueChange={setEmail}
                startContent={
                  <Icon icon="lucide:mail" className="text-default-400" />
                }
                isRequired
              />

              <Input
                className="input-no-zoom"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={password}
                onValueChange={setPassword}
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" />
                }
                isRequired
              />

              {/* <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                >
                  Recordarme
                </Checkbox>
                <span />
                <Link href="#" size="sm">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div> */}

              {error && (
                <div className="text-danger text-sm p-2 bg-danger-50 rounded-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Iniciar sesión
              </Button>
            </form>

            {/* <div className="flex items-center gap-4">
              <Divider className="flex-1" />
              <span className="text-xs text-foreground-400">
                O continúa con
              </span>
              <Divider className="flex-1" />
            </div> */}

            {/* <div className="grid grid-cols-2 gap-3">
              <Button
                variant="bordered"
                startContent={
                  <Icon icon="logos:google-icon" className="text-lg" />
                }
              >
                Google
              </Button>
              <Button
                variant="bordered"
                startContent={
                  <Icon icon="logos:facebook" className="text-lg" />
                }
              >
                Facebook
              </Button>
            </div> */}

            <div className="text-center">
              <span className="text-foreground-500 text-sm">
                ¿No tienes una cuenta?{" "}
              </span>
              <Link size="sm" onPress={onRegisterClick}>
                Regístrate
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
