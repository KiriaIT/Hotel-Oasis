import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

const app = (
    <React.StrictMode>
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.replace("/")}
        >
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);

ReactDOM.createRoot(root).render(app);
