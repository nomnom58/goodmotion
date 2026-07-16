'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type ToastType = 'success' | 'fail'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message: string
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, title, message }])

    // Auto-remove after 4 seconds to give user time to read
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-[90%] sm:max-w-[420px] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`
              flex items-center gap-3 p-4 rounded-[16px] border shadow-sm pointer-events-auto cursor-pointer transition-all duration-300 animate-slide-in font-mono
              ${
                toast.type === 'success'
                  ? 'bg-[#E8F8F0] border-[#C2F0D9] text-[#1F1F1F]'
                  : 'bg-[#FEF2F2] border-[#FDD1D1] text-[#1F1F1F]'
              }
            `}
          >
            {/* Left Icon */}
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                // Green Circle with White Checkmark
                <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                // Red Circle with White Warning/Exclamation in Octagon
                <div className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Octagon shape */}
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                    {/* Exclamation point */}
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content Stack */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <span className="text-[14px] font-semibold leading-none tracking-tight select-none">
                {toast.title}
              </span>
              <span
                className={`text-[12px] leading-tight tracking-tight select-none ${
                  toast.type === 'success' ? 'text-[#16A34A]' : 'text-[#EF4444]'
                }`}
              >
                {toast.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
