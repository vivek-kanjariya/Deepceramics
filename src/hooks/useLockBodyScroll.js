import { useEffect } from "react";

export function useLockBodyScroll(lock = true) {
  useEffect(() => {
    if (lock) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lock]);
}