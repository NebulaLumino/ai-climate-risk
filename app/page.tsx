"use client";

import { useState } from "react";

const INPUTS_3872 = [
  { id: "location", label: "Location / Region", placeholder: "e.g., Miami, Florida, USA", type: "text" },
  { id: "industry", label: "Industry / Sector", placeholder: "e.g., Manufacturing, Agriculture, Finance", type: "text" },
  { id: "asset_type", label: "Asset / Facility Type", placeholder: "e.g., Coastal facility, Data center, Office", type: "text" },
  { id: "elevation", label: "Elevation Above Sea Level (m)", placeholder: "e.g., 5", type: "text" },
  { id: "coastal_distance", label: "Distance from Coastline (km)", placeholder: "e.g., 2", type: "text" },
  { id: "annual_rainfall", label: "Annual Rainfall (mm)", placeholder: "e.g., 1500", type: "text" },
  { id: "heat_days", label: "Days Above 35°C per Year", placeholder: "e.g., 20", type: "text" },
  { id: "nearest_waterbody", label: "Nearest Water Body", placeholder: "e.g., River, Ocean, Lake", type: "text" },
  { id: "infrastructure_age", label: "Infrastructure Age (years)", placeholder: "e.g., 25", type: "text" },
  { id: "insurance_status", label: "Insurance Status", placeholder: "e.g., Fully insured, Partial, None", type: "text" },
];

export default function ClimateRiskPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult("");
    const inputsStr = INPUTS_3872.map((f) => `${f.label}: ${form[f.id] || "Not provided"}`).join("\n");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: inputsStr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 flex flex-col">
      <header className="border-b border-sky-900/50 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-2xl">
            🏔️
          </div>
          <div>
            <h1 className="text-xl font-bold text-sky-400">AI Climate Risk Assessment</h1>
            <p className="text-xs text-gray-400">Evaluate climate risks and build resilience strategies</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid md:grid-cols-2 gap-8">
        <section>
          <div className="bg-gray-900/60 border border-sky-900/40 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-4">
              📋 Risk Assessment Parameters
            </h2>
            <div className="space-y-4">
              {INPUTS_3872.map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 font-medium" htmlFor={field.id}>
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="bg-gray-800/80 border border-sky-900/50 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/30 transition-all"
                  />
                </div>
              ))}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 disabled:text-sky-200 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-sky-900/30"
              >
                {loading ? "⏳ Assessing Risks..." : "🌡️ Generate Risk Assessment"}
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-gray-900/60 border border-sky-900/40 rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-wider mb-4">
              📊 Risk Report
            </h2>
            <div className="flex-1 overflow-auto">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                  ❌ {error}
                </div>
              )}
              {loading && !result && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm">Analyzing climate risks...</p>
                </div>
              )}
              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                  <span className="text-4xl mb-3">🗺️</span>
                  <p className="text-sm text-center">Fill in the parameters and click<br />&ldquo;Generate Risk Assessment&rdquo;</p>
                </div>
              )}
              {result && (
                <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-sky-900/30 px-6 py-4 text-center text-xs text-gray-600">
        Powered by DeepSeek AI · Cycle 127 Environmental AI
      </footer>
    </div>
  );
}
