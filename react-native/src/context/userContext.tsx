import { createContext, useContext, useState } from "react";
import { Usuario } from "../interfaces";

interface Ctx {
  user: Usuario | null;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>;
}

const UserContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

export const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<Usuario | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
