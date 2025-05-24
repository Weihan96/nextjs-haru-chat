"use client"


import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatDeleteDialogProps {
  isOpen: boolean;
  selectedCount: number;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

const ChatDeleteDialog = ({
  isOpen,
  selectedCount,
  onOpenChange,
  onConfirmDelete
}: ChatDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="z-[80]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedCount} Conversation{selectedCount !== 1 && 's'}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedCount} selected conversation{selectedCount !== 1 && 's'}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChatDeleteDialog;
