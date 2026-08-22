import { defineMcp } from "@lovable.dev/mcp-js";
import listCategoriesTool from "./tools/list-categories";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";

export default defineMcp({
  name: "rasa-rumah-e-commerce",
  title: "Rasa Rumah E-Commerce",
  version: "0.1.0",
  instructions:
    "Public catalog tools for Rasa Rumah Cookies, an Indonesian home-baked cookie shop. Use `list_categories` and `list_products` to browse variants (price in IDR, remaining batch stock, gluten-free and best-seller flags), and `get_product` for one variant by slug. Ordering happens on the website via WhatsApp checkout.",
  tools: [listCategoriesTool, listProductsTool, getProductTool],
});
