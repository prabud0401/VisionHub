
'use client';

import { useState, useEffect, useCallback } from 'react';

// A custom hook to determine if the component has mounted on the client
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const isClient = useIsClient();
  const [loaded, setLoaded] = useState(false);

  // This function reads the value from localStorage
  const readValue = useCallback((): T => {
    // Prevent server-side execution
    if (!isClient) {
      return initialValue;
    }
    // Read from localStorage
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
    }
    setLoaded(true);
    return initialValue;
  }, [isClient, key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // This function sets the value in both state and localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    if (!isClient) {
      console.warn(`Tried to set localStorage key “${key}” on the server.`);
      return;
    }
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  // Re-read from localStorage when the key or client status changes.
  useEffect(() => {
    setStoredValue(readValue());
    if (isClient) {
      setLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isClient]);

  return [storedValue, setValue, loaded];
}
