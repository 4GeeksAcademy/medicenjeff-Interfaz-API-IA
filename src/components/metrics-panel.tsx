"use client";

import type { SessionMetrics } from "@/lib/config";

interface MetricsPanelProps {
  metrics: SessionMetrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  // No mostrar el panel si aún no hay peticiones
  if (metrics.requestCount === 0) return null;

  return (
    <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {/* Tokens de prompt (acumulados) */}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
            <span>
              Prompt: <strong className="text-zinc-700 dark:text-zinc-300">{metrics.totalPromptTokens.toLocaleString()}</strong>
            </span>
          </span>

          {/* Tokens de completion (acumulados) */}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span>
              Completion: <strong className="text-zinc-700 dark:text-zinc-300">{metrics.totalCompletionTokens.toLocaleString()}</strong>
            </span>
          </span>

          {/* Total combinado (acumulado) */}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-400" />
            <span>
              Total: <strong className="text-zinc-700 dark:text-zinc-300">{metrics.totalTokens.toLocaleString()}</strong>
            </span>
          </span>

          {/* Separador */}
          <span className="hidden text-zinc-300 dark:text-zinc-600 sm:inline">|</span>

          {/* Modelo usado */}
          <span className="flex items-center gap-1.5">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {metrics.lastModel.split("/").pop()}
          </span>

          {/* Tiempo de respuesta de la última petición */}
          <span className="flex items-center gap-1.5">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {metrics.lastResponseTime.toFixed(2)}s
          </span>

          {/* Conteo de peticiones */}
          <span className="flex items-center gap-1.5">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {metrics.requestCount} {metrics.requestCount === 1 ? "request" : "requests"}
          </span>
        </div>
      </div>
    </div>
  );
}