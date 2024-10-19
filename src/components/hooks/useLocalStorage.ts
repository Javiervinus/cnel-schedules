import { useEffect, useState } from "react";

function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  saveToLocalStorage: boolean = true
) {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item) as T);
        }
      } catch (error) {
        console.error(`Error reading key "${key}" from localStorage:`, error);
      }
    }
  }, [key]);

  const setValue = (
    value: T | ((val: T) => T),
    save: boolean = saveToLocalStorage
  ) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (save && typeof window !== "undefined" && saveToLocalStorage) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting key "${key}" in localStorage:`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
