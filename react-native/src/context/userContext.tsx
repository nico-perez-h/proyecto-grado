import { createContext, useContext, useState } from "react";
import { Acuario, Usuario } from "../interfaces";

interface Ctx {
  user: Usuario | null;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
  acuarios: Acuario[] | null;
  setAcuarios: React.Dispatch<React.SetStateAction<Acuario[] | null>>;
  acuarioSeleccionado: Acuario | null;
  setAcuarioSeleccionadoId: React.Dispatch<React.SetStateAction<number | null>>;
  modificarAcuarioSeleccionado: (acuario: Acuario) => void;
  anadirAcuario: (acuario: Acuario) => void;
  removerAcuario: (id: number) => void;
}

const UserContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

export const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [acuarios, setAcuarios] = useState<Acuario[] | null>(null);
  const [acuarioSeleccionadoId, setAcuarioSeleccionadoId] = useState<
    number | null
  >(null);

  const acuarioSeleccionado =
    acuarios?.find((acuario) => acuario.id === acuarioSeleccionadoId) || null;

  const modificarAcuarioSeleccionado = (acuario: Acuario) => {
    setAcuarios((prevAcuarios) => {
      if (!prevAcuarios) return prevAcuarios;
      return prevAcuarios.map((a) =>
        a.id === acuarioSeleccionado.id ? acuario : a
      );
    });
  };

  const anadirAcuario = (acuario: Acuario) => {
    setAcuarios((prev) => [...prev, acuario]);
  };

  const removerAcuario = (id: number) => {
    setAcuarios((prev) => prev?.filter((acuario) => acuario.id !== id) || null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        acuarios,
        setAcuarios,
        acuarioSeleccionado,
        setAcuarioSeleccionadoId,
        modificarAcuarioSeleccionado,
        anadirAcuario,
        removerAcuario,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a UserContextProvider");
  }
  return context;
};
