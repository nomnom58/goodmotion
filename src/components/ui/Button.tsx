import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  borderRadius?: 'none' | 'full' | 'md' | '16'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', borderRadius = 'md', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          {
            'bg-brand text-white border-none hover:opacity-90': variant === 'primary',
            'bg-primary-text text-white border-none hover:opacity-90': variant === 'secondary',
            'border border-solid border-border-color bg-transparent text-primary-text hover:bg-black/5': variant === 'outline',
            'bg-white border border-solid border-[#000000] text-[#000000] text-[16px] font-bold hover:bg-black/5': variant === 'ghost',
            'bg-[#E74E1B] text-white border-none text-[16px] font-bold hover:opacity-90': variant === 'accent',
            'rounded-none': borderRadius === 'none',
            'rounded-[16px]': borderRadius === '16',
            'rounded-full': borderRadius === 'full',
            'rounded-md': borderRadius === 'md',
            'px-3 py-[7px]': size === 'default',
            'px-4 py-2 text-[14px]': size === 'sm',
            'px-6 py-3 text-[16px] font-bold': size === 'lg',
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

