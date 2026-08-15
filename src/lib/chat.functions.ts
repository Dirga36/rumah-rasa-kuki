import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
});

export const askCaregiver = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { reply: "Maaf, Mimin sedang istirahat sebentar. Coba lagi nanti ya." };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah 'Mimin Caregiver' dari Rasa Rumah Cookies, UMKM kue kering rumahan. " +
              "Gaya bicara hangat, ramah, jujur, seperti tuan rumah yang menyambut tamu. Jawab singkat dalam Bahasa Indonesia. " +
              "Kamu boleh merekomendasikan varian seperti Nastar Spesial Pure Butter, Kastengel Roombutter Keju, Mini Choco Chip Sea Salt, " +
              "Uji Matcha Cheese Breakable, Earl Grey Lemon Zest Crunch, Oat Coconut Gluten-Free, dan Signature Hampers Trio Classic. " +
              "Jangan pernah mengarang alamat toko, nomor telepon, atau email.",
          },
          ...data.messages,
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`AI gateway error [${response.status}]: ${body}`);
      if (response.status === 429)
        return { reply: "Mimin lagi ramai banget nih, boleh coba tanya lagi sebentar lagi?" };
      return { reply: "Maaf, Mimin belum bisa menjawab sekarang. Coba lagi ya." };
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return {
      reply: json.choices?.[0]?.message?.content?.trim() ?? "Maaf, Mimin belum menemukan jawabannya.",
    };
  });
