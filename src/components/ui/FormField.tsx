import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  hint,
  required,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="block text-xs font-semibold text-slate-700"
        >
          {label}
          {required && <span className="text-rose-600 ml-1">*</span>}
        </label>
      </div>

      <div>{children}</div>

      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
          <span aria-hidden="true">•</span> {error}
        </p>
      )}
    </div>
  );
};
