import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'grunge-border bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white hover:from-fuchsia-500 hover:to-purple-600',
        secondary: 'grunge-border bg-black/40 text-gray-200 hover:bg-black/60',
        ghost: 'text-gray-300 hover:text-white',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)
