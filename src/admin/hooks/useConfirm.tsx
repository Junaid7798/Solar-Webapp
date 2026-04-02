import { useState, useCallback } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface ConfirmOptions {
  title: string;
  message: string;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmOptions & { resolve: (value: boolean) => void } | null>(null);

  const openConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    confirmState?.resolve(true);
    setConfirmState(null);
  };

  const handleCancel = () => {
    confirmState?.resolve(false);
    setConfirmState(null);
  };

  const ConfirmDialogWrapper = () => (
    <ConfirmDialog
      isOpen={!!confirmState}
      title={confirmState?.title || ''}
      message={confirmState?.message || ''}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { openConfirm, ConfirmDialogWrapper };
};