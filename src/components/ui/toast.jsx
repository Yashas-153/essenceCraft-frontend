import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ id, title, description, variant = 'default', duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const variants = {
    default: {
      bg: 'bg-stone-900',
      text: 'text-white',
      icon: Info,
      iconColor: 'text-white'
    },
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border border-emerald-200',
      icon: CheckCircle,
      iconColor: 'text-emerald-600'
    },
    destructive: {
      bg: 'bg-red-50',
      text: 'text-red-900',
      border: 'border border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600'
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600'
    }
  };

  const variantStyles = variants[variant] || variants.default;
  const IconComponent = variantStyles.icon;

  return (
    <div className={`${variantStyles.bg} ${variantStyles.text} ${variantStyles.border || ''} rounded-lg shadow-lg p-4 flex items-start gap-4 animate-in slide-in-from-right-full duration-300`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${variantStyles.iconColor}`} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
        )}
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default Toast;
