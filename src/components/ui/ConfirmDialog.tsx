"use client";

import { useTranslations } from "next-intl";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }: ConfirmDialogProps) {
  const t = useTranslations("common");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {t("delete")}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title ?? t("confirmDelete")}</h3>
        <p className="text-sm text-gray-500">{message ?? t("deleteWarning")}</p>
      </div>
    </Modal>
  );
}
