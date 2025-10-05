import React from 'react'
import { Slot } from '@radix-ui/react-slot'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  className?: string
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const base =
      'inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed min-touch-target transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500'
    const variants: Record<string, string> = {
      primary:
        'grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600 hover:scale-105 active:scale-95',
      secondary:
        'grunge-border bg-black/40 text-gray-200 hover:bg-black/60 hover:scale-105 active:scale-95',
      ghost: 'text-gray-300 hover:text-white hover:bg-black/20 hover:scale-105 active:scale-95',
      destructive:
        'grunge-border bg-red-600 text-white hover:bg-red-500 hover:scale-105 active:scale-95',
    }
    return <Comp className={`${base} ${variants[variant]} ${className}`} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'
