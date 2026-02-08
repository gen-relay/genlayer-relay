import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Layout } from "./Layout";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>
);
