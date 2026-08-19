import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const GUEST_KEY = 'service-app-guest-mode';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [guest, setGuest] = useState<boolean>(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let isGuest = false;
    try {
      isGuest = window.localStorage.getItem(GUEST_KEY) === '1';
    } catch {
      isGuest = false;
    }
    setGuest(isGuest);

    // در حالت مهمان اصلاً به Supabase وابسته نیستیم تا بدون اینترنت هم باز شود
    if (isGuest) {
      setReady(true);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => {
        /* اگر Supabase در دسترس نبود، همچنان صفحه ورود را نشان بده */
      })
      .finally(() => setReady(true));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const enterGuest = () => {
    try {
      window.localStorage.setItem(GUEST_KEY, '1');
    } catch {
      /* ignore */
    }
    setGuest(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage('ثبت‌نام انجام شد. اگر تأیید ایمیل فعال باشد، لینک تأیید برایتان ارسال شده است.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'خطا در ورود.');
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!session && !guest) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <form onSubmit={submit} className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-900">ورود به داشبورد قراردادها</h1>
            <p className="text-xs text-slate-500 mt-1">اطلاعات ابری شما فقط برای حساب خودتان قابل دسترسی است.</p>
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl py-2 text-sm font-semibold"
          >
            {mode === 'signin' ? 'ورود' : 'ثبت‌نام'}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="w-full text-xs text-slate-600 hover:text-slate-900"
          >
            {mode === 'signin' ? 'حساب ندارید؟ ثبت‌نام کنید' : 'حساب دارید؟ وارد شوید'}
          </button>
          <div className="flex items-center gap-2 pt-1">
            <span className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400">یا</span>
            <span className="flex-1 h-px bg-slate-200" />
          </div>
          <button
            type="button"
            onClick={enterGuest}
            className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl py-2 text-sm font-semibold"
          >
            ورود به عنوان مهمان (بدون ثبت‌نام)
          </button>
          <p className="text-[11px] text-slate-400 leading-5">
            در حالت مهمان اطلاعات شما فقط روی همین مرورگر ذخیره می‌شود و به فضای ابری منتقل نمی‌شود.
          </p>
          {message && <p className="text-xs text-rose-600 whitespace-pre-line">{message}</p>}
        </form>
      </div>
    );
  }

  return <>{children}</>;
};
