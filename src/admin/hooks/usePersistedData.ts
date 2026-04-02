import { useState, useEffect, useRef } from 'react';

export function usePersistedData<T>(key: string, initialData: T) {
  const [data, setData] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(`asrar_admin_${key}`);
      return saved ? JSON.parse(saved) : initialData;
    } catch {
      console.warn(`Failed to parse localStorage key "asrar_admin_${key}", using defaults.`);
      return initialData;
    }
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(`asrar_admin_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to persist data for key "${key}":`, e);
    }
  }, [key, data]);

  return [data, setData, false] as const;
}
