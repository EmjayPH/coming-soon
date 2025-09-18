import React, { useEffect, useState } from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import logo from "../assets/bayanihanlogo.png"; // Make sure you have your logo file in src/assets/

export default function ComingSoonPage({ launchDate = "2025-10-01T00:00:00", onSubscribe }) {
  const target = new Date(launchDate).getTime();
  const [timeLeft, setTimeLeft] = useState(getDiff(target));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-900 p-6">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-8 md:p-12 grid gap-8 md:grid-cols-2 items-center">
        {/* Left Section */}
        <section className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <img src={logo} alt="Company Logo" className="h-12 md:h-16 object-contain mb-4 animate-fadeIn" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-800">We&rsquo;re launching soon</h1>
            <p className="mt-2 text-lg text-gray-600">A better experience is on its way. Join the waitlist and be the first to know.</p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-lg px-4 py-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              className="rounded-lg px-4 py-3 font-semibold bg-indigo-500 text-white shadow-md hover:bg-indigo-600 transition disabled:opacity-60"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Joining..." : "Join the waitlist"}
            </button>
          </form>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {status === "success" && <p className="text-sm text-green-600">Thanks — we&rsquo;ll keep you posted!</p>}

          <div className="flex gap-4 mt-4">
            <a href="https://x.com/Bayanihan_Plus" className="text-gray-600 hover:text-indigo-500" aria-label="Twitter"><FaTwitter size={20} /></a>
            <a href="https://www.facebook.com/profile.php?id=61580028431138" className="text-gray-600 hover:text-indigo-500" aria-label="Facebook"><FaFacebookF size={20} /></a>
            <a href="https://www.instagram.com/bayanihan_plus" className="text-gray-600 hover:text-indigo-500" aria-label="Instagram"><FaInstagram size={20} /></a>
            <a href="https://www.youtube.com/@BayanihanPlus" className="text-gray-600 hover:text-indigo-500" aria-label="YouTube"><FaYoutube size={20} /></a>
            <a href="https://www.tiktok.com/@bayanihan_plus" className="text-gray-600 hover:text-indigo-500" aria-label="TikTok"><FaTiktok size={20} /></a>
          </div>
        </section>

        {/* Right Section */}
        <aside className="flex flex-col items-center text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md">
            {renderUnit("Days", timeLeft.days)}
            {renderUnit("Hours", timeLeft.hours)}
            {renderUnit("Minutes", timeLeft.minutes)}
            {renderUnit("Seconds", timeLeft.seconds)}
          </div>
          <p className="mt-6 text-sm text-gray-600">Estimated launch: <span className="font-medium text-gray-800">{new Date(launchDate).toLocaleString()}</span></p>
        </aside>
      </div>

      <footer className="absolute bottom-6 text-xs text-gray-500">© {new Date().getFullYear()} Bayanihan Plus — Coming Soon</footer>
    </main>
  );
}

function renderUnit(label, value) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center shadow-sm">
      <div className="text-2xl font-semibold text-gray-800">{padded}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function fakeSubscribe(email) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (email.endsWith("@example.com")) return rej(new Error("Disposable emails not allowed"));
      res({ ok: true });
    }, 900);
  });
}
