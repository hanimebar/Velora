'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium transition-velora disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-accent)] text-white hover:bg-[#5a7a52] shadow-sm',
        outline:
          'border border-[var(--color-border-strong)] bg-transparent hover:bg-[var(--color-surface)] text-[var(--color-foreground)]',
        ghost:
          'hover:bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]',
        destructive:
          'bg-[var(--color-danger)] text-white hover:opacity-90',
        secondary:
          'bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface)] border border-[var(--color-border)]',
        link:
          'text-[var(--color-accent)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 text-sm',
        sm: 'h-7 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        xl: 'h-13 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
