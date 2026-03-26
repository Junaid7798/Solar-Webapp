import { useState, useEffect, useRef } from 'react';

export function usePersistedData<T>(key: string, initialData: T) {
  const [data, setData] = useState<T>(() => {
    const saved = localStorage.getItem(`asrar_admin_${key}`);
    return saved ? JSON.parse(saved) : initialData;
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(`asrar_admin_${key}`, JSON.stringify(data));
  }, [key, data]);

  return [data, setData] as const;
}
