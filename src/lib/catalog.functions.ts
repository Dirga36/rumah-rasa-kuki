import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  weight_gram: number | null;
  batch_stock: number | null;
  image_url: string | null;
  is_gluten_free: boolean | null;
  is_best_seller: boolean | null;
};

export const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );

  const [{ data: categories, error: catError }, { data: products, error: prodError }] =
    await Promise.all([
      supabase.from("categories").select("id, name, slug, description").order("name"),
      supabase
        .from("products")
        .select(
          "id, category_id, name, slug, description, price, weight_gram, batch_stock, image_url, is_gluten_free, is_best_seller",
        )
        .eq("is_active", true)
        .order("created_at"),
    ]);

  if (catError) throw new Error(catError.message);
  if (prodError) throw new Error(prodError.message);

  return {
    categories: (categories ?? []) as Category[],
    products: ((products ?? []) as Product[]).map((p) => ({ ...p, price: Number(p.price) })),
  };
});
