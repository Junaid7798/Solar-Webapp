import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function useSupabaseData<T extends { id: string }>(table: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    supabase!
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data: rows, error }) => {
        if (!error && rows) setData(rows as T[]);
        setLoading(false);
      });
  }, [table]);

  const upsert = useCallback(async (row: T) => {
    if (!isSupabaseConfigured()) {
      setData((prev) => {
        const exists = prev.some((r) => r.id === row.id);
        return exists ? prev.map((r) => (r.id === row.id ? row : r)) : [row, ...prev];
      });
      return;
    }
    const { data: updated } = await supabase!.from(table).upsert(row).select();
    if (updated) {
      setData((prev) => {
        const exists = prev.some((r) => r.id === row.id);
        return exists ? prev.map((r) => (r.id === row.id ? row : r)) : [row, ...prev];
      });
    }
  }, [table]);

  const remove = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) {
      setData((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    await supabase!.from(table).delete().eq('id', id);
    setData((prev) => prev.filter((r) => r.id !== id));
  }, [table]);

  return { data, setData, upsert, remove, loading };
}
