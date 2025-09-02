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

export default function App() {
  const [selected, setSelected] = React.useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carga inicial de la aplicación
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    // En una aplicación real, aquí se enviarían los datos al servidor
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onRegister={handleRegister} 
        onBackToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <Login 
        onLogin={handleLogin} 
        onRegisterClick={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        {selected === "dashboard" && <Dashboard />}
        {selected === "statistics" && <Statistics />}
        {selected === "devices" && <Devices />}
        {selected === "settings" && <Settings />}
      </main>
      
      <Navigation selected={selected} onSelectionChange={setSelected} />
    </div>
  );
}