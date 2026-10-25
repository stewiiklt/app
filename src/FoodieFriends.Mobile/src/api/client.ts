export interface ApiClientConfig {
  /** Absolute API origin, for example http://10.0.2.2:5000. */
  baseUrl: string;
  timeoutMs?: number;
  /** Demo-only API identity. The server currently treats this header as impersonation. */
  demoUserId?: string;
  /** Must be explicitly true to send demoUserId; never configure in a release build. */
  allowDemoIdentity?: boolean;
  getAccessToken?: () => Promise<string | null>;
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: "NETWORK" | "TIMEOUT" | "HTTP" | "INVALID_RESPONSE";
  readonly details: unknown;

  constructor(
    message: string,
    code: ApiError["code"],
    status: number | null = null,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(private readonly config: ApiClientConfig) {
    const normalized = config.baseUrl.trim().replace(/\/+$/, "");
    if (!normalized) {
      throw new Error("FoodieFriends API baseUrl is required.");
    }
    if (!/^https?:\/\//i.test(normalized)) {
      throw new Error("FoodieFriends API baseUrl must be an absolute HTTP(S) URL.");
    }
    if (config.demoUserId && config.allowDemoIdentity !== true) {
      throw new Error("demoUserId requires allowDemoIdentity: true and is for local prototype builds only.");
    }

    this.baseUrl = normalized;
    this.timeoutMs = config.timeoutMs ?? 15_000;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = new Headers(init.headers);
    if (init.body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");

    if (this.config.demoUserId && this.config.allowDemoIdentity === true) {
      headers.set("X-User-Id", this.config.demoUserId);
    }
    const token = await this.config.getAccessToken?.();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    try {
      const response = await fetch(url, { ...init, headers, signal: controller.signal });
      const raw = response.status === 204 ? "" : await response.text();
      let payload: unknown;
      if (raw) {
        try {
          payload = JSON.parse(raw);
        } catch {
          payload = raw;
        }
      }

      if (!response.ok) {
        throw new ApiError(
          errorMessage(payload, response.status, response.statusText),
          "HTTP",
          response.status,
          payload,
        );
      }
      if (response.status === 204 || payload === undefined) return undefined as T;
      return payload as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (controller.signal.aborted) {
        throw new ApiError(`Request timed out after ${this.timeoutMs} ms.`, "TIMEOUT");
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Could not reach the FoodieFriends API.",
        "NETWORK",
        null,
        error,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}

function errorMessage(payload: unknown, status: number, statusText: string): string {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload === "object") {
    const value = payload as Record<string, unknown>;
    for (const key of ["message", "title", "detail", "error"]) {
      if (typeof value[key] === "string" && value[key]) return value[key] as string;
    }
  }
  return `FoodieFriends API returned ${status}${statusText ? ` ${statusText}` : ""}.`;
}

export function queryString(values: Record<string, string | number | boolean | null | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
