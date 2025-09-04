import { useState, useEffect, useCallback } from 'react';

export const useFormPersistence = <T extends Record<string, any>>(
  key: string,
  initialData: T
) => {
  const [formData, setFormData] = useState<T>(initialData);

  // Load form data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
    }
  }, [key]);

  // Save form data to localStorage whenever it changes
  const updateFormData = useCallback((newData: T | ((prev: T) => T)) => {
    setFormData(prevData => {
      const updatedData = typeof newData === 'function' ? newData(prevData) : newData;
      
      try {
        localStorage.setItem(key, JSON.stringify(updatedData));
      } catch (error) {
        console.warn('Failed to save form data to localStorage:', error);
      }
      
      return updatedData;
    });
  }, [key]);

  // Clear saved form data
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setFormData(initialData);
    } catch (error) {
      console.warn('Failed to clear form data from localStorage:', error);
    }
  }, [key, initialData]);

  return {
    formData,
    updateFormData,
    clearFormData,
  };
};
