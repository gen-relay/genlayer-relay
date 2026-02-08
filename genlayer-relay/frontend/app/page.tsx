"use client";

import { useEffect, useState } from "react";
import { api, SignResponse, VerifyResponse } from "../lib/api";

export default function HomePage() {
  const [prices, setPrices] = useState<any>({});
  const [weather, setWeather] = useState<any>({});
  const [random, setRandom] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [signature, setSignature] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);
  const [city, setCity] = useState("London");

  // ----------------- FETCH -----------------
  const fetchPrices = async () => {
    const data = await api.getPrices("usd");
    setPrices(data);
  };

  const fetchWeather = async () => {
    const data = await api.getWeather(city);
    setWeather(data);
  };

  const fetchRandom = async () => {
    const data = await api.getRandom();
    setRandom(data);
  };

  // ----------------- SIGN -----------------
  const handleSign = async () => {
    const res: SignResponse = await api.signMessage(message, secret);
    if (res && !res.error && res.signature) setSignature(res.signature);
  };

  // ----------------- VERIFY -----------------
  const handleVerify = async () => {
    const res: VerifyResponse = await api.verifySignature(message, signature, secret);
    if (res) setVerifyResult(res);
  };

  useEffect(() => {
    fetchPrices();
    fetchWeather();
    fetchRandom();
  }, []);

  return (
    <div className="page-container">
      <h1>GenLayer Relay Dashboard</h1>

      <section>
        <h2>Prices (USD)</h2>
        <button onClick={fetchPrices}>Refresh Prices</button>
        <pre>{JSON.stringify(prices, null, 2)}</pre>
      </section>

      <section>
        <h2>Weather</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <button onClick={fetchWeather}>Get Weather</button>
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      </section>

      <section>
        <h2>Randomness</h2>
        <button onClick={fetchRandom}>Get Random Value</button>
        <pre>{JSON.stringify(random, null, 2)}</pre>
      </section>

      <section>
        <h2>Sign & Verify Message</h2>
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
        <button onClick={handleSign}>Sign Message</button>
        <pre>Signature: {signature || "Not signed yet"}</pre>

        <button onClick={handleVerify}>Verify Signature</button>
        <pre>{verifyResult ? JSON.stringify(verifyResult, null, 2) : "Not verified yet"}</pre>
      </section>
    </div>
  );
}
