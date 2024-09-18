import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { StyleProvider } from "@ant-design/cssinjs";
import { ThemeProvider } from "@/components/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    {/* <React.StrictMode></React.StrictMode> */}
    <StyleProvider hashPriority="high">
      <ThemeProvider attribute="class" defaultTheme="system" storageKey="vite-ui-theme" enableSystem>
        <Toaster position="bottom-center" />
        <App />
      </ThemeProvider>
    </StyleProvider>
  </>
);
