import { useEffect } from 'react';

export const useLockBodyScroll = isLocked => {
  useEffect(() => {
    // Save the original overflow value to restore it later
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }

    // Cleanup: Restore the original overflow when the component
    // unmounts or isLocked becomes false
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
};
