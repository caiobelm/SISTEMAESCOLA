import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  title?: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Card({ title, description, footer, className, children }: CardProps) {
  return (
    <div className={clsx('rounded-lg border border-slate-200 bg-white p-5 shadow-sm', className)}>
      {(title || description) && (
        <header className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </header>
      )}
      <div className="text-slate-700">{children}</div>
      {footer && <footer className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-500">{footer}</footer>}
    </div>
  );
}
