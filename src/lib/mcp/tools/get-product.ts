import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_product",
  title: "Get a cookie product",
  description: "Get details of one active product by its slug.",
  inputSchema: { slug: z.string().trim().min(1).describe("Product slug.") },
  outputSchema: { product: z.record(z.string(), z.unknown()) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }) => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, description, price, weight_gram, batch_stock, image_url, is_gluten_free, is_best_seller",
      )
      .eq("is_active", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data)
      return { content: [{ type: "text", text: `No active product with slug "${slug}".` }], isError: true };

    const product = { ...data, price: Number(data.price) };
    return {
      content: [{ type: "text", text: JSON.stringify(product) }],
      structuredContent: { product },
    };
  },
});
