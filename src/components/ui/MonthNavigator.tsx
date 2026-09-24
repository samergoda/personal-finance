import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { Button } from '@/components/ui/Button'
import { formatMonthLabel, prevMonth, nextMonth } from '@/utils/dates'

interface MonthNavigatorProps {
  month: string
  onChange: (month: string) => void
  maxMonth?: string
}

export function MonthNavigator({ month, onChange, maxMonth }: MonthNavigatorProps) {
  const canGoNext = !maxMonth || nextMonth(month) <= maxMonth

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onChange(prevMonth(month))} aria-label="Previous month" className="h-8 w-8">
        <HiChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-semibold min-w-[140px] text-center select-none">
        {formatMonthLabel(month)}
      </span>
      <Button variant="ghost" size="icon" onClick={() => onChange(nextMonth(month))} disabled={!canGoNext} aria-label="Next month" className="h-8 w-8">
        <HiChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
