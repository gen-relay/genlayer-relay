import { useEffect, useState } from "react";
import type { SignResponse, PriceOptions } from "../lib/api";
import { api } from "../lib/api";
import { premiumApi } from "./premium/premiumApi";
import "./App.css";

function App() {
  const [price, setPrice] = useState<string>(""); 
  const [weather, setWeather] = useState<string>(""); 
  const [random, setRandom] = useState<string>(""); 
  const [message, setMessage] = useState(""); 
  const [secret, setSecret] = useState(""); 
  const [signature, setSignature] = useState(""); 
  const [verifyResult, setVerifyResult] = useState<string>(""); 
  const [premiumData, setPremiumData] = useState<string>(""); 
  const [priceOptions, setPriceOptions] = useState<PriceOptions | null>(null);
  const [crypto, setCrypto] = useState("bitcoin"); 
  const [fx, setFx] = useState("usd"); 
  const [stocks, setStocks] = useState("AAPL"); 

  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [city, setCity] = useState("London");

  useEffect(() => { fetchPriceOptions(); }, []);

  const fetchPriceOptions = async () => {
    const options = await api.getPriceOptions();
    setPriceOptions(options);
  };

  const fetchPrice = async () => {
    setLoadingPrices(true);
    const data = await api.getPrice(crypto, fx);
    if(data?.status==="ok" && data.data?.[crypto]?.[fx]) {
      setPrice(`${crypto.toUpperCase()}/${fx.toUpperCase()}: ${data.data[crypto][fx]}`);
    } else { setPrice("Price not available"); }
    setLoadingPrices(false);
  };

  const fetchWeather = async () => {
    setLoadingWeather(true);
    const data = await api.getWeather(city);
    if(data?.status==="ok" && data.data?.main) {
      const t = data.data.main.temp;
      const f = data.data.main.feels_like;
      const desc = data.data.weather?.[0]?.description || "";
      setWeather(`${city}: ${t}°C (feels like ${f}°C) - ${desc}`);
    } else { setWeather("Weather info not available"); }
    setLoadingWeather(false);
  };

  const fetchRandom = async () => {
    setLoadingRandom(true);
    const data = await api.getRandom();
    setRandom(data?.status==="ok" ? `${data.random}` : "Failed to fetch random");
    setLoadingRandom(false);
  };

  const handleSign = async () => {
    setLoadingSign(true);
    const res: SignResponse = await api.signMessage(message, secret);
    setSignature(res?.signature || "Signing failed");
    setLoadingSign(false);
  };

  const handleVerify = async () => {
    setLoadingVerify(true);
    const res = await api.verifySignature(message, signature, secret);
    setVerifyResult(res?.valid ? "✅ Signature valid" : "❌ Signature invalid");
    setLoadingVerify(false);
  };

  const fetchPremium = async () => {
    setLoadingPremium(true);
    try { const data = await premiumApi.getPremiumData(); setPremiumData(JSON.stringify(data)); }
    catch { setPremiumData("Failed to fetch premium data"); }
    setLoadingPremium(false);
  };

  return (
    <div className="app-wrapper">
      <div className="page-container">
        <h1>GenLayer Relay Dashboard</h1>

        {/* Prices */}
        <section>
          <h2>💰 Prices</h2>
          <div className="horizontal-controls">
            <select value={crypto} onChange={e=>setCrypto(e.target.value)}>
              {priceOptions?.crypto.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={fx} onChange={e=>setFx(e.target.value)}>
              {priceOptions?.fx.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
            <select value={stocks} onChange={e=>setStocks(e.target.value)}>
              {priceOptions?.stocks.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={fetchPrice} disabled={loadingPrices}>
              {loadingPrices?"Loading...":"Refresh Prices"}
            </button>
          </div>
          <div className="result-display">{price}</div>
        </section>

        {/* Weather */}
        <section>
          <h2>☀️ Weather</h2>
          <div className="horizontal-controls">
            <input type="text" value={city} onChange={e=>setCity(e.target.value)} placeholder="City"/>
            <button onClick={fetchWeather} disabled={loadingWeather}>
              {loadingWeather?"Loading...":"Get Weather"}
            </button>
          </div>
          <div className="result-display">{weather}</div>
        </section>

        {/* Random */}
        <section>
          <h2>🎲 Random</h2>
          <button onClick={fetchRandom} disabled={loadingRandom}>
            {loadingRandom?"Loading...":"Get Random"}
          </button>
          <div className="result-display">{random}</div>
        </section>

        {/* Sign & Verify */}
        <section>
          <h2>✍️ Sign & Verify</h2>
          <div className="horizontal-controls">
            <input type="text" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message"/>
            <input type="text" value={secret} onChange={e=>setSecret(e.target.value)} placeholder="Secret"/>
            <button onClick={handleSign} disabled={loadingSign}>
              {loadingSign?"Signing...":"Sign"}
            </button>
          </div>
          <div className="result-display">{signature}</div>
          <button onClick={handleVerify} disabled={loadingVerify}>
            {loadingVerify?"Verifying...":"Verify"}
          </button>
          <div className="result-display">{verifyResult}</div>
        </section>

        {/* Premium */}
        <section className="premium-section">
          <h2>💎 Premium</h2>
          <button onClick={fetchPremium} disabled={loadingPremium}>
            {loadingPremium?"Loading...":"Activate Premium"}
          </button>
          <div className="result-display">{premiumData}</div>
        </section>
      </div>
    </div>
  );
}

export default App;
