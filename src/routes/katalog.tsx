import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { Catalog } from "@/components/Catalog";

export const Route = createFileRoute("/katalog")({
  head: () => ({
    meta: [
      { title: "Katalog Kue Kering — Rasa Rumah Cookies" },
      {
        name: "description",
        content:
          "Lihat semua varian kue kering premium Rasa Rumah Cookies: nastar, kastengel, choco chip sea salt, hingga pilihan gluten free.",
      },
      { property: "og:title", content: "Katalog Kue Kering — Rasa Rumah Cookies" },
      {
        property: "og:description",
        content: "Varian kue kering buatan tangan, dipanggang segar per batch tanpa pengawet.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  component: KatalogPage,
  errorComponent: ({ error }) => (
    <p role="alert" className="mx-auto max-w-6xl px-4 py-16 text-center">
      Katalog gagal dimuat: {error.message}
    </p>
  ),
  notFoundComponent: () => <p className="px-4 py-16 text-center">Katalog belum tersedia.</p>,
});

function KatalogPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Katalog Fresh Batch</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Setiap toples dipanggang dalam batch kecil. Stok yang tertera adalah sisa batch yang sedang
        berjalan.
      </p>
      <div className="mt-8">
        <Catalog categories={data.categories} products={data.products} />
      </div>
    </section>
  );
}
