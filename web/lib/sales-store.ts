"use client";

import type { ProductSale } from "./mock-data";

const STORAGE_KEY = "barberos-product-sales";

export function loadSales(): ProductSale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ProductSale[];
  } catch {
    return [];
  }
}

export function saveSales(sales: ProductSale[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  } catch {
    // localStorage might be full or disabled — ignore
  }
}
