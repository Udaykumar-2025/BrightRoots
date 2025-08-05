import { useState, useCallback } from 'react';

interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  isOpen: boolean;
}

export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info'
  });

  const showConfirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        ...options,
        isOpen: true
      });

      // Store resolve function to call later
      (window as any).__confirmResolve = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
    if ((window as any).__confirmResolve) {
      (window as any).__confirmResolve(true);
      delete (window as any).__confirmResolve;
    }
  }, []);

  const handleCancel = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
    if ((window as any).__confirmResolve) {
      (window as any).__confirmResolve(false);
      delete (window as any).__confirmResolve;
    }
  }, []);

  return {
    dialogState,
    showConfirm,
    handleConfirm,
    handleCancel
  };
} 