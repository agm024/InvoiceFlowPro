import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Validate required environment variables on startup
    const requiredEnvs = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXT_PUBLIC_SENTRY_DSN'];
    const missingEnvs = requiredEnvs.filter(env => !process.env[env]);
    if (missingEnvs.length > 0) {
      throw new Error('Missing required environment variables: ' + missingEnvs.join(', '));
    }

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
      processors: [new SimpleLogRecordProcessor(exporter as any)],
    })

    ;(globalThis as any).__posthogLogger = loggerProvider.getLogger('invoiceflow-pro')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
