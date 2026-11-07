import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage accessibility for modals and dialog overlays:
 * - Listens for the `Escape` key to close the modal.
 * - Prevents background scrolling when modal is open.
 * - Restores focus to the element that triggered the modal upon closing.
 */
export function useModalA11y(isOpen: boolean, onClose: () => void) {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);
}
