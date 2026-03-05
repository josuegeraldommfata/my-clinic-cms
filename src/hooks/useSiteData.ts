import { useState, useEffect, useCallback } from "react";
import { SiteData, defaultSiteData } from "@/data/mockData";

const STORAGE_KEY = "siteData";

function loadData(): SiteData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSiteData, ...JSON.parse(stored) };
    }
  } catch {}
  return defaultSiteData;
}

export function useSiteData() {
  const [data, setData] = useState<SiteData>(loadData);

  useEffect(() => {
    const handler = () => setData(loadData());
    window.addEventListener("storage", handler);
    window.addEventListener("siteDataUpdated", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("siteDataUpdated", handler);
    };
  }, []);

  const updateData = useCallback((updater: (prev: SiteData) => SiteData) => {
    setData((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("siteDataUpdated"));
      return next;
    });
  }, []);

  const updateSection = useCallback(
    <K extends keyof SiteData>(key: K, value: SiteData[K]) => {
      updateData((prev) => ({ ...prev, [key]: value }));
    },
    [updateData]
  );

  return { data, updateData, updateSection };
}
