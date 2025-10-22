'use client';

import React, { createContext, useContext, useCallback } from 'react';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  ToastProvider as RadixToastProvider,
  type ToastActionElement,
} from '@/components/ui/toast';

interface ToastContextType {
  toast: (props: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
    action?: ToastActionElement;
  }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string;
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive' | 'success';
      action?: ToastActionElement;
    }>
  >([]);

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      action,
    }: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive' | 'success';
      action?: ToastActionElement;
    }) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [
        ...prev,
        {
          id,
          title,
          description,
          variant,
          action,
        },
      ]);
    },
    []
  );

  const success = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'success' });
    },
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'destructive' });
    },
    [toast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'default' });
    },
    [toast]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      <RadixToastProvider>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            onOpenChange={(open) => {
              if (!open) {
                removeToast(toast.id);
              }
            }}
          >
            <div className='grid gap-1'>
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            {toast.action && toast.action}
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
