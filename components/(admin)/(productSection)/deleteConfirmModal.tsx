"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  productName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  productName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button when modal opens
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle
                  size={18}
                  className="text-red-500"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2
                  id="delete-modal-title"
                  className="text-base font-bold text-gray-900"
                >
                  Delete product
                </h2>
                <p
                  id="delete-modal-desc"
                  className="text-sm text-gray-500 mt-1 leading-relaxed"
                >
                  <span className="font-medium text-gray-700">
                    {productName}
                  </span>{" "}
                  will be permanently deleted. This action cannot be undone.
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 ml-2"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 px-6 pb-6 pt-2">
            <button
              ref={cancelRef}
              onClick={onCancel}
              disabled={isDeleting}
              className="
                flex-1 py-2.5 px-4 rounded-lg border border-gray-300
                text-sm font-medium text-gray-700
                hover:bg-gray-50 transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="
                flex-1 py-2.5 px-4 rounded-lg
                bg-red-600 hover:bg-red-700
                text-sm font-semibold text-white
                transition-colors duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
