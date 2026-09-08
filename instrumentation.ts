import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');

    const exporter = new OTLPLogExporter({
      url: 'https://us.i.posthog.com/otlp/v1/logs',
      headers: {
        Authorization: 'Bearer phc_vYV4xfR2qhCuq927QyAfJygzHp3bBPsJNLmD5SDSJgHp',
      },
    })

    const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'invoiceflow-pro',
      }),
    })

    ;(loggerProvider as any).addLogRecordProcessor ? (loggerProvider as any).addLogRecordProcessor(new SimpleLogRecordProcessor(exporter as any)) : (loggerProvider as any).addProcessor(new SimpleLogRecordProcessor(exporter as any));

    // make the logger available globally
    ;(globalThis as any).__posthogLogger = loggerProvider.getLogger('invoiceflow-pro')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
