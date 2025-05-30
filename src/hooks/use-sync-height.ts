import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

export function useSyncHeight<
  S extends HTMLElement = HTMLElement,
  T extends HTMLElement = HTMLElement
>(
  debounceDelay: number = 10,
): {
  sourceRef: React.RefObject<S>, // Source element ref (more generic)
  targetRef: React.RefObject<T>, // Target element ref (more generic)
  height: number // Current synced height
} {
  const [height, setHeight] = React.useState<number>(0);
  const sourceRef = React.useRef<S>(null);
  const targetRef = React.useRef<T>(null);
  
  // Use debounced callback to avoid rapid updates
  const syncHeight = useDebounceCallback(() => {
    if (sourceRef.current && targetRef.current) {
      const newHeight = sourceRef.current.offsetHeight;
      targetRef.current.style.height = `${newHeight}px`;
      setHeight(newHeight);
    }
  }, debounceDelay);
  
  // Watch source div for size changes
  useResizeObserver(sourceRef.current, () => {
    let rAF = 0;
    cancelAnimationFrame(rAF);
    rAF = window.requestAnimationFrame(syncHeight);
    return () => cancelAnimationFrame(rAF);
  });
  
  // Initial sync after mount
  useLayoutEffect(() => {
    syncHeight();
  }, [syncHeight]);
  
  return {sourceRef, targetRef, height};
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