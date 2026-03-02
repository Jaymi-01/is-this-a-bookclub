"use client";

import { useEffect } from "react";
import { useBookStore } from "@/lib/store";

export function BookStoreProvider({ children }: { children: React.ReactNode }) {
  const init = useBookStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
}
