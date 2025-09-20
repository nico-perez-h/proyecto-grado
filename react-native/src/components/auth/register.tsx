/* import React from "react";
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

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onRegister,
  onBackToLogin,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = "El nombre es requerido";
    if (!email) newErrors.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido";

    if (!password) newErrors.password = "La contraseña es requerida";
    else if (password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!acceptTerms)
      newErrors.terms = "Debes aceptar los términos y condiciones";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      // Simulación de registro
      setTimeout(() => {
        setIsLoading(false);
        onRegister();
      }, 1500);
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
            <h2 className="text-xl font-semibold">Crear una cuenta</h2>
            <p className="text-foreground-500 text-sm">
              Regístrate para comenzar a monitorear tus acuarios
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                className="input-no-zoom"
                label="Nombre completo"
                placeholder="Ingresa tu nombre"
                value={name}
                onValueChange={setName}
                startContent={
                  <Icon icon="lucide:user" className="text-default-400" />
                }
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                isRequired
              />

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
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                isRequired
              />

              <Input
                className="input-no-zoom"
                label="Contraseña"
                placeholder="Crea una contraseña"
                type="password"
                value={password}
                onValueChange={setPassword}
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" />
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                isRequired
              />

              <Input
                className="input-no-zoom"
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                type="password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" />
                }
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                isRequired
              />

              <Checkbox
                isSelected={acceptTerms}
                onValueChange={setAcceptTerms}
                size="sm"
                isInvalid={!!errors.terms}
              >
                <span className="text-sm">
                  Acepto los{" "}
                  <Link href="#" size="sm">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="#" size="sm">
                    política de privacidad
                  </Link>
                </span>
              </Checkbox>
              {errors.terms && (
                <p className="text-danger text-xs">{errors.terms}</p>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Crear cuenta
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <Divider className="flex-1" />
              <span className="text-xs text-foreground-400">
                O regístrate con
              </span>
              <Divider className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="text-center">
              <span className="text-foreground-500 text-sm">
                ¿Ya tienes una cuenta?{" "}
              </span>
              <Link size="sm" onPress={onBackToLogin}>
                Inicia sesión
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
 */

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

interface RegisterProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onRegister,
  onBackToLogin,
}) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = "El nombre es requerido";
    if (!email) newErrors.email = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Correo inválido";

    if (!password) newErrors.password = "La contraseña es requerida";
    else if (password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!acceptTerms)
      newErrors.terms = "Debes aceptar los términos y condiciones";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      setIsLoading(false);

      if (error) {
        setErrors({ general: error.message });
        return;
      }

      // Registro exitoso
      onRegister();
    } catch (err: any) {
      setIsLoading(false);
      setErrors({ general: err.message || "Ocurrió un error inesperado" });
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
            <h2 className="text-xl font-semibold">Crear una cuenta</h2>
            <p className="text-foreground-500 text-sm">
              Regístrate para comenzar a monitorear tus acuarios
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            {errors.general && (
              <div className="text-danger text-sm p-2 bg-danger-50 rounded-medium">
                {errors.general}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                className="input-no-zoom"
                label="Nombre completo"
                placeholder="Ingresa tu nombre"
                value={name}
                onValueChange={setName}
                startContent={<Icon icon="lucide:user" className="text-default-400" />}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                isRequired
              />

              <Input
                className="input-no-zoom"
                label="Correo electrónico"
                placeholder="Ingresa tu correo"
                type="email"
                value={email}
                onValueChange={setEmail}
                startContent={<Icon icon="lucide:mail" className="text-default-400" />}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                isRequired
              />

              <Input
                className="input-no-zoom"
                label="Contraseña"
                placeholder="Crea una contraseña"
                type="password"
                value={password}
                onValueChange={setPassword}
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                isRequired
              />

              <Input
                className="input-no-zoom"
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                type="password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                isRequired
              />

              <Checkbox
                isSelected={acceptTerms}
                onValueChange={setAcceptTerms}
                size="sm"
                isInvalid={!!errors.terms}
              >
                <span className="text-sm">
                  Acepto los{" "}
                  <Link href="#" size="sm">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="#" size="sm">
                    política de privacidad
                  </Link>
                </span>
              </Checkbox>
              {errors.terms && <p className="text-danger text-xs">{errors.terms}</p>}

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Crear cuenta
              </Button>
            </form>

            <div className="flex items-center gap-4">
              <Divider className="flex-1" />
              <span className="text-xs text-foreground-400">O regístrate con</span>
              <Divider className="flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="bordered"
                startContent={<Icon icon="logos:google-icon" className="text-lg" />}
              >
                Google
              </Button>
              <Button
                variant="bordered"
                startContent={<Icon icon="logos:facebook" className="text-lg" />}
              >
                Facebook
              </Button>
            </div>

            <div className="text-center">
              <span className="text-foreground-500 text-sm">
                ¿Ya tienes una cuenta?{" "}
              </span>
              <Link size="sm" onPress={onBackToLogin}>
                Inicia sesión
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
