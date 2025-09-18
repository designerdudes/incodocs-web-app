"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // icons
import { Switch } from "@/components/ui/switch"; // assuming you have shadcn switch

export function AppearanceToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    setTheme(storedTheme === "light" ? "light" : "dark");
  }, []);

  const handleToggle = (checked: boolean) => {
    const newTheme = checked ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("class", newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch checked={theme === "light"} onCheckedChange={handleToggle} />
      <Moon className="h-4 w-4" />
    </div>
  );
}
