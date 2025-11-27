import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing timeouts with automatic cleanup
 * Prevents memory leaks from uncleared timeouts
 */
export const useTimeoutManager = () => {
  const timeoutRefs = useRef([]);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear all timeouts on unmount
      timeoutRefs.current.forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      timeoutRefs.current = [];
    };
  }, []);

  const addTimeout = useCallback((timeoutId) => {
    if (isMountedRef.current && timeoutId) {
      timeoutRefs.current.push(timeoutId);
    }
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    timeoutRefs.current = [];
  }, []);

  return { addTimeout, clearAllTimeouts };
};

