'use client';
import { useEffect, useRef } from "react";

export const useAbortController = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const getAbortSignal = (): AbortSignal => {
    if (abortControllerRef.current) {
      // Abort any ongoing request
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        // Abort request on unmount
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { getAbortSignal };
};
