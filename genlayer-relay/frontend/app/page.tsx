// frontend/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { SignResponse, VerifyResponse } from "../lib/api";
import { api } from "../lib/api";

export default function HomePage() {
  const [prices, setPrices] = useState<any>({});
  const [weather, setWeather] = useState<any>({});
  const [random, setRandom] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [signature, setSignature] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);
  const [city, setCity] = useState("London");

  // Loading states per button
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  // ----------------- FETCH -----------------
  const fetchPrices = async () => {
    setLoadingPrices(true);
    const data = await api.getPrices("usd");
    setPrices(data);
    setLoadingPrices(false);
  };

  const fetchWeather = async () => {
    setLoadingWeather(true);
    const data = await api.getWeather(city);
    setWeather(data);
    setLoadingWeather(false);
  };

  const fetchRandom = async () => {
    setLoadingRandom(true);
    const data = await api.getRandom();
    setRandom(data);
    setLoadingRandom(false);
  };

  // ----------------- SIGN -----------------
  const handleSign = async () => {
    setLoadingSign(true);
    const res: SignResponse = await api.signMessage(message, secret);
    if (res && !res.error && res.signature) setSignature(res.signature);
    setLoadingSign(false);
  };

  // ----------------- VERIFY -----------------
  const handleVerify = async () => {
    setLoadingVerify(true);
    const res: VerifyResponse = await api.verifySignature(message, signature, secret);
    if (res) setVerifyResult(res);
    setLoadingVerify(false);
  };

  // ----------------- INITIAL FETCH -----------------
  useEffect(() => {
    fetchPrices();
    fetchWeather();
    fetchRandom();
  }, []);

  return (
    <div className="page-container">
      <h1>GenLayer Relay Dashboard</h1>

      <section>
        <h2>💰 Prices (USD)</h2>
        <button onClick={fetchPrices} disabled={loadingPrices}>
          {loadingPrices ? "Loading..." : "Refresh Prices"}
        </button>
        <pre>{JSON.stringify(prices, null, 2)}</pre>
      </section>

      <section>
        <h2>☀️ Weather</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <button onClick={fetchWeather} disabled={loadingWeather}>
          {loadingWeather ? "Loading..." : "Get Weather"}
        </button>
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      </section>

      <section>
        <h2>🎲 Randomness</h2>
        <button onClick={fetchRandom} disabled={loadingRandom}>
          {loadingRandom ? "Loading..." : "Get Random Value"}
        </button>
        <pre>{JSON.stringify(random, null, 2)}</pre>
      </section>

      <section>
        <h2>✍️ Sign & Verify Message</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Secret"
        />
        <button onClick={handleSign} disabled={loadingSign}>
          {loadingSign ? "Signing..." : "Sign Message"}
        </button>
        <pre>Signature: {signature || "Not signed yet"}</pre>

        <button onClick={handleVerify} disabled={loadingVerify}>
          {loadingVerify ? "Verifying..." : "Verify Signature"}
        </button>
        <pre>{verifyResult ? JSON.stringify(verifyResult, null, 2) : "Not verified yet"}</pre>
      </section>
    </div>
  );
}
