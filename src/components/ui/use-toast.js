import { useState, useCallback } from 'react';

let toastId = 0;

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({
    title,
    description,
    variant = 'default',
    duration = 5000
  }) => {
    const id = toastId++;
    const newToast = {
      id,
      title,
      description,
      variant,
      duration
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    toast,
    dismiss,
    dismissAll
  };
};

export { useToast };
