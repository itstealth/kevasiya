"use client";

import React from "react";
import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog";
import QueryForm from "../sections/form/query-form";
import { X } from "lucide-react";

interface PopupQueryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopupQueryForm: React.FC<PopupQueryFormProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 bg-transparent border-0 shadow-none">
        
        <div className="p-4 relative">
          <span className="absolute top-4 z-50 right-4 bg-white rounded p-2">
            <X className="h-4 w-4 cursor-pointer block " onClick={() => onOpenChange(false)} />
          </span>
          <QueryForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupQueryForm;
