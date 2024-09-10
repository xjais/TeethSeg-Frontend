import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { StyleProvider } from "@ant-design/cssinjs";

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        {/* <React.StrictMode></React.StrictMode> */}
        <StyleProvider hashPriority="high">
            <Toaster position="bottom-center" />
            <App />
        </StyleProvider>
    </>
);
