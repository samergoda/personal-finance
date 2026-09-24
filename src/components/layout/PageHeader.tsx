import type { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <div className="bg-card">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
      <Separator />
    </div>
  )
}
