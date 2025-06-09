"use client";

import { usePathname } from "next/navigation";

export default function ClientVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  const shouldHide = pathname.startsWith("/set/") || pathname.startsWith("/user/");;

  if (shouldHide) return null;

  return <>{children}</>;
}