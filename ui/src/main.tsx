import React from "react";
import ReactDOM from "react-dom/client";
import { PropertyCard } from "./components/PropertyCard";
import type { InternalProperty } from "./types";
import "./index.css";

const sample: InternalProperty = {
  fullAddress: "10 Example St, Carlton VIC 3053",
  lotPlan: { lot: "12", plan: "PS123456" },
  volumeFolio: { volume: null, folio: null },
  status: "UnknownVolFol",
  sourceTrace: { provider: "VIC-DDP", requestId: "REQ-12345" },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Test UI</h1>
      <PropertyCard initial={sample} />
    </div>
  </React.StrictMode>
);
