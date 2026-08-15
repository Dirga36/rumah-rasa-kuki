import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Gift, HeartHandshake, PenLine } from "lucide-react";
import { catalogQueryOptions } from "@/lib/catalog-query";
import { HampersBuilder } from "@/components/HampersBuilder";
import { Button } from "@/components/ui/button";
import { HAMPERS_HASHTAG } from "@/lib/site-config";

export const Route = createFileRoute("/hampers")({
  head: () => ({
    meta: [
      { title: "Custom Hampers Kue Kering — Rasa Rumah Cookies" },
      {
        name: "description",
        content:
          "Rakit sendiri boks hampers berisi 2-4 varian kue kering favorit lengkap dengan kartu ucapan personal.",
      },
      { property: "og:title", content: "Custom Hampers — Rasa Rumah Cookies" },
      {
        property: "og:description",
        content: "Pilih 2-4 varian kue dan tulis pesan hangatmu di kartu ucapan.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  component: HampersPage,
  errorComponent: ({ error }) => (
    <p role="alert" className="mx-auto max-w-6xl px-4 py-16 text-center">
      Data hampers gagal dimuat: {error.message}
    </p>
  ),
  notFoundComponent: () => <p className="px-4 py-16 text-center">Halaman tidak ditemukan.</p>,
});

const steps = [
  { icon: Gift, title: "Pilih 2-4 varian", text: "Racik isi boks sesuai selera penerima." },
  { icon: PenLine, title: "Tulis kartu ucapan", text: "Pesan personal ditulis tangan oleh kami." },
  { icon: HeartHandshake, title: "Kirim kehangatan", text: "Dipanggang segar sebelum dikirim." },
];

function HampersPage() {
  const { data } = useSuspenseQuery(catalogQueryOptions);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-bold tracking-wide text-primary">{HAMPERS_HASHTAG}</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Custom Hampers Rasa Rumah</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Kirim kejutan hangat: boks hampers isi 2-4 varian kue kering pilihanmu, lengkap dengan kartu
        ucapan tulisan tangan.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="warm-card p-5">
            <step.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-lg font-bold">{step.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <HampersBuilder
          products={data.products}
          trigger={
            <Button size="lg" className="rounded-full">
              <Gift className="mr-2 h-5 w-5" /> Mulai Rakit Hampers
            </Button>
          }
        />
      </div>
    </section>
  );
}
