import { useState } from "react";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/catalog.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatIDR, HAMPERS_HASHTAG } from "@/lib/site-config";
import { useCart } from "@/lib/cart";

const BOX_FEE = 25000;

export function HampersBuilder({
  products,
  trigger,
}: {
  products: Product[];
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [greeting, setGreeting] = useState("");
  const { addItem, setOpen: setCartOpen } = useCart();

  const available = products.filter((p) => (p.batch_stock ?? 0) > 0);
  const chosen = available.filter((p) => selected.includes(p.id));
  const total = chosen.reduce((sum, p) => sum + p.price, 0) + (chosen.length ? BOX_FEE : 0);
  const valid = selected.length >= 2 && selected.length <= 4;

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= 4
          ? (toast.info("Maksimal 4 jenis kue per boks hampers"), prev)
          : [...prev, id],
    );
  }

  function submit() {
    if (!valid) return;
    addItem({
      key: `hampers-${Date.now()}`,
      product_id: null,
      name: `Custom Hampers (${chosen.map((c) => c.name).join(", ")})`,
      price: total,
      image_url: chosen[0]?.image_url ?? null,
      hampers: {
        items: chosen.map((c) => c.name),
        greeting_card: greeting.trim() || undefined,
      },
    });
    toast.success("Hampers custom masuk keranjang");
    setSelected([]);
    setGreeting("");
    setOpen(false);
    setCartOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="rounded-full border-foreground/30 bg-card">
            <Gift className="mr-2 h-4 w-4" /> Rakit Hampers
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rakit Hampers {HAMPERS_HASHTAG}</DialogTitle>
          <DialogDescription>
            Pilih 2 sampai 4 jenis kue, lalu tulis pesan kartu ucapan untuk orang tersayang.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {available.map((product) => {
            const isSelected = selected.includes(product.id);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggle(product.id)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  isSelected ? "border-primary bg-secondary" : "border-border bg-card"
                }`}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{product.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {formatIDR(product.price)}
                  </span>
                </span>
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="greeting" className="text-sm font-semibold">
            Pesan kartu ucapan
          </label>
          <Textarea
            id="greeting"
            maxLength={500}
            rows={3}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Contoh: Selamat lebaran, semoga hangat selalu di rumah."
            className="rounded-2xl bg-card"
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold">
            {chosen.length ? `${chosen.length} kue • ${formatIDR(total)}` : "Belum ada pilihan"}
          </span>
          <Button className="rounded-full" disabled={!valid} onClick={submit}>
            Masukkan Keranjang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
