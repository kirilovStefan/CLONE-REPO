"use client";

import { useMemo, useState } from "react";
import { useCalendar } from "@/lib/calendar-context";
import { useT } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency-context";
import { generateMockBarcode } from "@/lib/inventory-store";
import type { Product } from "@/lib/mock-data";

type StockLevel = "out" | "critical" | "low" | "healthy";

function stockLevel(p: Product): StockLevel {
  if (p.stockQty <= 0) return "out";
  if (p.stockQty <= p.lowStockThreshold) return "critical";
  if (p.stockQty <= p.lowStockThreshold * 2) return "low";
  return "healthy";
}

const LEVEL_CLASSES: Record<
  StockLevel,
  { ring: string; bg: string; text: string; labelKey: string }
> = {
  out: {
    ring: "ring-rose-500/70",
    bg: "bg-rose-500/15",
    text: "text-rose-300",
    labelKey: "inventory.outOfStock",
  },
  critical: {
    ring: "ring-rose-500/60",
    bg: "bg-rose-500/10",
    text: "text-rose-300",
    labelKey: "inventory.critical",
  },
  low: {
    ring: "ring-amber-500/50",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    labelKey: "inventory.low",
  },
  healthy: {
    ring: "ring-emerald-500/40",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    labelKey: "inventory.healthy",
  },
};

