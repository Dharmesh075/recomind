import type { ReactNode } from "react";
import { PRODUCTS } from "@/data/products";

/**
 * Pre-render every catalogue product page at build time.
 * Without this, the dynamic `[id]` segment is treated as runtime data by
 * Cache Components and blocks metadata prerendering.
 */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
