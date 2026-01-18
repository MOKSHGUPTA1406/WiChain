
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

import { ThemeProvider } from "./app/components/ThemeProvider";
import { PersonalizationProvider } from "./app/context/PersonalizationContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <PersonalizationProvider>
      <App />
    </PersonalizationProvider>
  </ThemeProvider>
);
