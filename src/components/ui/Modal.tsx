"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean; onClose: () => void; title?: string;
  children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl"; footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, size = "md", footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) { document.addEventListener("keydown", fn); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === overlayRef.current && onClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className={cn("relative w-full rounded-2xl border border-[#2a3347] bg-[#111827] shadow-2xl animate-fade-up", sizes[size])}>
        {title && (
          <div className="flex items-center justify-between border-b border-[#2a3347] px-6 py-4">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-[#2a3347] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
