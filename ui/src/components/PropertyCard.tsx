import React, { useState } from "react";
import Modal from "./Modal";
import type { InternalProperty } from "../types";

const volRegex = /^\d{1,6}$/;
const folRegex = /^\d{1,5}$/;

type Props = { initial: InternalProperty };

export function PropertyCard({ initial }: Props) {
  const [prop, setProp] = useState<InternalProperty>(initial);
  const [open, setOpen] = useState(false);
  const [vol, setVol] = useState<string>(initial.volumeFolio.volume ?? "");
  const [fol, setFol] = useState<string>(initial.volumeFolio.folio ?? "");
  const [errors, setErrors] = useState<{vol?: string; fol?: string}>({});

  const validate = () => {
    const e: {vol?: string; fol?: string} = {};
    if (vol.length > 0 && !volRegex.test(vol)) e.vol = "Volume must be 1–6 digits";
    if (fol.length > 0 && !folRegex.test(fol)) e.fol = "Folio must be 1–5 digits";
    if (prop.status === "UnknownVolFol" && (vol === "" || fol === "")) {
      if (vol === "") e.vol = e.vol ?? "Required";
      if (fol === "") e.fol = e.fol ?? "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onConfirm = () => {
    if (!validate()) return;
    const next: InternalProperty = {
      ...prop,
      volumeFolio: { volume: vol || null, folio: fol || null },
      status: vol && fol ? "KnownVolFol" : "UnknownVolFol",
    };
    setProp(next);
    setOpen(false);
  };

  const onOpen = () => {
    setVol(prop.volumeFolio.volume ?? "");
    setFol(prop.volumeFolio.folio ?? "");
    setErrors({});
    setOpen(true);
  };

  return (
    <div className="border rounded-md p-4 max-w-xl">
      <div className="text-sm text-gray-500">{prop.sourceTrace.provider} • {prop.sourceTrace.requestId}</div>
      <h3 className="text-xl font-semibold mt-1" data-testid="fullAddress">{prop.fullAddress}</h3>
      {prop.lotPlan && (
        <div className="mt-1 text-gray-700">Lot {prop.lotPlan.lot} / Plan {prop.lotPlan.plan}</div>
      )}
      <div className="mt-2">
        <span className="font-medium">Volume/Folio:</span>{" "}
        <span data-testid="vf-display">{prop.volumeFolio.volume ?? "—"}/{prop.volumeFolio.folio ?? "—"}</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${prop.status === "KnownVolFol" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {prop.status}
        </span>
      </div>
      <button className="mt-3 underline" onClick={onOpen} aria-haspopup="dialog">Edit volume/folio</button>

      <Modal title="Edit Volume/Folio" isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium" htmlFor="volume">Volume</label>
            <input id="volume" value={vol} onChange={e => setVol(e.target.value)} inputMode="numeric" pattern="\\d*" className="border rounded p-2 w-full" />
            {errors.vol && <p role="alert" className="text-red-600 text-sm">{errors.vol}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="folio">Folio</label>
            <input id="folio" value={fol} onChange={e => setFol(e.target.value)} inputMode="numeric" pattern="\\d*" className="border rounded p-2 w-full" />
            {errors.fol && <p role="alert" className="text-red-600 text-sm">{errors.fol}</p>}
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button onClick={() => setOpen(false)} className="border rounded px-3 py-1">Close</button>
            <button onClick={onConfirm} className="bg-blue-600 text-white rounded px-3 py-1">Confirm</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
