/**
 * Retry an async auth operation with exponential backoff and timeout.
 * Used to harden Supabase auth calls against transient network/server failures.
 */

const DEFAULT_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 10_000;

export class AuthTimeoutError extends Error {
  constructor(message = "Request timed out. Please check your connection and try again.") {
    super(message);
    this.name = "AuthTimeoutError";
  }
}

export class AuthOfflineError extends Error {
  constructor(message = "You appear to be offline. Your request was queued and will retry when the connection is restored.") {
    super(message);
    this.name = "AuthOfflineError";
  }
}

function isRetryableError(err: any): boolean {
  if (!err) return false;
  const msg = (err?.message || "").toLowerCase();
  // Don't retry on credential / validation problems
  const nonRetryable = [
    "invalid login",
    "invalid credentials",
    "email not confirmed",
    "user already registered",
    "rate limit",
    "password should",
    "weak password",
    "signup disabled",
  ];
  if (nonRetryable.some((p) => msg.includes(p))) return false;
  // Retry network/timeouts/5xx style
  if (err instanceof AuthTimeoutError) return true;
  if (msg.includes("failed to fetch")) return true;
  if (msg.includes("network")) return true;
  if (msg.includes("timeout")) return true;
  if (msg.includes("fetch")) return true;
  if (err?.status && err.status >= 500) return true;
  return false;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new AuthTimeoutError()), ms);
    promise.then(
      (val) => {
        clearTimeout(id);
        resolve(val);
      },
      (err) => {
        clearTimeout(id);
        reject(err);
      },
    );
  });
}

export interface RetryOptions {
  attempts?: number;
  timeoutMs?: number;
  label?: string;
}

/**
 * Run an auth operation with retry + timeout.
 * The operation should return Supabase-style `{ data, error }` or throw.
 * If the returned `error` is retryable, this helper will retry.
 */
export async function runAuthWithRetry<T>(
  op: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const attempts = opts.attempts ?? DEFAULT_ATTEMPTS;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const label = opts.label ?? "auth";

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    console.warn(`[auth:${label}] offline, aborting before request`);
    throw new AuthOfflineError();
  }

  let lastError: any;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const t0 = performance.now();
    try {
      const result = await withTimeout(op(), timeoutMs);
      const dur = Math.round(performance.now() - t0);
      // Supabase returns { data, error } objects. Decide retry from error shape.
      const maybeErr = (result as any)?.error;
      if (maybeErr && isRetryableError(maybeErr) && attempt < attempts) {
        console.warn(
          `[auth:${label}] attempt ${attempt} failed (${dur}ms):`,
          maybeErr?.message || maybeErr,
        );
        lastError = maybeErr;
      } else {
        console.info(`[auth:${label}] attempt ${attempt} settled in ${dur}ms`);
        return result;
      }
    } catch (err: any) {
      const dur = Math.round(performance.now() - t0);
      lastError = err;
      console.warn(
        `[auth:${label}] attempt ${attempt} threw (${dur}ms):`,
        err?.message || err,
      );
      if (!isRetryableError(err) || attempt === attempts) {
        throw err;
      }
    }
    const backoff = Math.min(2000, 200 * 2 ** (attempt - 1));
    await new Promise((r) => setTimeout(r, backoff));
  }
  throw lastError ?? new Error("Authentication failed after multiple retries.");
}

/**
 * Friendly error message for any auth failure.
 */
export function friendlyAuthError(err: any): string {
  if (!err) return "Something went wrong. Please try again.";
  if (err instanceof AuthOfflineError) return err.message;
  if (err instanceof AuthTimeoutError) return err.message;
  const msg = (err?.message || String(err)).toLowerCase();
  if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
    return "Invalid email or password.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please verify your email before signing in. Check your inbox for the confirmation link.";
  }
  if (msg.includes("user already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (msg.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (msg.includes("password")) return err.message;
  if (msg.includes("failed to fetch") || msg.includes("network")) {
    return "Network error. Please check your internet connection and try again.";
  }
  if (msg.includes("timeout")) {
    return "The request took too long. Please try again.";
  }
  return err.message || "Something went wrong. Please try again.";
}

/**
 * Simple debounce helper for submit handlers.
 */
export function debounce<F extends (...args: any[]) => any>(fn: F, wait = 400) {
  let last = 0;
  let pending: any = null;
  return ((...args: Parameters<F>) => {
    const now = Date.now();
    if (now - last < wait) {
      return pending;
    }
    last = now;
    pending = fn(...args);
    return pending;
  }) as F;
}