"use client";

import { useCallback, useSyncExternalStore } from "react";

export type BrowseViewMode = "card" | "list";

const VIEW_EVENT = "turkiyejobs:view-mode-preference";

function parseMode(raw: string | null): BrowseViewMode {
  return raw === "list" ? "list" : "card";
}

function subscribe(storageKey: string, onStoreChange: () => void) {
  const onCrossTab = (e: StorageEvent) => {
    if (e.key === storageKey || e.key === null) onStoreChange();
  };
  const onSameTab = (e: Event) => {
    const detail = (e as CustomEvent<{ key: string }>).detail;
    if (detail?.key === storageKey) onStoreChange();
  };
  window.addEventListener("storage", onCrossTab);
  window.addEventListener(VIEW_EVENT, onSameTab);
  return () => {
    window.removeEventListener("storage", onCrossTab);
    window.removeEventListener(VIEW_EVENT, onSameTab);
  };
}

function getServerSnapshot(): BrowseViewMode {
  return "card";
}

function getClientSnapshot(storageKey: string): BrowseViewMode {
  return parseMode(localStorage.getItem(storageKey));
}

/**
 * Persists card vs list layout in localStorage (per storageKey).
 */
export function usePersistedViewMode(storageKey: string) {
  const mode = useSyncExternalStore(
    (onStoreChange) => subscribe(storageKey, onStoreChange),
    () => getClientSnapshot(storageKey),
    getServerSnapshot,
  );

  const setMode = useCallback(
    (m: BrowseViewMode) => {
      localStorage.setItem(storageKey, m);
      window.dispatchEvent(
        new CustomEvent(VIEW_EVENT, { detail: { key: storageKey } }),
      );
    },
    [storageKey],
  );

  return { mode, setMode };
}
