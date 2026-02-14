# 🌍 GenLayer Relay – Backend README.md

Welcome to the backend of **GenLayer Relay**.

This service is a modular external data relay designed to support **Intelligent Contracts** with structured, reliable, and verifiable off-chain information.

It provides:

- 💱 Foreign exchange rates  
- ₿ Cryptocurrency pricing  
- 🪙 Stablecoin normalization  
- 📈 Equity (stock) pricing  
- 🌦 Weather data  
- 🎲 Cryptographically secure randomness  
- 🔐 Message signing and verification  

In short:

> This backend is the bridge between off-chain APIs and on-chain logic.

---

# 🧠 What This Backend Does

Smart contracts cannot directly access:

- Live market prices  
- Weather APIs  
- Secure randomness  
- External cryptographic verification  

This backend handles those responsibilities in a clean, predictable, and extensible way.

Built using:

- **Fastify**
- **TypeScript**
- Modular route plugins
- Structured JSON responses

Each feature is isolated and designed for extensibility.

---

# 🏗 Architecture Overview

The backend follows a modular plugin-based structure:

src/ ├── prices modules (FX, crypto, stocks, stables) ├── weather.ts ├── randomness.ts ├── sign.ts └── verify.ts

Each module:

- Handles its own validation  
- Returns typed responses  
- Uses consistent timestamp formatting  
- Fails safely with clear error messages  

---

# 💱 Price Feeds

The backend supports **multi-asset pricing**.

## Foreign Exchange (FX)

- Live rates  
- Structured response  
- Human-readable ISO timestamps  

## Cryptocurrencies

- Market pricing integration  
- Normalized response format  

## Stablecoins

- Normalized values  
- Consistent formatting  

## Equities (Stocks)

- External API integration  
- Clean price relay structure  

 ## why This Matters for GenLayer
Intelligent Contracts require structured access to external information.
This backend provides:
Market data feeds
Weather oracle functionality
Cryptographic primitives
Secure signing and verification patterns
Extensible infrastructure
It is designed to act as a reusable service layer for GenLayer-based applications.