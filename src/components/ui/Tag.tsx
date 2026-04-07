import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  className?: string
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[24px] bg-tag-bg px-[10px] py-[5px] text-[14px] font-medium text-tag-text',
        className
      )}
    >
      {children}
    </span>
  )
}
