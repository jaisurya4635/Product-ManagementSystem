import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value.
 * Delays updating the debounced value until after `delay` ms
 * have elapsed since the last time `value` changed.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

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
