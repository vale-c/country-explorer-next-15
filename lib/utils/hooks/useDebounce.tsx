import { useState, useEffect } from "react";

/**
 * Debounce hook to delay the execution of a value update.
 * @param value The input value to debounce
 * @param delay The delay in milliseconds for debouncing
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
