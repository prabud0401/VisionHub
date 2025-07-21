
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

  // Initialize state with a function to read from localStorage only on the client
  const [storedValue, setStoredValue] = useState<T>(() => {
    // During server-side rendering or before the client is ready, return initialValue.
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

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

  // Effect to update the state if localStorage changes in another tab
  useEffect(() => {
    if (isClient) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
          try {
            setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
          } catch (error) {
            console.warn(`Error parsing localStorage change for key “${key}”:`, error);
          }
        }
      };
      window.addEventListener('storage', handleStorageChange);
      // Set loaded to true once we're on the client
      setLoaded(true); 
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isClient, key, initialValue]);

  return [storedValue, setValue, loaded];
}
