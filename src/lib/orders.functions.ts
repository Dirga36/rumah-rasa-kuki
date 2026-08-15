import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  product_id: z.string().uuid().nullable(),
  product_name: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  quantity: z.number().int().min(1).max(50),
  custom_hampers_details: z
    .object({
      items: z.array(z.string().max(200)).max(4),
      greeting_card: z.string().max(500).optional(),
    })
    .nullable()
    .optional(),
});

const orderSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: z.string().trim().min(6).max(30),
  delivery_address: z.string().trim().max(500).optional().default(""),
  custom_greeting_card: z.string().trim().max(500).optional().default(""),
  items: z.array(itemSchema).min(1).max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderNumber = `RR-${Date.now().toString(36).toUpperCase()}`;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        delivery_address: data.delivery_address || "-",
        custom_greeting_card: data.custom_greeting_card || null,
        total_amount: total,
        checkout_type: "WHATSAPP" as const,
        status: "PENDING" as const,
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) throw new Error(orderError?.message ?? "Gagal menyimpan pesanan");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      data.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        custom_hampers_details: item.custom_hampers_details ?? null,
      })),
    );

    if (itemsError) throw new Error(itemsError.message);

    return { orderNumber: order.order_number, total };
  });
