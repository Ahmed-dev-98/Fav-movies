import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MediaFormSimple from "./MediaFormSimple";
import type { Media } from "@/types/media";

interface MediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  media?: Media | null;
  mode: "create" | "edit";
}

const MediaDialog: React.FC<MediaDialogProps> = ({
  isOpen,
  onClose,
  media = null,
  mode,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] min-w-[800px] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-900 dark:text-white">
            {mode === "create" ? "Add New Media" : "Edit Media"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <MediaFormSimple initialData={media} onCancel={onClose} mode={mode} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDialog;
