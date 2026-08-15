import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Cookie, Gift, HandHeart, Sparkles } from "lucide-react";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { Catalog } from "@/components/Catalog";
import { HampersBuilder } from "@/components/HampersBuilder";
import { Button } from "@/components/ui/button";
import { BRAND_NAME, HAMPERS_HASHTAG } from "@/lib/site-config";
import logo from "@/assets/rr-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rasa Rumah Cookies — Kue Kering Rumahan Premium" },
      {
        name: "description",
        content:
          "Kue kering premium buatan tangan, dipanggang segar tanpa pengawet. Pesan fresh batch dan rakit hampers custom dari Rasa Rumah Cookies.",
      },
      { property: "og:title", content: "Rasa Rumah Cookies — Kue Kering Rumahan Premium" },
      {
        property: "og:description",
        content: "Nikmati kehangatan 'Rasa Rumah' di setiap gigitan. Fresh batch, tanpa pengawet.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  component: Index,
  errorComponent: ({ error }) => (
    <p role="alert" className="mx-auto max-w-6xl px-4 py-16 text-center">
      Halaman gagal dimuat: {error.message}
    </p>
  ),
  notFoundComponent: () => <p className="px-4 py-16 text-center">Halaman tidak ditemukan.</p>,
});

const values = [
  { icon: HandHeart, title: "Dibuat penuh perhatian", text: "Resep rumahan, diaduk tangan." },
  { icon: Cookie, title: "Fresh batch", text: "Dipanggang setelah pesanan masuk." },
  { icon: Sparkles, title: "Tanpa pengawet", text: "Bahan jujur, rasa apa adanya." },
];

function Index() {
  const { data } = useSuspenseQuery(catalogQueryOptions);
  const featured = data.products.slice(0, 3);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Home bakery {HAMPERS_HASHTAG}
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold sm:text-5xl">
            Nikmati Kehangatan “Rasa Rumah” di Setiap Gigitan
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            Kue kering premium buatan tangan, dipanggang segar tanpa pengawet.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full" asChild>
              <a href="#katalog">Pesan Fresh Batch</a>
            </Button>
            <HampersBuilder
              products={data.products}
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-foreground/25 bg-card"
                >
                  <Gift className="mr-2 h-5 w-5" /> Rakit Hampers
                </Button>
              }
            />
          </div>
        </div>

        <div className="warm-card overflow-hidden p-4">
          <img
            src={logo.url}
            alt={`Logo ${BRAND_NAME}`}
            className="mx-auto h-28 w-auto object-contain"
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {featured.map((product) =>
              product.image_url ? (
                <img
                  key={product.id}
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              ) : null,
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="warm-card p-5">
              <value.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-3 text-lg font-bold">{value.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="katalog" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-extrabold">Katalog Kue Kering</h2>
            <p className="mt-1 text-muted-foreground">
              Stok per batch terbatas, dipanggang bergiliran setiap hari.
            </p>
          </div>
          <Link to="/katalog" className="text-sm font-bold text-primary underline-offset-4 hover:underline">
            Lihat semua varian
          </Link>
        </div>
        <Catalog categories={data.categories} products={data.products} />
      </section>
    </>
  );
}
