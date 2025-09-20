// Importamos HeroUIProvider y ToastProvider desde la librería @heroui/react.
// Estos son proveedores de contexto que permiten usar los componentes y notificaciones de la librería en toda la app.
import {HeroUIProvider, ToastProvider} from "@heroui/react";

// Importamos React, que es necesario para crear componentes y usar JSX.
import React from "react";

// Importamos ReactDOM, que nos permite renderizar la aplicación de React en el DOM (en el HTML real del navegador).
import ReactDOM from "react-dom/client";

// Importamos el componente principal de nuestra aplicación, llamado App.
import App from "./App.tsx";

// Importamos los estilos globales de la aplicación desde index.css.
import "./index.css";

// Creamos el punto de entrada de la aplicación.
// Buscamos el elemento con id="root" en el HTML (generalmente en index.html) y ahí montamos nuestra app de React.
ReactDOM.createRoot(document.getElementById("root")!).render(
  // React.StrictMode es una herramienta que ayuda a detectar problemas potenciales en la aplicación durante el desarrollo.
  <React.StrictMode>
    {/* HeroUIProvider envuelve toda la app para que los componentes de HeroUI funcionen con su tema y configuración. */}
    <HeroUIProvider>
      {/* ToastProvider permite mostrar notificaciones (toasts) en cualquier parte de la aplicación. */}
      <ToastProvider />
      {/* Aquí renderizamos el contenido principal de la app. */}
      <main className="text-foreground bg-background">
        {/* Renderizamos el componente App, que es donde empieza la lógica principal de la app. */}
        <App />
      </main>
    </HeroUIProvider>
  </React.StrictMode>,
);
