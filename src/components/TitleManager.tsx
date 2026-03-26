import { useEffect } from "react";
import { useSiteData } from "@/hooks/useSiteData";

export function TitleManager() {
  const { data } = useSiteData();

  useEffect(() => {
    const title = data.identity?.name || 'Clínica Médica';
    document.title = `${title} - Cardiologista`;
  }, [data.identity?.name]);

  return null;
}

