import { useEffect } from "react";
import { useSiteData } from "@/hooks/useSiteData";

const hexToHsl = (hex?: string): string => {
  if (!hex || hex.length !== 7) return '240 5.9% 10%'; // fallback

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ThemeApplier() {
  const { data } = useSiteData();

  useEffect(() => {
    const theme = data.theme || {
      primary: '#0d9488',
      secondary: '#d97706',
      accent: '#b2dfdb',
      background: '#f5f9f8',
      foreground: '#1e3a3a',
      card: '#ffffff',
      muted: '#e8efee',
      footerBg: '#1e3a3a',
      footerText: '#f5f9f8'
    };
    const root = document.documentElement;
    const setVar = (name: string, hex: string) => root.style.setProperty(name, hexToHsl(hex));

    setVar("--primary", theme.primary || '#0d9488');
    setVar("--secondary", theme.secondary || '#d97706');
    setVar("--accent", theme.accent || '#b2dfdb');
    setVar("--background", theme.background || '#f5f9f8');
    setVar("--foreground", theme.foreground || '#1e3a3a');
    setVar("--card", theme.card || '#ffffff');
    setVar("--card-foreground", theme.foreground || '#1e3a3a');
    setVar("--popover", theme.card || '#ffffff');
    setVar("--popover-foreground", theme.foreground || '#1e3a3a');
    setVar("--muted", theme.muted || '#e8efee');
    setVar("--ring", theme.primary || '#0d9488');
    setVar("--accent-foreground", theme.primary || '#0d9488');

    // Gradientes
    const pHsl = hexToHsl(theme.primary);
    root.style.setProperty("--gradient-hero", `linear-gradient(135deg, hsl(${pHsl}), hsl(${pHsl} / 0.8))`);
    const sHsl = hexToHsl(theme.secondary);
    root.style.setProperty("--gradient-cta", `linear-gradient(135deg, hsl(${sHsl}), hsl(${sHsl} / 0.85))`);

    setVar("--sidebar-background", theme.primary || '#0d9488');
  }, [data]);

  return null;
}

