"use client"
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

type Toast = { id: string; title?: string; message: string; type?: 'info' | 'success' | 'error'; timeout?: number }

interface ToastContextValue {
  push: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    const toast: Toast = { timeout: 4000, type: 'info', ...t, id }
    setToasts(prev => [...prev, toast])
    if (toast.timeout) {
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), toast.timeout)
    }
  }, [])

  // Inject minimal fade-in animation style once on mount
  useEffect(() => {
    const styleId = 'toast-fade-style'
    if (document.getElementById(styleId)) return
    const el = document.createElement('style')
    el.id = styleId
    el.innerHTML = `@keyframes fade-in {from{opacity:0;transform:translateY(-4px)} to {opacity:1;transform:translateY(0)} } .animate-fade-in{animation:fade-in .35s ease forwards}`
    document.head.appendChild(el)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-80">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-lg shadow-card border p-4 backdrop-blur bg-white/90 border-slate-200 animate-fade-in flex gap-3 items-start ${t.type === 'success' ? 'border-emerald-300' : t.type === 'error' ? 'border-red-300' : 'border-slate-200'}`}>            
            <div className="flex-1">
              {t.title && <p className="font-semibold text-sm mb-0.5">{t.title}</p>}
              <p className="text-xs leading-relaxed text-slate-600">{t.message}</p>
            </div>
            <button aria-label="Dismiss" className="text-slate-400 hover:text-slate-600 text-xs" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// (animation CSS is injected inside ToastProvider)