"use client"

import React from 'react';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface ChatManageModeProps {
  selectedChats: string[];
  selectAll: boolean;
  onSelectAll: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

const ChatManageMode = ({ 
  selectedChats, 
  selectAll, 
  onSelectAll, 
  onDelete, 
  onCancel 
}: ChatManageModeProps) => {
  const deleteDisabled = selectedChats.length === 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox 
          id="selectAll" 
          checked={selectAll} 
          onCheckedChange={onSelectAll}
        />
        <div className="flex items-center gap-2">
          <p className="text-sm select-none">Select all</p>
          {selectedChats.length > 0 && (
            <Badge 
              variant="default" 
              className="text-xs h-5 min-w-5 flex items-center justify-center rounded-full bg-primary px-1.5"
            >
              {selectedChats.length}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="disabled:pointer-events-auto">
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 disabled:cursor-not-allowed"
                disabled={deleteDisabled}
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {deleteDisabled?<p>Select chats to delete</p>:<p>Delete</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cancel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChatManageMode;
