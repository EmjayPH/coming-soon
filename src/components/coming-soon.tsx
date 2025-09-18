import React, { useEffect, useState } from "react";

// ComingSoonPage - single-file React component
// Tailwind CSS expected to be available in the project
// Usage: import ComingSoonPage from './coming-soon-react.jsx' and render <ComingSoonPage />

export default function ComingSoonPage({ launchDate = "2025-10-01T00:00:00", onSubscribe } ) {
  const target = new Date(launchDate).getTime();
  const [timeLeft, setTimeLeft] = useState(getDiff(target));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getDiff(target)), 1000);
    return () => clearInterval(t);
  }, [target]);

  function getDiff(to) {
    const now = Date.now();
    const diff = Math.max(0, to - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { diff, days, hours, minutes, seconds };
  }

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const handleSubscribe = async (ev) => {
    ev?.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      // If parent passed an onSubscribe prop, call it (can be used to POST to real API)
      if (onSubscribe) await onSubscribe(email);
      else await fakeSubscribe(email);

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-gray-900 via-slate-900 to-gray-800 text-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 grid gap-8 md:grid-cols-2 items-center">
        {/* Left: Brand / CTA */}
        <section className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">We&rsquo;re launching soon</h1>
            <p className="mt-2 text-lg text-gray-300">A better experience is on its way. Join the waitlist and be the first to know.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <form onSubmit={handleSubscribe} className="flex w-full gap-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-lg px-4 py-3 bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Email address"
              />
              <button
                type="submit"
                className={`rounded-lg px-4 py-3 font-semibold transition-shadow disabled:opacity-60 bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg`}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Joining..." : "Join the waitlist"}
              </button>
            </form>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {status === "success" && <p className="text-sm text-green-300">Thanks — we&rsquo;ll keep you posted!</p>}

          <div className="flex gap-4 items-center text-sm text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 4V5z" />
            </svg>
            <span>Need support? <a href="mailto:hello@bayanihanplus.com" className="underline">hello@bayanihanplus.com</a></span>
          </div>

          <div className="flex gap-4 mt-2">
            <a aria-label="Twitter" href="https://x.com/Bayanihan_Plus?fbclid=IwY2xjawM4vTpleHRuA2FlbQIxMABicmlkETF4TzF6cXZTMGZ1UE9pUndTAR5yoxsvTf4V9WfB2Ds6zkJeeR1RpUD57uAI_p29TNSS60jJj4sMix8kGUbSJg_aem_n_5UYX95Bc0A7GnKGNQBPw" className="hover:underline">Twitter</a>
            <a aria-label="Instagram" href="https://www.facebook.com/profile.php?id=61580028431138" className="hover:underline">Facebook</a>
            <a aria-label="LinkedIn" href="https://www.instagram.com/bayanihan_plus" className="hover:underline">Instagram</a>
            <a aria-label="LinkedIn" href="https://www.youtube.com/@BayanihanPlus" className="hover:underline">Youtube</a>
            <a aria-label="LinkedIn" href="https://www.tiktok.com/@bayanihan_plus" className="hover:underline">Youtube</a>

          </div>
        </section>

        {/* Right: Countdown + Illustration */}
        <aside className="flex flex-col items-center text-center">
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md">
              {renderUnit("Days", timeLeft.days)}
              {renderUnit("Hours", timeLeft.hours)}
              {renderUnit("Minutes", timeLeft.minutes)}
              {renderUnit("Seconds", timeLeft.seconds)}
            </div>

            <p className="mt-6 text-sm text-gray-300">Estimated launch date: <span className="font-medium text-gray-100">{new Date(launchDate).toLocaleString()}</span></p>

            <div className="mt-8 max-w-xs text-xs text-gray-400">
              <p>Subscribe and we&rsquo;ll notify you when we go live. No spam — unsubscribe anytime.</p>
            </div>
          </div>

          <div className="mt-8 w-full flex items-center justify-center">
            {/* Minimal illustrative SVG */}
            <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="8" y="30" width="144" height="72" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
              <circle cx="80" cy="66" r="18" fill="rgba(99,102,241,0.12)" />
              <path d="M60 44c8-8 32-8 40 0" stroke="rgba(99,102,241,0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </aside>
      </div>

      <footer className="absolute bottom-6 text-xs text-gray-500">© {new Date().getFullYear()} Your Company — Coming Soon</footer>
    </main>
  );
}

function renderUnit(label, value) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="bg-white/6 rounded-lg p-4 flex flex-col items-center">
      <div className="text-2xl font-semibold">{padded}</div>
      <div className="text-xs text-gray-300 mt-1">{label}</div>
    </div>
  );
}

// fakeSubscribe - placeholder for demo usage. Replace with a real API call.
function fakeSubscribe(email) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (email.endsWith("@example.com")) return rej(new Error("Disposable emails not allowed"));
      res({ ok: true });
    }, 900);
  });
}
