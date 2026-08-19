import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import App from "@/App";
import { AuthGate } from "@/components/AuthGate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "داشبورد مدیریت قراردادهای سرویس" },
      {
        name: "description",
        content:
          "مدیریت قراردادهای سرویس و نگهداری: برنامه سرویس ماهانه، پرداخت‌ها، خرابی‌ها، قطعات و پشتیبان‌گیری ابری.",
      },
      { property: "og:title", content: "داشبورد مدیریت قراردادهای سرویس" },
      {
        property: "og:description",
        content: "برنامه سرویس ماهانه، پرداخت‌ها، خرابی‌ها و قطعات در یک داشبورد یکپارچه.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background" />}>
      <AuthGate>
        <App />
      </AuthGate>
    </ClientOnly>
  );
}
