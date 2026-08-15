import { useState } from "react";
import { MessageCircleHeart, Send, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askCaregiver } from "@/lib/chat.functions";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Halo, saya Mimin Caregiver Rasa Rumah 👋 Mau kue untuk santai sore, hadiah, atau yang gluten free? Saya bantu pilihkan ya.",
};

export function CaregiverChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = useServerFn(askCaregiver);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const result = await ask({
        data: { messages: next.slice(1).map((m) => ({ role: m.role, content: m.content })) },
      });
      setMessages([...next, { role: "assistant", content: result.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Maaf, koneksi Mimin terputus. Coba kirim lagi ya." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[26rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-warm)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-extrabold">Mimin Caregiver</p>
              <p className="text-xs text-muted-foreground">Siap bantu pilih kue</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Tutup obrolan"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="w-fit rounded-2xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                Mimin sedang mengetik...
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaanmu..."
              className="rounded-full bg-background"
            />
            <Button
              type="submit"
              size="icon"
              className="shrink-0 rounded-full"
              aria-label="Kirim pesan"
              disabled={loading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      <Button
        size="icon"
        className="fixed bottom-6 right-4 z-50 h-14 w-14 rounded-full shadow-[var(--shadow-warm)]"
        aria-label={open ? "Tutup obrolan Mimin" : "Buka obrolan Mimin"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircleHeart className="h-6 w-6" />}
      </Button>
    </>
  );
}
