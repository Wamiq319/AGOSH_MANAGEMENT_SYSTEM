import React from "react";
import { Button } from "@/components";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Confirm Action</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline" color="gold">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant="filled"
            color="red"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
