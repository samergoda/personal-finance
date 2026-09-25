import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { InsightWarning } from "@/types/analytics";

interface AlertBannerProps {
  warnings: InsightWarning[];
  title?: string;
  className?: string;
}

export function AlertBanner({ warnings, title = "Needs attention", className }: AlertBannerProps) {
  return (
    <Alert variant="warning" className={className ?? "border-amber-200 bg-amber-50 text-amber-800"}>
      <AlertTitle className="text-amber-100">{title}</AlertTitle>
      <AlertDescription className="text-amber-100/90">
        <ul className="list-disc space-y-1 pl-5">
          {warnings.map((warning, index) => (
            <li key={`${warning.id}-${index}`}>{warning.message}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
