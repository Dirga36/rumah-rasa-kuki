import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "List cookie products",
  description:
    "List active Rasa Rumah Cookies products with price, remaining batch stock and flags. Optionally filter by category slug, gluten-free or best seller.",
  inputSchema: {
    category_slug: z.string().trim().min(1).optional().describe("Category slug to filter by."),
    gluten_free: z.boolean().optional().describe("Only gluten-free variants."),
    best_seller: z.boolean().optional().describe("Only best sellers."),
    limit: z.number().int().min(1).max(50).optional().describe("Max products to return (default 20)."),
  },
  outputSchema: { products: z.array(z.record(z.string(), z.unknown())) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category_slug, gluten_free, best_seller, limit }) => {
    const supabase = supabaseAnon();

    let categoryId: string | undefined;
    if (category_slug) {
      const { data: category, error } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_slug)
        .maybeSingle();
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      if (!category)
        return {
          content: [{ type: "text", text: `No category with slug "${category_slug}".` }],
          isError: true,
        };
      categoryId = category.id;
    }

    let query = supabase
      .from("products")
      .select(
        "id, name, slug, description, price, weight_gram, batch_stock, image_url, is_gluten_free, is_best_seller",
      )
      .eq("is_active", true);

    if (categoryId) query = query.eq("category_id", categoryId);
    if (gluten_free !== undefined) query = query.eq("is_gluten_free", gluten_free);
    if (best_seller !== undefined) query = query.eq("is_best_seller", best_seller);

    const { data, error } = await query.order("created_at").limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const products = (data ?? []).map((p) => ({ ...p, price: Number(p.price) }));
    return {
      content: [{ type: "text", text: JSON.stringify(products) }],
      structuredContent: { products },
    };
  },
});
