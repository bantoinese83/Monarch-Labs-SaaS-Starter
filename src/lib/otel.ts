import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'
import { BasicTracerProvider } from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

export function initTracing() {
  if (process.env.NODE_ENV === 'development') return
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR)
  const provider = new BasicTracerProvider()
  let headers: Record<string, string> | undefined
  try {
    headers = process.env.OTEL_EXPORTER_OTLP_HEADERS
      ? (JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) as Record<string, string>)
      : undefined
  } catch {
    headers = undefined
  }
  const exporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    headers,
  })

  provider.addSpanProcessor({
    onStart() {},
    onEnd() {},
    shutdown() {
      return Promise.resolve()
    },
    forceFlush() {
      return Promise.resolve()
    },
  })

  // In a full setup, register provider and add BatchSpanProcessor(exporter)
  void exporter
  // This file is a scaffold; expand as needed.
}
