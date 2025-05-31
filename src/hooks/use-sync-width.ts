import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

export function useSyncWidth<
  S extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement
>(
  debounceDelay: number = 10
): {
  sourceRef: React.RefObject<S | null>, // Source element ref (more generic)
  targetRef: React.RefObject<T | null>, // Target element ref (more generic)
  width: number // Current synced width
} {
  const [width, setWidth] = React.useState<number>(0);
  const sourceRef = React.useRef<S | null>(null);
  const targetRef = React.useRef<T | null>(null);
  
  // Use debounced callback to avoid rapid updates
  const syncWidth = useDebounceCallback(() => {
    if (sourceRef.current && targetRef.current) {
      const newWidth = sourceRef.current.offsetWidth;
      targetRef.current.style.width = `${newWidth}px`;
      setWidth(newWidth);
    }
  }, debounceDelay);
  
  // Watch source div for size changes
  useResizeObserver(sourceRef.current, () => {
    let rAF = 0;
    cancelAnimationFrame(rAF);
    rAF = window.requestAnimationFrame(syncWidth);
    return () => cancelAnimationFrame(rAF);
  });
  
  // Initial sync after mount
  useLayoutEffect(() => {
    syncWidth();
  }, [syncWidth]);
  
  return {sourceRef, targetRef, width};
}

// Helper functions
function useDebounceCallback(callback: () => void, delay: number) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = React.useRef(0);
  
  React.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
  
  return React.useCallback(() => {
    window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(handleCallback, delay);
  }, [handleCallback, delay]);
}

function useResizeObserver(element: HTMLElement | null, onResize: () => void) {
  const handleResize = useCallbackRef(onResize);
  
  useLayoutEffect(() => {
    let rAF = 0;
    
    if (element) {
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      
      resizeObserver.observe(element);
      
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}