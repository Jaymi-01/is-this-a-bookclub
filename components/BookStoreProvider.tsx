"use client";

import { useEffect } from "react";
import { useBookStore } from "@/lib/store";

export function BookStoreProvider({ children }: { children: React.ReactNode }) {
  const init = useBookStore((state) => state.init);

  useEffect(() => {
    const unsub = init();
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [init]);

  return <>{children}</>;
}
