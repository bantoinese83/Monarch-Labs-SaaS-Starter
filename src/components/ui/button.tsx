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
      'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
    const variants: Record<string, string> = {
      primary:
        'grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600',
      secondary: 'grunge-border bg-black/40 text-gray-200 hover:bg-black/60',
      ghost: 'text-gray-300 hover:text-white',
      destructive: 'grunge-border bg-red-600 text-white hover:bg-red-500',
    }
    return <Comp className={`${base} ${variants[variant]} ${className}`} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'
