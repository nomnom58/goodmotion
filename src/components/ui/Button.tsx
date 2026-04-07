import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  borderRadius?: 'none' | 'full' | 'md' | '16'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', borderRadius = 'md', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-none',
          {
            'bg-brand text-white hover:opacity-90': variant === 'primary',
            'bg-primary-text text-white hover:opacity-90': variant === 'secondary',
            'border border-border-color bg-transparent text-primary-text hover:bg-black/5': variant === 'outline',
            'rounded-none': borderRadius === 'none',
            'rounded-[16px]': borderRadius === '16',
            'rounded-full': borderRadius === 'full',
            'rounded-md': borderRadius === 'md',
            'px-3 py-[7px]': size === 'default',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
