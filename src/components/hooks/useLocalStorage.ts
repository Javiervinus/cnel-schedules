import { useState } from "react";

function useLocalStorage<T>(
  key: string,
  defaultValue: T,

  saveToLocalStorage: boolean = true // Añadido un flag para controlar si guarda en localStorage
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = (
    value: T | ((val: T) => T),
    save: boolean = saveToLocalStorage
  ) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Solo guarda en localStorage si save es true
      if (save) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
