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
          className="block text-xs font-bold text-[#202320]"
        >
          {label}
          {required && <span className="text-rose-600 ml-1 font-bold">*</span>}
        </label>
      </div>

      <div>{children}</div>

      {hint && !error && (
        <p className="text-xs text-[#777D77] font-medium">{hint}</p>
      )}

      {error && (
        <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
          <span aria-hidden="true">•</span> {error}
        </p>
      )}
    </div>
  );
};
