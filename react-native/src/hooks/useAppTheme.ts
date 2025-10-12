import { useTheme } from "@heroui/use-theme";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabaseClient";
import { useThemeContext } from "../context/themeContext";

export const useAppTheme = () => {
  const { theme, setTheme } = useTheme();
  const { user, setUser } = useUserContext();
  const { setAppTheme: setContextAppTheme } = useThemeContext();

  const toggleAppTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    setContextAppTheme(newTheme);

    if (user) {
      await supabase
        .from("usuarios")
        .update({ oscuro: newTheme === "dark" })
        .eq("id", user.id);
      setUser({ ...user, oscuro: newTheme === "dark" });
    }
  };

  const setAppTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setContextAppTheme(newTheme);
  };

  return { theme, setAppTheme, toggleAppTheme };
};