export default function InventoryPage() {
  const { products, addProduct, updateProduct, removeProduct } = useCalendar();
  const { t } = useT();

  const [query, setQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState<null | { barcode?: string }>(null);
  const [scanning, setScanning] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.barcode ?? "").includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesLow =
        !lowStockOnly || p.stockQty <= p.lowStockThreshold;
      return matchesQuery && matchesLow;
    });
  }, [products, query, lowStockOnly]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      // out/critical first
      const la = stockLevel(a);
      const lb = stockLevel(b);
      const order = { out: 0, critical: 1, low: 2, healthy: 3 } as const;
      if (order[la] !== order[lb]) return order[la] - order[lb];
      return a.name.localeCompare(b.name);
    });
  }, [filtered]);

  const lowStockCount = products.filter(
    (p) => p.stockQty <= p.lowStockThreshold
  ).length;

  function handleScan() {
    setScanning(true);
    setTimeout(() => {
      const barcode = generateMockBarcode();
      setScanning(false);
      setCreating({ barcode });
    }, 700);
  }

  function handleSave(input: Omit<Product, "id">) {
    if (editing) {
      updateProduct(editing.id, input);
      setEditing(null);
    } else {
      addProduct(input);
      setCreating(null);
    }
  }

  function handleDelete(product: Product) {
    if (window.confirm(t("inventory.deleteConfirm", { name: product.name }))) {
      removeProduct(product.id);
    }
  }

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">
            {t("inventory.title")}
          </h1>
          <p className="mt-1 text-sm text-bone-dim">
            {t("inventory.subtitle")} ·{" "}
            {t("inventory.productsCount", { count: products.length })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleScan}
            disabled={scanning}
            className="rounded-lg border border-ink-muted bg-ink-soft px-4 py-2 text-sm text-bone transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {scanning ? t("inventory.scanning") : t("inventory.scanBarcode")}
          </button>
          <button
            type="button"
            onClick={() => setCreating({})}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover"
          >
            {t("inventory.addProduct")}
          </button>
        </div>
      </header>

      {lowStockCount > 0 && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {t("inventory.lowStockBanner", { count: lowStockCount })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("inventory.searchPlaceholder")}
          className="min-w-0 flex-1 rounded-lg border border-ink-muted bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
        />
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-ink-muted bg-ink-soft px-3 py-2 text-sm text-bone-dim transition hover:border-accent hover:text-bone">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-accent"
          />
          {t("inventory.filterLowStock")}
        </label>
      </div>

      {sorted.length === 0 ? (
        <p className="mt-10 text-center text-sm text-bone-dim">
          {query || lowStockOnly ? t("inventory.noMatch") : t("inventory.empty")}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {sorted.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onEdit={() => setEditing(p)}
              onDelete={() => handleDelete(p)}
            />
          ))}
        </ul>
      )}

      {(creating || editing) && (
        <ProductFormModal
          initial={editing ?? (creating?.barcode ? { barcode: creating.barcode } : undefined)}
          isEdit={!!editing}
          onClose={() => {
            setCreating(null);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </main>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useT();
  const { format } = useCurrency();
  const level = stockLevel(product);
  const lc = LEVEL_CLASSES[level];
  const profit = product.price - (product.costPrice ?? 0);

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-ink-muted bg-ink-soft p-4">
      <div
        className={`grid w-20 shrink-0 place-items-center rounded-xl px-3 py-2 ring-1 ${lc.bg} ${lc.ring}`}
      >
        <span className={`font-display text-2xl font-bold ${lc.text}`}>
          {product.stockQty}
        </span>
        <span className={`text-[10px] ${lc.text}`}>
          {t("inventory.stockUnit")}
        </span>
        <span className={`mt-1 text-[9px] uppercase tracking-wider ${lc.text}`}>
          {t(lc.labelKey as Parameters<typeof t>[0])}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-bone">{product.name}</p>
        <p className="truncate text-[11px] text-bone-dim">
          {product.brand} · {product.category}
          {product.barcode && ` · ${product.barcode}`}
        </p>
      </div>

      <div className="text-right">
        <p className="font-display text-base">
          <span className="text-bone-dim/60">{format(product.costPrice ?? 0, false)} →</span>{" "}
          <span className="text-accent">{format(product.price)}</span>
        </p>
        <p className="text-[10px] text-bone-dim">
          {t("inventory.profit")}: {format(profit, false)} ·{" "}
          {t("inventory.commission")} {product.commissionPct}%
        </p>
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-accent hover:text-bone"
        >
          {t("inventory.edit")}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-rose-400 hover:text-rose-300"
          aria-label={t("inventory.delete")}
        >
          ✗
        </button>
      </div>
    </li>
  );
}

function ProductFormModal({
  initial,
  isEdit,
  onClose,
  onSave,
}: {
  initial?: Partial<Product>;
  isEdit: boolean;
  onClose: () => void;
  onSave: (input: Omit<Product, "id">) => void;
}) {
  const { t } = useT();
  const { format, currency } = useCurrency();
  const [name, setName] = useState(initial?.name ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [barcode, setBarcode] = useState(initial?.barcode ?? "");
  const [costPrice, setCostPrice] = useState<string>(
    initial?.costPrice !== undefined ? String(initial.costPrice) : ""
  );
  const [price, setPrice] = useState<string>(
    initial?.price !== undefined ? String(initial.price) : ""
  );
  const [commissionPct, setCommissionPct] = useState<string>(
    initial?.commissionPct !== undefined ? String(initial.commissionPct) : "10"
  );
  const [stockQty, setStockQty] = useState<string>(
    initial?.stockQty !== undefined ? String(initial.stockQty) : "0"
  );
  const [lowStockThreshold, setLowStockThreshold] = useState<string>(
    initial?.lowStockThreshold !== undefined
      ? String(initial.lowStockThreshold)
      : "3"
  );

  const wasScanned = !isEdit && !!initial?.barcode;

  const costNum = Number(costPrice) || 0;
  const priceNum = Number(price) || 0;
  const profit = (priceNum - costNum).toFixed(2);

  const canSave =
    name.trim() &&
    brand.trim() &&
    !isNaN(Number(costPrice)) &&
    !isNaN(Number(price)) &&
    Number(price) > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim() || "—",
      barcode: barcode.trim() || undefined,
      costPrice: Number(costPrice) || 0,
      price: Number(price),
      commissionPct: Math.max(0, Math.min(100, Number(commissionPct) || 0)),
      stockQty: Math.max(0, Math.floor(Number(stockQty) || 0)),
      lowStockThreshold: Math.max(
        0,
        Math.floor(Number(lowStockThreshold) || 0)
      ),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl">
            {isEdit ? t("productForm.titleEdit") : t("productForm.titleNew")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-bone-dim transition hover:bg-ink-muted hover:text-bone"
          >
            ✕
          </button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-widest text-bone-dim">
              {t("productForm.barcode")}
              {wasScanned && (
                <span className="ml-2 text-emerald-400">
                  {t("productForm.scanned")}
                </span>
              )}
            </label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder={t("productForm.barcodePlaceholder")}
              className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-2.5 text-sm font-mono text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("productForm.name")}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("productForm.namePlaceholder")}
                className="input"
                required
                autoFocus
              />
            </Field>
            <Field label={t("productForm.brand")}>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={t("productForm.brandPlaceholder")}
                className="input"
                required
              />
            </Field>
          </div>

          <Field label={t("productForm.category")}>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("productForm.categoryPlaceholder")}
              className="input"
            />
          </Field>

          <div className="rounded-xl border border-ink-muted bg-ink/30 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("productForm.costPrice")}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="0"
                  className="input"
                  required
                />
              </Field>
              <Field label={t("productForm.retailPrice")}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="input"
                  required
                />
              </Field>
            </div>
            {priceNum > 0 && (
              <p className="mt-2 text-[11px] text-emerald-400">
                {t("productForm.markup", {
                  amount: format(Number(profit), false),
                  currency: "",
                })}
              </p>
            )}
          </div>

          <Field label={t("productForm.commissionPct")}>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={commissionPct}
              onChange={(e) => setCommissionPct(e.target.value)}
              className="input"
            />
            <p className="mt-1 text-[10px] text-bone-dim">
              {t("productForm.commissionHelp")}
            </p>
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("productForm.stockQty")}>
              <input
                type="number"
                step="1"
                min="0"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className="input"
                required
              />
            </Field>
            <Field label={t("productForm.lowStockThreshold")}>
              <input
                type="number"
                step="1"
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
            >
              {t("productForm.cancel")}
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("productForm.save")}
            </button>
          </div>
        </form>

        <style jsx>{`
          :global(.input) {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid rgb(42 42 48);
            background: rgb(11 11 13);
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
            color: rgb(245 239 230);
            outline: none;
            transition: border-color 0.15s;
          }
          :global(.input:focus) {
            border-color: rgb(201 163 106);
          }
          :global(.input::placeholder) {
            color: rgba(207 198 184 / 0.5);
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-bone-dim">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
