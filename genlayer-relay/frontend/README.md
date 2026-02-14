# 🌐 GenLayer Relay – Frontend

Welcome to the user-facing layer of **GenLayer Relay**.

If the backend is the engine, this is the dashboard.  
If the backend is the oracle, this is the crystal ball UI.

This frontend provides a clean, structured interface for interacting with external data services designed to support **Intelligent Contracts** on GenLayer.

It transforms raw API responses into readable, understandable, and usable information.

---

# 🧠 What This Frontend Does

This application acts as a **visual interaction layer** for the GenLayer Relay backend.

It allows users to:

- 💱 View foreign exchange rates  
- ₿ View cryptocurrency pricing  
- 📈 View stock data  
- 🌦 Retrieve structured weather data  
- 🎲 Generate cryptographically secure randomness  
- 🔐 Sign messages  
- ✅ Verify signatures  

In short:

> It makes off-chain infrastructure visible, testable, and human-friendly.

---

# 🏗 Architectural Philosophy

This frontend was built with intentional separation of concerns and extensibility in mind.

## Core Principles

- **UI components are isolated**
- **API logic is separated from presentation**
- **Types are shared and explicit**
- **Error states are handled intentionally**
- **Loading states are never ignored**
- **Timestamps are human-readable**

The goal was not just to “fetch and render,”  
but to demonstrate clean integration patterns suitable for real-world GenLayer applications.

 
 # 🔄 Data Flow Design

 The frontend follows a clean data flow pattern:

 1. User interaction triggers a request
 2. Service layer calls backend endpoint
 3. Structured JSON is returned
 4. Types validate structure
 5. UI renders formatted response
 6. Errors and loading states are handled explicitly

 No silent failures.  
 No hidden assumptions.  
 No magic.

 ---

 # Backend Integration Pattern

 All external data comes from the GenLayer Relay backend.

 Example fetch structure:

 ```ts
 fetch("/api/fx?base=CAD&quote=USD")...

 ---

 ## *why This Matters for GenLayer*

   GenLayer introduces Intelligent Contracts that require structured interaction with external data.
   This frontend:
   Demonstrates practical consumption of external relay services
   Provides a UX layer for Intelligent Contract tooling
   Encourages modular and scalable infrastructure thinking
   Bridges developer experience and protocol capability
   It shows how off-chain infrastructure can be surfaced cleanly and responsibly.