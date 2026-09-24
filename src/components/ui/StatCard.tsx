import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { formatChangePercent } from '@/utils/formatting'

interface StatCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon?: ReactNode
  iconBg?: string
  valueColor?: string
  subtitle?: string
}

export function StatCard({
  title, value, change, changeLabel = 'vs last month',
  icon, iconBg = 'bg-indigo-50', valueColor = 'text-gray-900', subtitle,
}: StatCardProps) {
  const positive = change !== undefined && change > 0
  const negative = change !== undefined && change < 0

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {icon && (
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 ml-3`}>
              {icon}
            </div>
          )}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span className={positive ? 'text-emerald-600 font-medium' : negative ? 'text-red-500 font-medium' : 'text-gray-500'}>
              {formatChangePercent(change)}
            </span>
            <span className="text-gray-400">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
