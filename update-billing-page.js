const fs = require('fs');

let page = fs.readFileSync('app/app/billing/page.tsx', 'utf8');

if (!page.includes('isPaused')) {
  page = page.replace(
    /const isWarningStatus = .*?;/,
    `$&
  const isPaused = subscription?.status === 'paused';`
  );

  page = page.replace(
    /\{isWarningStatus && \(/,
    `{isPaused && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-amber-800 font-semibold">Subscription Paused</h3>
            <p className="text-amber-700 mt-1 text-sm">
              Your premium subscription is currently <strong>PAUSED</strong>. Your account limits have been temporarily restricted to the Free tier. If you wish to restore your premium features, please resume your subscription.
            </p>
          </div>
        </div>
      )}

      {isWarningStatus && !isPaused && (`
  );
  
  fs.writeFileSync('app/app/billing/page.tsx', page, 'utf8');
}
