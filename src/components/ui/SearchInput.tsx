import React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  wrapperClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search leads, clients, campaigns...",
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <div className={cn("relative flex items-center w-full min-w-[200px]", wrapperClassName)}>
      <Search className="absolute left-3.5 w-4 h-4 text-[#777D77] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "input-base w-full pl-10 pr-9 text-sm placeholder:text-[#777D77] border-1.5 border-[#DCDDDA] rounded-xl focus:border-[#101113] focus:ring-2 focus:ring-[#B7FF3C]/40",
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2.5 p-1 rounded-md text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
