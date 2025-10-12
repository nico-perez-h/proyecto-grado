import { createContext, useContext, useEffect, useState } from "react";

interface Ctx {
  isDark: boolean;
  setAppTheme: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const ThemeContext = createContext<Ctx | null>(null);

interface Props {
  children: JSX.Element;
}

export const ThemeContextProvider = ({ children }: Props) => {
  const [appTheme, setAppTheme] = useState<"light" | "dark">("light");

  return (
    <ThemeContext.Provider value={{ isDark: appTheme === "dark", setAppTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("this contexts must be used whitin a ThemeContextProvider");
  }
  return context;
};
