export async function verifyTurnstileToken(token: string | null | undefined, expectedAction: string) {
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Missing turnstile token' }
  }

  const secret = process.env.NODE_ENV === 'development' 
    ? '1x0000000000000000000000000000000AA' 
    : process.env.TURNSTILE_SECRET;
    
  if (!secret) {
    console.warn('TURNSTILE_SECRET is not configured, skipping validation.')
    return { success: true }
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret,
        response: token
      }),
    });

    if (!res.ok) {
      throw new Error(`siteverify returned ${res.status}`);
    }

    const result = await res.json();
    console.log('[Turnstile Verification Result]:', result);
    if (!result.success) {
      return { success: false, error: 'CAPTCHA verification failed' }
    }

    const isTesting = secret === '1x0000000000000000000000000000000AA';
    
    if (result.action && result.action !== expectedAction && !isTesting) {
      console.log(`Action mismatch: expected ${expectedAction}, got ${result.action}`);
      return { success: false, error: 'CAPTCHA action mismatch' }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Turnstile verification error:', err)
    return { success: false, error: 'CAPTCHA verification error' }
  }
}