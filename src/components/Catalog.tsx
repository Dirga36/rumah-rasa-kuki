import { useState } from "react";
import type { Category, Product } from "@/lib/catalog.functions";
import { ProductCard } from "@/components/ProductCard";

export function Catalog({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [active, setActive] = useState<string>("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category_id === active);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <FilterChip label="Semua" selected={active === "all"} onClick={() => setActive("all")} />
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            selected={active === cat.id}
            onClick={() => setActive(cat.id)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada varian di kategori ini.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );
}
