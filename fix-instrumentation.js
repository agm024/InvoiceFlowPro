const fs = require('fs');
let code = fs.readFileSync('instrumentation.ts', 'utf8');

code = code.replace(/const loggerProvider = new LoggerProvider\(\{[\s\S]*?'service\.name': 'invoiceflow-pro',\s*\}\),\s*\}\)/, `const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'invoiceflow-pro',
      }),
      processors: [new SimpleLogRecordProcessor(exporter as any)],
    })`);

// Remove the old addLogRecordProcessor call
code = code.replace(/;\(loggerProvider as any\)\.addLogRecordProcessor[\s\S]*?;\(globalThis as any\)/, `;\(globalThis as any\)`);

fs.writeFileSync('instrumentation.ts', code, 'utf8');
