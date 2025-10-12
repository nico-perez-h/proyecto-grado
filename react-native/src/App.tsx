// Importamos React y los componentes principales de la aplicación.
import React from "react";
import { Dashboard } from "./components/dashboard";
import { Statistics } from "./components/statistics";
import { Devices } from "./components/devices";
import { Settings } from "./components/settings";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Login } from "./components/auth/login";
import { Register } from "./components/auth/register";
import { SplashScreen } from "./components/splash-screen";
import { supabase } from "./lib/supabaseClient";
import { useUserContext } from "./context/userContext";
import { useAppTheme } from "./hooks/useAppTheme";

// Componente principal de la aplicación
export default function App() {
  // Estado que guarda qué sección está seleccionada en la navegación
  const [selected, setSelected] = React.useState("dashboard");

  const { user, setUser, setAcuarios, setAcuarioSeleccionadoId } =
    useUserContext();

  // Estado que controla si se debe mostrar la pantalla de registro (Register) o de login
  const [showRegister, setShowRegister] = React.useState(false);

  // Estado que indica si la aplicación todavía está cargando (pantalla inicial SplashScreen)
  const [isLoading, setIsLoading] = React.useState(true);

  // useEffect se ejecuta al montar el componente
  React.useEffect(() => {
    // Simulamos un tiempo de carga inicial (ejemplo: cargar datos o verificar sesión)
    const timer = setTimeout(() => {
      setIsLoading(false); // después de 2 segundos, deja de estar en "cargando"
    }, 2000);

    // Cleanup: si el componente se desmonta antes de los 2s, limpiamos el timer
    return () => clearTimeout(timer);
  }, []);

  const { setAppTheme } = useAppTheme();

  // Función que maneja el login (en este ejemplo solo cambia el estado)
  const handleLogin = async (email: string) => {
    const { data, error: errorUser } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (errorUser) {
      alert("Error al obtener el usuario: " + errorUser.message);
      return;
    }

    const { data: dataAcuarios, error: errorAcuarios } = await supabase
      .from("acuarios")
      .select("*")
      .eq("id_usuario", data.id);

    if (errorUser || dataAcuarios.length === 0) {
      alert("Error al obtener los acuarios: " + errorAcuarios.message);
      return;
    }

    setUser(data);
    setAcuarios(dataAcuarios);
    setAcuarioSeleccionadoId(dataAcuarios[0].id);
    setAppTheme(data.oscuro ? "dark" : "light");
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser(null);
    setAcuarios(null);
  };

  // Si todavía estamos cargando, mostramos la pantalla SplashScreen
  if (isLoading) {
    return <SplashScreen />;
  }

  // Si el usuario no está autenticado, mostramos Login o Register según corresponda
  if (!user) {
    return showRegister ? (
      <Register
        onRegister={() => setShowRegister(false)}
        onBackToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onRegisterClick={() => setShowRegister(true)}
      />
    );
  }

  // Si el usuario está autenticado, mostramos la aplicación principal
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header con botón de logout */}
      <Header onLogout={handleLogout} />

      {/* Contenido principal que cambia según la opción seleccionada */}
      <main className="container mx-auto px-4 pb-20 pt-4">
        {selected === "dashboard" && <Dashboard setSelected={setSelected} />}
        {selected === "statistics" && <Statistics />}
        {selected === "devices" && <Devices />}
        {selected === "settings" && <Settings setSelected={setSelected} />}
      </main>

      {/* Barra de navegación inferior para cambiar de sección */}
      <Navigation selected={selected} onSelectionChange={setSelected} />
    </div>
  );
}
