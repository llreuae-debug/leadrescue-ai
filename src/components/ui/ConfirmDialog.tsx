"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#101113]/60 backdrop-blur-xs transition-opacity animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-3xl border-2 border-[#101113] bg-white p-7 shadow-[0_10px_0_0_#101113] transition-all">
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 border border-rose-300">
                <AlertTriangle className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1">
              <Dialog.Title className="text-lg font-extrabold text-[#101113]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm text-[#777D77] leading-relaxed font-medium">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-xl p-1.5 text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2] focus:outline-none transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="btn-base btn-secondary text-xs font-bold px-4"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={cn(
                "btn-base text-xs font-bold px-5",
                isDestructive
                  ? "bg-rose-600 hover:bg-rose-700 text-white border-1.5 border-rose-800 shadow-[0_3px_0_0_#9f1239]"
                  : "btn-lime"
              )}
            >
              {isLoading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
