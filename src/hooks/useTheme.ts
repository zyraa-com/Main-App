"use client";

import { useCallback, useEffect, useState } from "react";
import { applyTheme, readTheme, type Theme, writeTheme } from "@/lib/theme";

const CHANNEL = "zyraa-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  // On mount: read cookie and apply immediately
  useEffect(() => {
    const current = readTheme();
    setThemeState(current);
    applyTheme(current);
  }, []);

  // Listen for changes from other tabs (same origin)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL);
      channel.onmessage = (e: MessageEvent<Theme>) => {
        setThemeState(e.data);
        applyTheme(e.data);
      };
    } catch (_) {}
    return () => channel?.close();
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    writeTheme(next);
    try {
      const ch = new BroadcastChannel(CHANNEL);
      ch.postMessage(next);
      ch.close();
    } catch (_) {}
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggle };
}
