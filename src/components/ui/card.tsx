import { cn } from '@/utils/cn';

/** Surface card container used by content cards and panels. */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-xl border border-border/90 bg-surface text-surface-foreground shadow-sm transition-[border-color,box-shadow,transform] duration-200', className)}>
      {children}
    </div>
  );
}
