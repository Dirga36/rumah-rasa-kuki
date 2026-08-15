import { Leaf, Star } from "lucide-react";
import type { Product } from "@/lib/catalog.functions";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/site-config";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, setOpen } = useCart();
  const stock = product.batch_stock ?? 0;
  const soldOut = stock <= 0;

  return (
    <article className="warm-card flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : null}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
            soldOut
              ? "bg-muted text-muted-foreground"
              : stock <= 5
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground"
          }`}
        >
          {soldOut ? "Batch habis" : `Sisa ${stock} toples`}
        </span>
        {product.is_best_seller ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            <Star className="h-3 w-3" /> Favorit
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg leading-snug font-bold">{product.name}</h3>
        {product.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {product.weight_gram ? <span>{product.weight_gram} gram</span> : null}
          {product.is_gluten_free ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-semibold text-foreground">
              <Leaf className="h-3 w-3" /> Gluten free
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-lg font-extrabold">{formatIDR(product.price)}</span>
          <Button
            size="sm"
            className="rounded-full"
            disabled={soldOut}
            onClick={() => {
              addItem({
                product_id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
              });
              toast.success(`${product.name} masuk keranjang`);
              setOpen(true);
            }}
          >
            {soldOut ? "Habis" : "Tambah"}
          </Button>
        </div>
      </div>
    </article>
  );
}
