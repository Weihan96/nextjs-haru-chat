"use client"


import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ChatSettingsProps {
  defaultContextLength?: number;
  defaultTemperature?: number;
  defaultTopP?: number;
  defaultMaxLength?: number;
  className?: string;
  onSettingsChange?: (settings: {
    contextLength: number;
    temperature: number;
    topP: number;
    maxLength: number;
  }) => void;
}

const ChatSettings = ({
  defaultContextLength = 4000,
  defaultTemperature = 0.7,
  defaultTopP = 0.9,
  defaultMaxLength = 500,
  className,
  onSettingsChange
}: ChatSettingsProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(true);
  const [contextLength, setContextLength] = useState(defaultContextLength);
  const [temperature, setTemperature] = useState(defaultTemperature);
  const [topP, setTopP] = useState(defaultTopP);
  const [maxLength, setMaxLength] = useState(defaultMaxLength);
  
  const handleContextLengthChange = (value: number[]) => {
    setContextLength(value[0]);
    notifySettingsChange({ contextLength: value[0] });
  };
  
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
    notifySettingsChange({ temperature: value[0] });
  };
  
  const handleTopPChange = (value: number[]) => {
    setTopP(value[0]);
    notifySettingsChange({ topP: value[0] });
  };
  
  const handleMaxLengthChange = (value: number[]) => {
    setMaxLength(value[0]);
    notifySettingsChange({ maxLength: value[0] });
  };
  
  const notifySettingsChange = (partialSettings: Partial<{
    contextLength: number;
    temperature: number;
    topP: number;
    maxLength: number;
  }>) => {
    if (onSettingsChange) {
      onSettingsChange({
        contextLength,
        temperature,
        topP,
        maxLength,
        ...partialSettings
      });
    }
  };
  
  return (
    <div className={className}>
      <Separator className="my-4" />
      
      <Collapsible
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Chat Settings</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isSettingsOpen ? "Hide" : "Show"} Settings
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-3 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Context Length</label>
              <span className="text-xs text-muted-foreground">{contextLength} tokens</span>
            </div>
            <Slider 
              defaultValue={[contextLength]} 
              min={1000} 
              max={8000} 
              step={1000} 
              onValueChange={handleContextLengthChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Longer context allows for more detailed conversations.
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Temperature</label>
              <span className="text-xs text-muted-foreground">{temperature}</span>
            </div>
            <Slider 
              defaultValue={[temperature]} 
              max={1} 
              step={0.1} 
              onValueChange={handleTemperatureChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Higher values make the output more random.
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Top P</label>
              <span className="text-xs text-muted-foreground">{topP}</span>
            </div>
            <Slider 
              defaultValue={[topP]} 
              max={1} 
              step={0.1}
              onValueChange={handleTopPChange} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower values make the output more focused.
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm">Max Length</label>
              <span className="text-xs text-muted-foreground">{maxLength} tokens</span>
            </div>
            <Slider 
              defaultValue={[maxLength]} 
              max={1000} 
              step={100}
              onValueChange={handleMaxLengthChange} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum length of generated responses.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ChatSettings;
