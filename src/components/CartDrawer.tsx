import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { formatIDR, WHATSAPP_NUMBER } from "@/lib/site-config";
import { createOrder } from "@/lib/orders.functions";

export function CartDrawer() {
  const { items, total, isOpen, setOpen, setQuantity, removeItem, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const submitOrder = useServerFn(createOrder);

  const mutation = useMutation({
    mutationFn: submitOrder,
    onSuccess: (result) => {
      const lines = [
        `Halo, saya mau pesan dari Rasa Rumah Cookies.`,
        `No. Pesanan: ${result.orderNumber}`,
        `Nama: ${name}`,
        `Telepon: ${phone}`,
        address ? `Alamat: ${address}` : null,
        "",
        "Rincian:",
        ...items.map(
          (i) =>
            `- ${i.name} x${i.quantity} = ${formatIDR(i.price * i.quantity)}${
              i.hampers?.greeting_card ? ` (Kartu ucapan: "${i.hampers.greeting_card}")` : ""
            }`,
        ),
        "",
        `Total: ${formatIDR(result.total)}`,
      ].filter(Boolean);
      const text = encodeURIComponent(lines.join("\n"));

      clear();
      setOpen(false);

      if (WHATSAPP_NUMBER) {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
      } else {
        toast.success(`Pesanan ${result.orderNumber} tersimpan`, {
          description: "Nomor WhatsApp toko belum diatur, jadi pesan otomatis belum bisa dikirim.",
        });
      }
    },
    onError: (error: Error) => toast.error("Checkout gagal", { description: error.message }),
  });

  function checkout() {
    if (name.trim().length < 2) {
      toast.error("Mohon isi nama lengkap");
      return;
    }
    if (phone.trim().length < 6) {
      toast.error("Mohon isi nomor telepon yang valid");
      return;
    }
    mutation.mutate({
      data: {
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        delivery_address: address.trim(),
        custom_greeting_card:
          items.find((i) => i.hampers?.greeting_card)?.hampers?.greeting_card ?? "",
        items: items.map((i) => ({
          product_id: i.product_id,
          product_name: i.name.slice(0, 200),
          price: i.price,
          quantity: i.quantity,
          custom_hampers_details: i.hampers ?? null,
        })),
      },
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Keranjang Belanja</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Keranjang masih kosong. Yuk pilih fresh batch favoritmu.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.key} className="warm-card flex gap-3 p-3">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{item.name}</p>
                    {item.hampers?.greeting_card ? (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        Kartu: “{item.hampers.greeting_card}”
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm font-semibold">{formatIDR(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        aria-label="Kurangi"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        aria-label="Tambah"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 rounded-full"
                        aria-label="Hapus item"
                        onClick={() => removeItem(item.key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-card p-4">
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Nama lengkap"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-2xl bg-background"
              />
              <Input
                placeholder="Nomor telepon (WhatsApp)"
                inputMode="tel"
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-2xl bg-background"
              />
              <Textarea
                placeholder="Alamat pengiriman (opsional)"
                rows={2}
                maxLength={500}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-2xl bg-background"
              />
              <div className="flex items-center justify-between text-base font-extrabold">
                <span>Total</span>
                <span>{formatIDR(total)}</span>
              </div>
              <Button
                className="w-full rounded-full"
                size="lg"
                disabled={mutation.isPending}
                onClick={checkout}
              >
                {mutation.isPending ? "Memproses..." : "Checkout via WhatsApp"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
