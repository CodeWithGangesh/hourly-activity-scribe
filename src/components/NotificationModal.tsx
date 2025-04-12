
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BellRing, Clock } from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md animate-fade-in">
        <DialogHeader>
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <BellRing className="h-8 w-8 text-primary pulse-animation" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">Hour Completed!</DialogTitle>
          <DialogDescription className="text-center">
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock className="h-4 w-4" />
              <span>Time to log what you've been doing</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Button onClick={onClose} className="px-8">
            Log Activity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
