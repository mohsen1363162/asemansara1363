import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// نقطه ورود نسخه تک‌فایلی (SPA): کل برنامه در یک فایل HTML جاسازی می‌شود
// تا بدون نیاز به سرور یا هاست، با باز کردن فایل در مرورگر اجرا شود.
const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
