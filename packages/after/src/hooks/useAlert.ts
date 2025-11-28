import { useState, useCallback } from 'react';

type AlertType = 'success' | 'error';

interface AlertState {
  isVisible: boolean;
  message: string;
  type: AlertType;
}

export function useAlert() {
  const [alert, setAlert] = useState<AlertState>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showSuccess = useCallback((message: string) => {
    setAlert({ isVisible: true, message, type: 'success' });
  }, []);

  const showError = useCallback((message: string) => {
    setAlert({ isVisible: true, message, type: 'error' });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    alert,
    showSuccess,
    showError,
    hideAlert,
  };
}
