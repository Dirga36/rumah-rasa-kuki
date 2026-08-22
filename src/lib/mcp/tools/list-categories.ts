import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_categories",
  title: "List cookie categories",
  description: "List all product categories in the Rasa Rumah Cookies catalog.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description")
      .order("name");

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { categories: data ?? [] },
    };
  },
});
