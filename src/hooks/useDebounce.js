/**
 * useDebounce.js
 *
 * Returns a debounced copy of `value` that only updates after
 * `delay` milliseconds have elapsed since the last change.
 *
 * Classic use-case: prevent an API call on every keystroke.
 *
 * @example
 *   const debouncedQuery = useDebounce(searchInput, 400);
 *   // debouncedQuery trails searchInput by 400 ms
 */

import { useState, useEffect } from 'react';

/**
 * @param {any}    value  The value to debounce
 * @param {number} delay  Milliseconds to wait (default 400)
 * @returns {any}         The debounced value
 */
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after `delay` ms
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    // Cleanup: cancel the timer if value or delay changes before it fires.
    // This is the key mechanism — every new keystroke resets the clock.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
