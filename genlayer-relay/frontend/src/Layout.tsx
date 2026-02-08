import type { ReactNode } from "react";
import "./index.css"; // global styles

export function Layout({ children }: { children: ReactNode }) {
  return <div className="layout-root">{children}</div>;
}
