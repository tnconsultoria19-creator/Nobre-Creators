interface SqlResult {
  toArray(): Array<Record<string, unknown>>;
}
interface SqlStorage {
  exec(query: string, ...bindings: unknown[]): SqlResult;
}
interface DurableStateLike {
  storage: { sql: SqlStorage };
}
interface DurableNamespaceLike {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(request: Request): Promise<Response> };
}
interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success?: boolean;
  meta?: { changes?: number };
}
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}
interface D1DatabaseLike {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown[]>;
}
interface R2HttpMetadata { contentType?: string; contentDisposition?: string }
interface R2ObjectLike {
  body: ReadableStream<Uint8Array>;
  size: number;
  httpMetadata?: R2HttpMetadata;
}
interface R2BucketLike {
  put(key: string, body: ReadableStream<Uint8Array> | ArrayBuffer | string, options?: { httpMetadata?: R2HttpMetadata }): Promise<unknown>;
  get(key: string): Promise<R2ObjectLike | null>;
  delete(key: string): Promise<void>;
}
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: D1DatabaseLike;
  MEDIA?: R2BucketLike;
  STATE?: DurableNamespaceLike;
  PROXYPAY_MODE?: string;
  PROXYPAY_API_KEY?: string;
  PROXYPAY_OPG_TOKEN?: string;
  PROXYPAY_POS_ID?: string;
  PREMIUM_PRICE_AOA?: string;
  PAYMENT_CALLBACK_SECRET?: string;
  RESEND_API_KEY?: string;
  NEWSLETTER_FROM?: string;
  MAGAZINE_URL?: string;
  NEWSLETTER_ADMIN_TOKEN?: string;
}

type Role = "creator" | "brand" | "admin";
type UserRow = { id: string; email: string; display_name: string; role: Role; status: string };
type AssetRow = {
  id: string; owner_user_id: string; title: string; description: string; file_name: string;
  object_key: string; content_type: string; size_bytes: number; asset_type: string;
  visibility: string; created_at: string;
};
type InvoiceRow = {
  id: string; order_id: string; invoice_number: string; amount_aoa: number; status: string;
  due_date: string; payment_method: string; provider: string | null;
  provider_reference_id: string | null; provider_transaction_id: string | null;
  multicaixa_entity_id: string | null; multicaixa_reference_number: string | null;
};
type PaymentEvent = {
  id: string; amount: string; datetime: string; entity_id: string; reference_id: string;
  reference_number: string; terminal_id?: string; terminal_location?: string;
  terminal_transaction_id?: string; terminal_type?: string;
  custom_fields?: Record<string, string>;
};

const json = (data: unknown, status = 200, extraHeaders?: HeadersInit) => {
  const headers = new Headers(extraHeaders);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  return new Response(JSON.stringify(data), { status, headers });
};
const nowIso = () => new Date().toISOString();
const newId = () => crypto.randomUUID();
const asText = (value: FormDataEntryValue | null, max = 2000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const cleanFilename = (value: string) => value.replace(/[\\/\u0000-\u001f\u007f]/g, "_").replace(/\.\./g, "_").slice(0, 180) || "download";
const bytesToHex = (bytes: ArrayBuffer | Uint8Array) => Array.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
const hexToBytes = (hex: string) => new Uint8Array((hex.match(/.{1,2}/g) || []).map((part) => parseInt(part, 16)));
const randomToken = (length = 32) => {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};
const sha256Hex = async (value: string) => bytesToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
const publicUser = (user: UserRow) => ({ id: user.id, email: user.email, displayName: user.display_name, role: user.role });
const cookieValue = (request: Request, name: string) => {
  const cookie = request.headers.get("Cookie") || "";
  const value = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(name + "="));
  return value ? decodeURIComponent(value.slice(name.length + 1)) : "";
};
const authCookie = (token: string, request: Request, maxAge: number) => `nobre_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
const requireDb = (env: Env) => {
  if (!env.DB) throw new Error("D1_DATABASE_NOT_CONFIGURED");
  return env.DB;
};
const isSafeSameOrigin = (request: Request) => {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
};
const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "perfil";
const amountString = (value: number) => Number(value).toFixed(2);
const datePlusDays = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const result = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" }, key, 256);
  return `pbkdf2$${bytesToHex(salt)}$${bytesToHex(result)}`;
}
async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, saltHex, hashHex] = encoded.split("$");
  if (algorithm !== "pbkdf2" || !saltHex || !hashHex) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const candidate = bytesToHex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: hexToBytes(saltHex), iterations: 150000, hash: "SHA-256" }, key, 256));
  if (candidate.length !== hashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) diff |= candidate.charCodeAt(i) ^ hashHex.charCodeAt(i);
  return diff === 0;
}
async function getSession(request: Request, env: Env): Promise<UserRow | null> {
  if (!env.DB) return null;
  const token = cookieValue(request, "nobre_session");
  if (!token) return null;
  const id = await sha256Hex(token);
  const row = await env.DB.prepare(
    "SELECT u.id, u.email, u.display_name, u.role, u.status FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > ?",
  ).bind(id, nowIso()).first<UserRow>();
  return row?.status === "active" ? row : null;
}
async function createSession(user: UserRow, request: Request, env: Env): Promise<{ token: string; hash: string; expires: string }> {
  const token = randomToken();
  const hash = await sha256Hex(token);
  const expires = new Date(Date.now() + 30 * 86400000).toISOString();
  await requireDb(env).prepare("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(hash, user.id, expires, nowIso()).run();
  return { token, hash, expires };
}
async function requireUser(request: Request, env: Env, roles?: Role[]): Promise<{ user: UserRow | null; response?: Response }> {
  const user = await getSession(request, env);
  if (!user) return { user: null, response: json({ ok: false, error: "Entre na sua conta para continuar." }, 401) };
  if (roles && !roles.includes(user.role)) return { user: null, response: json({ ok: false, error: "A sua conta não tem permissão para esta acção." }, 403) };
  return { user };
}
const validMail = (value: string) => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const allowedContentTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm",
  "audio/mpeg", "audio/mp4", "audio/wav", "audio/ogg", "audio/webm",
  "application/pdf", "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

async function sendEmail(env: Env, to: string, subject: string, html: string): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.NEWSLETTER_FROM) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: env.NEWSLETTER_FROM, to: [to], subject, html }),
    });
    return response.ok;
  } catch { return false; }
}
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

async function createMulticaixaReference(env: Env, request: Request, invoice: InvoiceRow, orderNumber: string) {
  if (!env.PROXYPAY_API_KEY) return { status: "not_configured", method: "multicaixa_reference", message: "A referência Multicaixa será emitida quando a conta de comerciante ProxyPay estiver configurada." };
  const base = env.PROXYPAY_MODE === "production" ? "https://api.proxypay.co.ao" : "https://api.sandbox.proxypay.co.ao";
  const response = await fetch(`${base}/references`, {
    method: "POST",
    headers: {
      authorization: `Basic ${btoa(`api:${env.PROXYPAY_API_KEY}`)}`,
      accept: "application/vnd.proxypay.v1+json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ reference: {
      amount: amountString(invoice.amount_aoa),
      expiry_date: invoice.due_date,
      custom_fields: { invoice: invoice.invoice_number, order: orderNumber },
    } }),
  });
  const result = await response.json().catch(() => null) as { reference?: { id?: string; entity_id?: string; number?: string; status?: string } } | null;
  if (!response.ok || !result?.reference?.id || !result.reference.entity_id || !result.reference.number) {
    return { status: "provider_error", method: "multicaixa_reference", message: "O fornecedor não emitiu a referência. O pedido continua pendente; tente novamente ou contacte o suporte." };
  }
  await requireDb(env).prepare(
    "UPDATE invoices SET provider = 'proxypay-rps', provider_reference_id = ?, multicaixa_entity_id = ?, multicaixa_reference_number = ?, updated_at = ? WHERE id = ?",
  ).bind(result.reference.id, result.reference.entity_id, result.reference.number, nowIso(), invoice.id).run();
  return { status: "pending", method: "multicaixa_reference", entity: result.reference.entity_id, reference: result.reference.number, message: "Pague usando a Entidade e a Referência na aplicação Multicaixa Express ou num canal Multicaixa compatível." };
}

async function createMcxExpressPayment(env: Env, request: Request, invoice: InvoiceRow, orderNumber: string, mobile: string) {
  if (!env.PROXYPAY_OPG_TOKEN || !env.PROXYPAY_POS_ID || !env.PAYMENT_CALLBACK_SECRET) {
    return { status: "not_configured", method: "mcx_express", message: "O pedido MCX Express será activado quando o POS_ID e as credenciais do comerciante estiverem configurados." };
  }
  if (!/^\d{9,12}$/.test(mobile)) return { status: "invalid_mobile", method: "mcx_express", message: "Introduza o número de telemóvel registado no Multicaixa Express." };
  const callback = new URL("/api/payments/opg-callback", request.url);
  callback.searchParams.set("token", env.PAYMENT_CALLBACK_SECRET);
  const response = await fetch(`https://${env.PROXYPAY_MODE === "production" ? "api.proxypay.co.ao" : "api.sandbox.proxypay.co.ao"}/opg/v1/transactions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.PROXYPAY_OPG_TOKEN}`,
      "content-type": "application/json",
      "idempotency-key": invoice.order_id,
    },
    body: JSON.stringify({
      type: "payment",
      pos_id: Number(env.PROXYPAY_POS_ID),
      mobile,
      amount: amountString(invoice.amount_aoa),
      callback_url: callback.toString(),
    }),
  });
  const result = await response.json().catch(() => null) as { id?: string } | null;
  if (!response.ok || !result?.id) return { status: "provider_error", method: "mcx_express", message: "Não foi possível iniciar o pedido MCX Express. A factura mantém-se pendente." };
  await requireDb(env).prepare("UPDATE invoices SET provider = 'proxypay-opg', provider_transaction_id = ?, updated_at = ? WHERE id = ?").bind(result.id, nowIso(), invoice.id).run();
  return { status: "pending", method: "mcx_express", transactionId: result.id, message: "Confirme o pedido na aplicação Multicaixa Express. O acesso só será libertado após confirmação do fornecedor." };
}

async function markInvoicePaid(env: Env, invoiceId: string, provider: string, providerEventId: string, amountAoa: number, payload: unknown) {
  const db = requireDb(env);
  const invoice = await db.prepare("SELECT id, order_id, amount_aoa, status FROM invoices WHERE id = ?").bind(invoiceId).first<{ id:string;order_id:string;amount_aoa:number;status:string }>();
  if (!invoice) return false;
  if (Math.round(Number(invoice.amount_aoa)) !== Math.round(amountAoa)) return false;
  try {
    await db.prepare("INSERT INTO payment_events (id, provider, provider_event_id, invoice_id, amount_aoa, event_payload, received_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(newId(), provider, providerEventId, invoiceId, Math.round(amountAoa), JSON.stringify(payload), nowIso()).run();
  } catch {
    // A duplicate callback is expected to be harmless. The invoice update below is idempotent.
  }
  await db.prepare("UPDATE invoices SET status = 'paid', paid_at = COALESCE(paid_at, ?), updated_at = ? WHERE id = ? AND status <> 'paid'").bind(nowIso(), nowIso(), invoiceId).run();
  await db.prepare("UPDATE orders SET status = 'paid', updated_at = ? WHERE id = ? AND status <> 'paid'").bind(nowIso(), invoice.order_id).run();
  const premiumItem = await db.prepare("SELECT creator_user_id FROM order_items WHERE order_id = ? AND item_type = 'premium' LIMIT 1").bind(invoice.order_id).first<{ creator_user_id: string }>();
  if (premiumItem?.creator_user_id) {
    const premiumUntil = new Date(Date.now() + 30 * 86400000).toISOString();
    await db.prepare("UPDATE profiles SET premium_enabled = 1, premium_until = ?, updated_at = ? WHERE user_id = ?").bind(premiumUntil, nowIso(), premiumItem.creator_user_id).run();
  }
  return true;
}

async function hmacHex(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return bytesToHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))).toUpperCase();
}
function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return diff === 0;
}

async function api(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();
  const db = env.DB;
  if (!db) return json({ ok: false, error: "O backend de produção ainda não está ligado ao D1. Configure wrangler.d1-r2.template.jsonc e aplique as migrações." }, 503);

  if (path === "/api/auth/me" && method === "GET") {
    const user = await getSession(request, env);
    return user ? json({ ok: true, user: publicUser(user) }) : json({ ok: false, user: null }, 401);
  }

  if (path === "/api/auth/register" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    let body: { displayName?: string; email?: string; password?: string; role?: string };
    try { body = await request.json() as typeof body; } catch { return json({ ok: false, error: "Dados inválidos." }, 400); }
    const displayName = String(body.displayName || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = body.role;
    if (displayName.length < 2 || !validMail(email) || password.length < 10 || !["creator", "brand"].includes(role || "")) {
      return json({ ok: false, error: "Indique nome, e-mail válido, palavra-passe com pelo menos 10 caracteres e tipo de conta." }, 400);
    }
    const id = newId();
    const profileId = newId();
    const stamp = nowIso();
    const roleValue = role as "creator" | "brand";
    const handle = `${slugify(displayName)}-${crypto.randomUUID().slice(0, 6)}`;
    try {
      const passwordHash = await hashPassword(password);
      await db.batch([
        db.prepare("INSERT INTO users (id, email, password_hash, display_name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(id, email, passwordHash, displayName, roleValue, stamp, stamp),
        db.prepare("INSERT INTO profiles (id, user_id, handle, display_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)").bind(profileId, id, handle, displayName, stamp, stamp),
      ]);
    } catch {
      return json({ ok: false, error: "Não foi possível criar a conta. Este e-mail pode já estar registado." }, 409);
    }
    const user: UserRow = { id, email, display_name: displayName, role: roleValue, status: "active" };
    const session = await createSession(user, request, env);
    return json({ ok: true, user: publicUser(user) }, 201, { "set-cookie": authCookie(session.token, request, 30 * 86400) });
  }

  if (path === "/api/auth/login" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    let body: { email?: string; password?: string };
    try { body = await request.json() as typeof body; } catch { return json({ ok: false, error: "Dados inválidos." }, 400); }
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!validMail(email) || !password) return json({ ok: false, error: "E-mail e palavra-passe são obrigatórios." }, 400);
    const row = await db.prepare("SELECT id, email, display_name, role, status, password_hash FROM users WHERE email = ?").bind(email).first<UserRow & { password_hash: string }>();
    if (!row || row.status !== "active" || !(await verifyPassword(password, row.password_hash))) {
      return json({ ok: false, error: "E-mail ou palavra-passe incorrectos." }, 401);
    }
    const user: UserRow = { id: row.id, email: row.email, display_name: row.display_name, role: row.role, status: row.status };
    const session = await createSession(user, request, env);
    return json({ ok: true, user: publicUser(user) }, 200, { "set-cookie": authCookie(session.token, request, 30 * 86400) });
  }

  if (path === "/api/auth/logout" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    const token = cookieValue(request, "nobre_session");
    if (token) await db.prepare("DELETE FROM sessions WHERE id = ?").bind(await sha256Hex(token)).run();
    return json({ ok: true }, 200, { "set-cookie": authCookie("", request, 0) });
  }

  if (path === "/api/profile" && method === "GET") {
    const auth = await requireUser(request, env);
    if (auth.response) return auth.response;
    const profile = await db.prepare("SELECT id, handle, display_name, career, niche, bio, location, website, premium_enabled, premium_until, created_at, updated_at FROM profiles WHERE user_id = ?").bind(auth.user!.id).first();
    return profile ? json({ ok: true, profile }) : json({ ok: false, error: "Perfil não encontrado." }, 404);
  }

  if (path === "/api/profile" && method === "PUT") {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    const auth = await requireUser(request, env, ["creator"]);
    if (auth.response) return auth.response;
    let body: Record<string, unknown>;
    try { body = await request.json() as Record<string, unknown>; } catch { return json({ ok: false, error: "Dados inválidos." }, 400); }
    const displayName = String(body.display_name || "").trim().slice(0, 100);
    const career = String(body.career || "").trim().slice(0, 120);
    const niche = String(body.niche || "").trim().slice(0, 120);
    const bio = String(body.bio || "").trim().slice(0, 3000);
    const location = String(body.location || "").trim().slice(0, 160);
    let website = String(body.website || "").trim().slice(0, 500);
    if (!displayName || !bio) return json({ ok: false, error: "O nome público e a biografia são obrigatórios." }, 400);
    if (website) {
      try { const parsed = new URL(website); if (!["https:", "http:"].includes(parsed.protocol)) throw new Error(); website = parsed.toString(); }
      catch { return json({ ok: false, error: "Indique um endereço de website válido." }, 400); }
    }
    await db.batch([
      db.prepare("UPDATE users SET display_name = ?, updated_at = ? WHERE id = ?").bind(displayName, nowIso(), auth.user!.id),
      db.prepare("UPDATE profiles SET display_name = ?, career = ?, niche = ?, bio = ?, location = ?, website = ?, updated_at = ? WHERE user_id = ?").bind(displayName, career, niche, bio, location, website, nowIso(), auth.user!.id),
    ]);
    const profile = await db.prepare("SELECT id, handle, display_name, career, niche, bio, location, website, premium_enabled, premium_until, created_at, updated_at FROM profiles WHERE user_id = ?").bind(auth.user!.id).first();
    return json({ ok: true, profile });
  }

  if (path === "/api/creators" && method === "GET") {
    const result = await db.prepare(`
      SELECT p.id, p.handle, p.display_name, p.career, p.niche, p.bio, p.location, p.website,
             p.avatar_asset_id, p.premium_enabled, p.premium_until, u.id AS user_id,
             (SELECT a.id FROM media_assets a WHERE a.owner_user_id = u.id AND a.visibility = 'public' AND a.asset_type = 'portfolio' ORDER BY a.created_at DESC LIMIT 1) AS portfolio_asset_id
      FROM profiles p JOIN users u ON u.id = p.user_id
      WHERE u.status = 'active' AND u.role = 'creator'
      ORDER BY p.premium_enabled DESC, p.updated_at DESC LIMIT 100
    `).all();
    return json({ ok: true, creators: result.results || [] });
  }

  if (path === "/api/assets" && method === "GET") {
    const auth = await requireUser(request, env, ["creator"]);
    if (auth.response) return auth.response;
    const result = await db.prepare("SELECT id, title, description, file_name, content_type, size_bytes, asset_type, visibility, created_at, (SELECT id FROM products WHERE asset_id = media_assets.id AND status = 'published' LIMIT 1) AS product_id FROM media_assets WHERE owner_user_id = ? ORDER BY created_at DESC LIMIT 200").bind(auth.user!.id).all();
    return json({ ok: true, assets: result.results || [] });
  }

  if (path === "/api/assets" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    const auth = await requireUser(request, env, ["creator"]);
    if (auth.response) return auth.response;
    if (!env.MEDIA) return json({ ok: false, error: "O bucket R2 ainda não está ligado. Complete a configuração D1/R2 antes de carregar ficheiros." }, 503);
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 52 * 1024 * 1024) return json({ ok: false, error: "O limite de carregamento é 50 MB por ficheiro." }, 413);
    let form: FormData;
    try { form = await request.formData(); } catch { return json({ ok: false, error: "Não foi possível ler o ficheiro." }, 400); }
    const file = form.get("file") as File | null;
    if (!file || typeof file.stream !== "function" || file.size <= 0) return json({ ok: false, error: "Seleccione um ficheiro válido." }, 400);
    if (file.size > 50 * 1024 * 1024) return json({ ok: false, error: "O limite de carregamento é 50 MB por ficheiro." }, 413);
    const type = file.type.toLowerCase().split(";")[0];
    if (!allowedContentTypes.has(type)) return json({ ok: false, error: "Formato não permitido. Use imagem, vídeo, áudio, PDF ou ZIP." }, 415);
    const title = asText(form.get("title"), 140) || cleanFilename(file.name);
    const description = asText(form.get("description"), 2000);
    const assetType = asText(form.get("assetType"), 30);
    if (!["portfolio", "downloadable", "video", "lesson"].includes(assetType)) return json({ ok: false, error: "Tipo de conteúdo inválido." }, 400);
    const priceAoa = Number(asText(form.get("priceAoa"), 20) || "0");
    if (!Number.isSafeInteger(priceAoa) || priceAoa < 0 || priceAoa > 999999999) return json({ ok: false, error: "Preço inválido." }, 400);
    if (assetType === "downloadable" && priceAoa > 0 && !title) return json({ ok: false, error: "Um material à venda precisa de título." }, 400);

    const profile = await db.prepare("SELECT premium_enabled, premium_until FROM profiles WHERE user_id = ?").bind(auth.user!.id).first<{ premium_enabled:number; premium_until:string|null }>();
    const premiumActive = profile?.premium_enabled === 1 && (!profile.premium_until || profile.premium_until > nowIso());
    const visibility = assetType === "portfolio" && premiumActive ? "public" : "private";
    const id = newId();
    const productId = assetType === "downloadable" && priceAoa > 0 ? newId() : null;
    const fileName = cleanFilename(file.name);
    const objectKey = `users/${auth.user!.id}/assets/${id}/${fileName}`;
    try {
      await env.MEDIA.put(objectKey, file.stream() as ReadableStream<Uint8Array>, { httpMetadata: { contentType: type } });
      await db.prepare("INSERT INTO media_assets (id, owner_user_id, title, description, file_name, object_key, content_type, size_bytes, asset_type, visibility, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, auth.user!.id, title, description, fileName, objectKey, type, file.size, assetType, visibility, nowIso()).run();
      if (productId) {
        await db.prepare("INSERT INTO products (id, creator_user_id, asset_id, title, description, price_aoa, currency, product_type, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'AOA', 'download', 'published', ?, ?)").bind(productId, auth.user!.id, id, title, description, priceAoa, nowIso(), nowIso()).run();
      }
    } catch {
      await env.MEDIA.delete(objectKey).catch(() => undefined);
      await db.prepare("DELETE FROM media_assets WHERE id = ?").bind(id).run().catch(() => undefined);
      return json({ ok: false, error: "O ficheiro não foi guardado. Tente novamente." }, 500);
    }
    const asset = { id, title, description, file_name: fileName, content_type: type, size_bytes: file.size, asset_type: assetType, visibility, created_at: nowIso(), product_id: productId };
    return json({ ok: true, asset, product: productId ? { id: productId, title, price_aoa: priceAoa } : null }, 201);
  }

  const assetMatch = path.match(/^\/api\/assets\/([^/]+)(?:\/(download|preview))?$/);
  if (assetMatch && method === "DELETE" && !assetMatch[2]) {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    const auth = await requireUser(request, env, ["creator"]);
    if (auth.response) return auth.response;
    const id = decodeURIComponent(assetMatch[1]);
    const asset = await db.prepare("SELECT id, owner_user_id, object_key FROM media_assets WHERE id = ?").bind(id).first<Pick<AssetRow, "id"|"owner_user_id"|"object_key">>();
    if (!asset || asset.owner_user_id !== auth.user!.id) return json({ ok: false, error: "Ficheiro não encontrado." }, 404);
    await db.prepare("DELETE FROM media_assets WHERE id = ?").bind(id).run();
    await env.MEDIA?.delete(asset.object_key).catch(() => undefined);
    return json({ ok: true });
  }

  if (assetMatch && method === "GET" && (assetMatch[2] === "download" || assetMatch[2] === "preview")) {
    const action = assetMatch[2];
    const id = decodeURIComponent(assetMatch[1]);
    const asset = await db.prepare("SELECT * FROM media_assets WHERE id = ?").bind(id).first<AssetRow>();
    if (!asset) return json({ ok: false, error: "Ficheiro não encontrado." }, 404);
    const user = await getSession(request, env);
    let allowed = Boolean(user && user.id === asset.owner_user_id);
    if (!allowed && asset.visibility === "public" && action === "preview") allowed = true;
    if (!allowed && user) {
      const owned = await db.prepare(`
        SELECT oi.id FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE o.buyer_user_id = ? AND o.status = 'paid' AND p.asset_id = ? LIMIT 1
      `).bind(user.id, asset.id).first();
      allowed = Boolean(owned);
    }
    if (!allowed) return json({ ok: false, error: "Este ficheiro é privado. Compre o material ou entre na conta proprietária." }, user ? 403 : 401);
    if (!env.MEDIA) return json({ ok: false, error: "O armazenamento R2 não está configurado." }, 503);
    const object = await env.MEDIA.get(asset.object_key);
    if (!object) return json({ ok: false, error: "O ficheiro já não está disponível." }, 404);
    const filename = cleanFilename(asset.file_name);
    const headers = new Headers({
      "content-type": object.httpMetadata?.contentType || asset.content_type || "application/octet-stream",
      "content-length": String(object.size),
      "x-content-type-options": "nosniff",
      "cache-control": action === "preview" && asset.visibility === "public" ? "public, max-age=300" : "private, no-store",
      "content-disposition": action === "download" ? `attachment; filename="${filename.replace(/"/g, "")}"; filename*=UTF-8''${encodeURIComponent(filename)}` : "inline",
    });
    return new Response(object.body, { status: 200, headers });
  }

  if (path === "/api/premium" && method === "GET") {
    const auth = await requireUser(request, env, ["creator"]);
    if (auth.response) return auth.response;
    const profile = await db.prepare("SELECT premium_enabled, premium_until FROM profiles WHERE user_id = ?").bind(auth.user!.id).first<{ premium_enabled:number; premium_until:string|null }>();
    const active = profile?.premium_enabled === 1 && (!profile.premium_until || profile.premium_until > nowIso());
    const priceAoa = Number(env.PREMIUM_PRICE_AOA || 0);
    return json({ ok:true, active, premiumUntil:profile?.premium_until || null, priceAoa:Number.isSafeInteger(priceAoa) && priceAoa > 0 ? priceAoa : null, billingConfigured:Number.isSafeInteger(priceAoa) && priceAoa > 0 });
  }

  if (path === "/api/premium/checkout" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok:false,error:"Pedido de origem não permitida." },403);
    const auth = await requireUser(request, env, ["creator"]);
    if (auth.response) return auth.response;
    const profile = await db.prepare("SELECT premium_enabled, premium_until FROM profiles WHERE user_id = ?").bind(auth.user!.id).first<{ premium_enabled:number; premium_until:string|null }>();
    if (profile?.premium_enabled === 1 && (!profile.premium_until || profile.premium_until > nowIso())) return json({ok:false,error:"O seu destaque Premium já está activo."},409);
    const price = Number(env.PREMIUM_PRICE_AOA || 0);
    if (!Number.isSafeInteger(price) || price <= 0) return json({ok:false,error:"O preço do recurso Premium ainda precisa de ser definido pelo administrador."},503);
    let body:{paymentMethod?:string;mobile?:string};
    try { body = await request.json() as typeof body; } catch { return json({ok:false,error:"Dados de pagamento inválidos."},400); }
    const method = body.paymentMethod === "mcx_express" ? "mcx_express" : "multicaixa_reference";
    const orderId=newId(), invoiceId=newId(), stamp=nowIso();
    const orderNumber=`NC-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
    const invoiceNumber=`FNC-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
    const dueDate=datePlusDays(3);
    await db.batch([
      db.prepare("INSERT INTO orders (id, order_number, buyer_user_id, total_aoa, status, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, 'pending_payment', ?, ?, ?)").bind(orderId,orderNumber,auth.user!.id,price,method,stamp,stamp),
      db.prepare("INSERT INTO order_items (id, order_id, product_id, item_type, creator_user_id, title_snapshot, price_aoa, created_at) VALUES (?, ?, NULL, 'premium', ?, ?, ?, ?)").bind(newId(),orderId,auth.user!.id,"Destaque Premium de perfil — 30 dias",price,stamp),
      db.prepare("INSERT INTO invoices (id, order_id, invoice_number, amount_aoa, status, due_date, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)").bind(invoiceId,orderId,invoiceNumber,price,dueDate,method,stamp,stamp),
    ]);
    const invoice:InvoiceRow={id:invoiceId,order_id:orderId,invoice_number:invoiceNumber,amount_aoa:price,status:"pending",due_date:dueDate,payment_method:method,provider:null,provider_reference_id:null,provider_transaction_id:null,multicaixa_entity_id:null,multicaixa_reference_number:null};
    let payment:Record<string,unknown>;
    try {
      payment = method === "mcx_express"
        ? await createMcxExpressPayment(env,request,invoice,orderNumber,String(body.mobile||"").trim())
        : await createMulticaixaReference(env,request,invoice,orderNumber);
    } catch {
      payment={status:"provider_error",method,message:"A factura foi criada, mas a referência de pagamento não foi emitida."};
    }
    const fresh=await db.prepare("SELECT id, order_id, invoice_number, amount_aoa, status, due_date, payment_method, provider, provider_reference_id, provider_transaction_id, multicaixa_entity_id, multicaixa_reference_number FROM invoices WHERE id = ?").bind(invoiceId).first<InvoiceRow>();
    return json({ok:true,order:{id:orderId,order_number:orderNumber,status:"pending_payment"},invoice:fresh||invoice,payment},201);
  }

  if (path === "/api/products" && method === "GET") {
    const result = await db.prepare(`
      SELECT p.id, p.title, p.description, p.price_aoa, p.currency, p.product_type AS asset_type,
             p.created_at, u.display_name AS creator_name, pr.career, pr.premium_enabled
      FROM products p
      JOIN users u ON u.id = p.creator_user_id
      LEFT JOIN profiles pr ON pr.user_id = u.id
      WHERE p.status = 'published' AND u.status = 'active'
      ORDER BY p.created_at DESC LIMIT 100
    `).all();
    return json({ ok: true, products: result.results || [] });
  }

  if (path === "/api/orders" && method === "GET") {
    const auth = await requireUser(request, env);
    if (auth.response) return auth.response;
    const result = await db.prepare(`
      SELECT o.id, o.order_number, o.total_aoa, o.status AS order_status, o.payment_method,
             o.created_at, i.id AS invoice_id, i.invoice_number, i.status AS invoice_status,
             i.due_date, i.multicaixa_entity_id, i.multicaixa_reference_number,
             oi.title_snapshot AS product_title
      FROM orders o JOIN invoices i ON i.order_id = o.id
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.buyer_user_id = ?
      ORDER BY o.created_at DESC LIMIT 100
    `).bind(auth.user!.id).all();
    return json({ ok: true, orders: result.results || [] });
  }

  if (path === "/api/orders" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    const auth = await requireUser(request, env, ["creator", "brand"]);
    if (auth.response) return auth.response;
    let body: { productId?: string; paymentMethod?: string; mobile?: string };
    try { body = await request.json() as typeof body; } catch { return json({ ok: false, error: "Dados do pedido inválidos." }, 400); }
    const productId = String(body.productId || "");
    const method = body.paymentMethod === "mcx_express" ? "mcx_express" : "multicaixa_reference";
    const product = await db.prepare("SELECT p.id, p.creator_user_id, p.title, p.description, p.price_aoa, p.product_type, p.asset_id FROM products p WHERE p.id = ? AND p.status = 'published'").bind(productId).first<{ id:string;creator_user_id:string;title:string;description:string;price_aoa:number;product_type:string;asset_id:string }>();
    if (!product) return json({ ok: false, error: "Material não encontrado ou indisponível." }, 404);
    if (product.creator_user_id === auth.user!.id) return json({ ok: false, error: "Não pode comprar o seu próprio material." }, 400);
    const existing = await db.prepare(`
      SELECT o.id, o.order_number, i.id AS invoice_id, i.invoice_number, i.amount_aoa,
             i.status, i.due_date, i.payment_method, i.provider, i.provider_reference_id,
             i.provider_transaction_id, i.multicaixa_entity_id, i.multicaixa_reference_number
      FROM orders o JOIN invoices i ON i.order_id = o.id
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.buyer_user_id = ? AND o.status = 'pending_payment' AND oi.product_id = ?
      ORDER BY o.created_at DESC LIMIT 1
    `).bind(auth.user!.id, productId).first<Record<string, unknown>>();
    if (existing) {
      const invoice: InvoiceRow = {
        id:String(existing.invoice_id), order_id:String(existing.id), invoice_number:String(existing.invoice_number),
        amount_aoa:Number(existing.amount_aoa), status:String(existing.status), due_date:String(existing.due_date),
        payment_method:String(existing.payment_method), provider:existing.provider ? String(existing.provider) : null,
        provider_reference_id:existing.provider_reference_id ? String(existing.provider_reference_id) : null,
        provider_transaction_id:existing.provider_transaction_id ? String(existing.provider_transaction_id) : null,
        multicaixa_entity_id:existing.multicaixa_entity_id ? String(existing.multicaixa_entity_id) : null,
        multicaixa_reference_number:existing.multicaixa_reference_number ? String(existing.multicaixa_reference_number) : null,
      };
      return json({ ok: true, order:{id:invoice.order_id,order_number:String(existing.order_number),status:"pending_payment"}, invoice, payment:{status:invoice.multicaixa_reference_number?"pending":"not_configured",method:invoice.payment_method,message:"Já existe um pedido pendente deste material. Utilize a mesma factura para evitar cobranças duplicadas."} });
    }

    const orderId = newId();
    const invoiceId = newId();
    const stamp = nowIso();
    const orderNumber = `NC-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
    const invoiceNumber = `FNC-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
    const dueDate = datePlusDays(3);
    const amount = Math.round(Number(product.price_aoa));
    await db.batch([
      db.prepare("INSERT INTO orders (id, order_number, buyer_user_id, total_aoa, status, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, 'pending_payment', ?, ?, ?)").bind(orderId, orderNumber, auth.user!.id, amount, method, stamp, stamp),
      db.prepare("INSERT INTO order_items (id, order_id, product_id, creator_user_id, title_snapshot, price_aoa, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(newId(), orderId, product.id, product.creator_user_id, product.title, amount, stamp),
      db.prepare("INSERT INTO invoices (id, order_id, invoice_number, amount_aoa, status, due_date, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)").bind(invoiceId, orderId, invoiceNumber, amount, dueDate, method, stamp, stamp),
    ]);
    let payment: Record<string, unknown>;
    const invoice: InvoiceRow = { id:invoiceId, order_id:orderId, invoice_number:invoiceNumber, amount_aoa:amount, status:"pending", due_date:dueDate, payment_method:method, provider:null, provider_reference_id:null, provider_transaction_id:null, multicaixa_entity_id:null, multicaixa_reference_number:null };
    try {
      payment = method === "mcx_express"
        ? await createMcxExpressPayment(env, request, invoice, orderNumber, String(body.mobile || "").trim())
        : await createMulticaixaReference(env, request, invoice, orderNumber);
    } catch {
      payment = { status:"provider_error", method, message:"O fornecedor de pagamento não respondeu. A factura foi criada, mas a referência não foi emitida." };
    }
    const fresh = await db.prepare("SELECT id, order_id, invoice_number, amount_aoa, status, due_date, payment_method, provider, provider_reference_id, provider_transaction_id, multicaixa_entity_id, multicaixa_reference_number FROM invoices WHERE id = ?").bind(invoiceId).first<InvoiceRow>();
    return json({ ok:true, order:{id:orderId,order_number:orderNumber,status:"pending_payment"}, invoice:fresh || invoice, payment }, 201);
  }

  const invoiceMatch = path.match(/^\/api\/invoices\/([^/]+)$/);
  if (invoiceMatch && method === "GET") {
    const auth = await requireUser(request, env);
    if (auth.response) return auth.response;
    const invoice = await db.prepare(`
      SELECT i.id, i.order_id, i.invoice_number, i.amount_aoa, i.status, i.due_date,
             i.payment_method, i.provider, i.provider_reference_id, i.multicaixa_entity_id,
             i.multicaixa_reference_number, i.paid_at, o.order_number, o.buyer_user_id
      FROM invoices i JOIN orders o ON o.id = i.order_id WHERE i.id = ?
    `).bind(decodeURIComponent(invoiceMatch[1])).first<Record<string, unknown>>();
    if (!invoice) return json({ ok: false, error: "Factura não encontrada." }, 404);
    if (invoice.buyer_user_id !== auth.user!.id && auth.user!.role !== "admin") return json({ ok: false, error: "Não tem acesso a esta factura." }, 403);
    return json({ ok: true, invoice });
  }

  if (path === "/api/payments/proxypay/callback" && method === "POST") {
    if (!env.PROXYPAY_API_KEY) return json({ ok: false, error: "Payment callback is not configured." }, 503);
    let event: { payment?: PaymentEvent; meta?: { timestamp?: string; signature?: string } };
    try { event = await request.json() as typeof event; } catch { return json({ ok: false, error: "Invalid callback body." }, 400); }
    const p = event.payment;
    const timestamp = String(event.meta?.timestamp || "");
    const signature = String(event.meta?.signature || "").toUpperCase();
    if (!p || !timestamp || !signature || !p.reference_id || !p.amount || !p.id) return json({ ok: false, error: "Incomplete payment event." }, 400);
    const customFields = p.custom_fields || {};
    const checksum = [
      p.amount, p.datetime || "", p.entity_id || "", p.id || "", p.reference_id || "",
      p.reference_number || "", p.terminal_id || "", p.terminal_location || "",
      p.terminal_transaction_id || "", p.terminal_type || "",
      ...Object.keys(customFields).sort().map((key) => String(customFields[key] ?? "")),
    ].join("");
    const expected = await hmacHex(env.PROXYPAY_API_KEY, timestamp + checksum);
    if (!constantTimeEqual(expected, signature)) return json({ ok: false, error: "Invalid payment signature." }, 401);
    const invoice = await db.prepare("SELECT * FROM invoices WHERE provider_reference_id = ? OR invoice_number = ? LIMIT 1").bind(p.reference_id, String(customFields.invoice || "")).first<InvoiceRow>();
    if (!invoice || invoice.payment_method !== "multicaixa_reference") return json({ ok: false, error: "Reference not found." }, 404);
    if (invoice.multicaixa_reference_number && invoice.multicaixa_reference_number !== p.reference_number) return json({ ok: false, error: "Reference number does not match." }, 400);
    if (invoice.multicaixa_entity_id && invoice.multicaixa_entity_id !== p.entity_id) return json({ ok: false, error: "Entity does not match." }, 400);
    if (Math.abs(Number(p.amount) - invoice.amount_aoa) > 0.009) return json({ ok: false, error: "Payment amount does not match invoice." }, 400);
    const paid = await markInvoicePaid(env, invoice.id, "proxypay-rps", String(p.id), Number(p.amount), event);
    return paid ? json({ ok: true }) : json({ ok: false, error: "Could not confirm payment." }, 400);
  }

  if (path === "/api/payments/opg-callback" && method === "POST") {
    if (!env.PAYMENT_CALLBACK_SECRET || url.searchParams.get("token") !== env.PAYMENT_CALLBACK_SECRET) return json({ ok: false, error: "Invalid callback token." }, 401);
    let body: { id?:string; amount?:string; status?:string; transaction?:{id?:string;amount?:string;status?:string} };
    try { body = await request.json() as typeof body; } catch { return json({ ok:false,error:"Invalid callback body." },400); }
    const event = body.transaction || body;
    if (!event.id || !event.status) return json({ ok:false,error:"Incomplete transaction event." },400);
    const invoice = await db.prepare("SELECT id, amount_aoa, status FROM invoices WHERE provider_transaction_id = ?").bind(event.id).first<{id:string;amount_aoa:number;status:string}>();
    if (!invoice) return json({ ok:false,error:"Transaction not found." },404);
    if (event.status === "rejected") {
      await db.prepare("UPDATE invoices SET provider = 'proxypay-opg', updated_at = ? WHERE id = ? AND status <> 'paid'").bind(nowIso(),invoice.id).run();
      return json({ ok:true });
    }
    if (event.status !== "accepted") return json({ ok:true, ignored:true });
    if (Math.abs(Number(event.amount) - invoice.amount_aoa) > 0.009) return json({ ok:false,error:"Payment amount does not match invoice." },400);
    const paid = await markInvoicePaid(env,invoice.id,"proxypay-opg",event.id,Number(event.amount),body);
    return paid ? json({ok:true}) : json({ok:false,error:"Could not confirm payment."},400);
  }

  if (path === "/api/jobs" && method === "GET") {
    const result = await db.prepare("SELECT id, title, company, category, budget, location, deadline, brief, created_at AS createdAt FROM opportunities WHERE status = 'published' ORDER BY created_at DESC LIMIT 200").all();
    return json({ ok: true, jobs: result.results || [] });
  }
  if (path === "/api/jobs" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok: false, error: "Pedido de origem não permitida." }, 403);
    const auth = await requireUser(request, env, ["brand", "admin"]);
    if (auth.response) return auth.response;
    let body: { title?:string; company?:string; category?:string; budget?:string; location?:string; deadline?:string; brief?:string };
    try { body = await request.json() as typeof body; } catch { return json({ ok:false,error:"Dados da oportunidade inválidos." },400); }
    const title = String(body.title || "").trim().slice(0,160);
    const company = String(body.company || "").trim().slice(0,160);
    const category = String(body.category || "").trim().slice(0,100);
    const brief = String(body.brief || "").trim().slice(0,4000);
    if (!title || !company || !category || !brief) return json({ok:false,error:"Título, empresa, categoria e descrição são obrigatórios."},400);
    const job = {
      id:newId(), title, company, category, budget:String(body.budget || "A combinar").trim().slice(0,100),
      location:String(body.location || "A definir").trim().slice(0,120), deadline:String(body.deadline || "A definir").trim().slice(0,120),
      brief, createdAt:nowIso(),
    };
    await db.prepare("INSERT INTO opportunities (id, owner_user_id, title, company, category, budget, location, deadline, brief, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?)").bind(job.id,auth.user!.id,job.title,job.company,job.category,job.budget,job.location,job.deadline,job.brief,job.createdAt,job.createdAt).run();
    return json({ok:true,job},201);
  }

  if (path === "/api/newsletter" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ ok:false,error:"Pedido de origem não permitida." },403);
    let body: {email?:string;source?:string};
    try { body = await request.json() as typeof body; } catch { return json({ok:false,error:"Dados inválidos."},400); }
    const email=String(body.email||"").trim().toLowerCase();
    if (!validMail(email)) return json({ok:false,error:"Indique um e-mail válido."},400);
    await db.prepare("INSERT INTO newsletter_subscribers (email, source, consent_at, unsubscribed_at) VALUES (?, ?, ?, NULL) ON CONFLICT(email) DO UPDATE SET source = excluded.source, consent_at = excluded.consent_at, unsubscribed_at = NULL").bind(email,String(body.source||"website").slice(0,80),nowIso()).run();
    const deliveryReady=Boolean(env.RESEND_API_KEY && env.NEWSLETTER_FROM && env.MAGAZINE_URL);
    if (!deliveryReady) return json({ok:true,subscribed:true,deliveryConfigured:false,deliverySent:false},200);
    const mailSent = await sendEmail(env,email,"Bem-vindo à revista Nobre Creators",`<p>Obrigado por subscrever a revista Nobre Creators.</p><p>A edição digital está disponível em <a href="${escapeHtml(env.MAGAZINE_URL!)}">abrir a revista</a>.</p><p>Receberá futuras edições e novidades neste endereço.</p>`);
    if (!mailSent) return json({ok:true,subscribed:true,deliveryConfigured:true,deliverySent:false},200);
    await db.prepare("UPDATE newsletter_subscribers SET latest_issue_sent_at = ? WHERE email = ?").bind(nowIso(),email).run();
    return json({ok:true,subscribed:true,deliveryConfigured:true,deliverySent:true},200);
  }

  if (path === "/api/magazine/send" && method === "POST") {
    if (!isSafeSameOrigin(request)) return json({ok:false,error:"Pedido de origem não permitida."},403);
    const auth=await requireUser(request,env,["admin"]);
    if (auth.response) return auth.response;
    if (!env.RESEND_API_KEY || !env.NEWSLETTER_FROM) return json({ok:false,error:"O envio de e-mail não está configurado."},503);
    let body:{title?:string;url?:string;subject?:string};
    try { body=await request.json() as typeof body; } catch { return json({ok:false,error:"Dados inválidos."},400); }
    let issueUrl="";
    try { const parsed=new URL(String(body.url||"")); if(parsed.protocol!=="https:") throw new Error(); issueUrl=parsed.toString(); }
    catch { return json({ok:false,error:"Indique um URL HTTPS válido da revista."},400); }
    const title=String(body.title||"Revista Nobre Creators").slice(0,160);
    const result=await db.prepare("SELECT email FROM newsletter_subscribers WHERE unsubscribed_at IS NULL ORDER BY consent_at LIMIT 500").all<{email:string}>();
    const subscribers=result.results||[];
    let sent=0, failed=0;
    for (const subscriber of subscribers) {
      const ok=await sendEmail(env,subscriber.email,String(body.subject||title).slice(0,200),`<p>A nova edição <strong>${escapeHtml(title)}</strong> está disponível.</p><p><a href="${escapeHtml(issueUrl)}">Ler a revista</a></p><p>Obrigado por fazer parte da Nobre Creators.</p>`);
      if(ok){sent+=1;await db.prepare("UPDATE newsletter_subscribers SET latest_issue_sent_at = ? WHERE email = ?").bind(nowIso(),subscriber.email).run();}
      else failed+=1;
    }
    return json({ok:failed===0,total:subscribers.length,sent,failed},failed===0?200:502);
  }

  if (path === "/api/admin/overview" && method === "GET") {
    const auth=await requireUser(request,env,["admin"]);
    if(auth.response) return auth.response;
    const [users,assets,orders,invoices,jobs,newsletter]=await Promise.all([
      db.prepare("SELECT COUNT(*) AS n FROM users").first<{n:number}>(),
      db.prepare("SELECT COUNT(*) AS n FROM media_assets").first<{n:number}>(),
      db.prepare("SELECT COUNT(*) AS n FROM orders").first<{n:number}>(),
      db.prepare("SELECT COUNT(*) AS n FROM invoices WHERE status = 'pending'").first<{n:number}>(),
      db.prepare("SELECT COUNT(*) AS n FROM opportunities WHERE status = 'published'").first<{n:number}>(),
      db.prepare("SELECT COUNT(*) AS n FROM newsletter_subscribers WHERE unsubscribed_at IS NULL").first<{n:number}>(),
    ]);
    return json({ok:true,counts:{users:users?.n||0,assets:assets?.n||0,orders:orders?.n||0,pendingInvoices:invoices?.n||0,opportunities:jobs?.n||0,subscribers:newsletter?.n||0}});
  }

  return json({ ok: false, error: "Endpoint não encontrado." }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({
        ok: true,
        service: "nobre-creators",
        d1Configured: Boolean(env.DB),
        r2Configured: Boolean(env.MEDIA),
        paymentProviderConfigured: Boolean(env.PROXYPAY_API_KEY || env.PROXYPAY_OPG_TOKEN),
        emailConfigured: Boolean(env.RESEND_API_KEY && env.NEWSLETTER_FROM && env.MAGAZINE_URL),
      });
    }
    if (env.DB) {
      try { return await api(request, env); }
      catch (error) {
        if (error instanceof Error && error.message === "D1_DATABASE_NOT_CONFIGURED") return json({ok:false,error:"D1 não configurado."},503);
        return json({ ok: false, error: "Ocorreu um erro no servidor. Tente novamente mais tarde." }, 500);
      }
    }
    const fallbackRoutes = ["/api/newsletter", "/api/jobs", "/api/magazine/send"];
    if (env.STATE && fallbackRoutes.includes(url.pathname)) {
      const state = env.STATE.get(env.STATE.idFromName("nobre-creators-shared"));
      return state.fetch(request);
    }
    if (url.pathname === "/api/auth/me") return json({ ok: false, user: null }, 503);
    return json({ ok:false,error:"D1/R2 ainda não estão ligados a este deployment. Configure os recursos Cloudflare para activar contas, uploads e checkout." },503);
  },
};

export class NobreState {
  constructor(private ctx: DurableStateLike, private env: Env) {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        email TEXT PRIMARY KEY,
        source TEXT NOT NULL DEFAULT 'website',
        subscribed_at TEXT NOT NULL,
        latest_issue_sent_at TEXT
      );
    `);
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS opportunities (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        category TEXT NOT NULL,
        budget TEXT NOT NULL DEFAULT 'A combinar',
        location TEXT NOT NULL DEFAULT 'A definir',
        deadline TEXT NOT NULL DEFAULT 'A definir',
        brief TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/newsletter" && request.method === "POST") return this.subscribe(request);
    if (url.pathname === "/api/jobs" && request.method === "GET") return this.listJobs();
    if (url.pathname === "/api/jobs" && request.method === "POST") return this.createJob(request);
    if (url.pathname === "/api/magazine/send" && request.method === "POST") return this.sendMagazine(request);
    if (url.pathname === "/api/health" && request.method === "GET") {
      const subscribers = this.ctx.storage.sql.exec("SELECT COUNT(*) AS count FROM newsletter_subscribers").toArray()[0] as unknown as { count: number };
      const opportunities = this.ctx.storage.sql.exec("SELECT COUNT(*) AS count FROM opportunities").toArray()[0] as { count: number };
      return json({ ok: true, service: "nobre-creators-api", subscribers: Number(subscribers?.count || 0), opportunities: Number(opportunities?.count || 0) });
    }
    return json({ ok: false, error: "Endpoint not found." }, 404);
  }

  private async subscribe(request: Request): Promise<Response> {
    let payload: { email?: string; source?: string };
    try { payload = await request.json() as { email?: string; source?: string }; }
    catch { return json({ ok: false, error: "Invalid request body." }, 400); }

    const email = String(payload.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return json({ ok: false, error: "Enter a valid email address." }, 400);
    }

    const now = new Date().toISOString();
    const source = String(payload.source || "website").slice(0, 80);
    this.ctx.storage.sql.exec(
      "INSERT INTO newsletter_subscribers (email, source, subscribed_at) VALUES (?, ?, ?) ON CONFLICT(email) DO UPDATE SET source=excluded.source",
      email, source, now,
    );

    const mailConfigured = Boolean(this.env.RESEND_API_KEY && this.env.NEWSLETTER_FROM && this.env.MAGAZINE_URL);
    if (!mailConfigured) {
      return json({ ok: true, subscribed: true, deliveryConfigured: false, deliverySent: false });
    }

    const mail = await this.sendEmail(
      email,
      "Bem-vindo à revista Nobre Creators",
      `<p>Obrigado por subscrever a revista Nobre Creators.</p><p>A sua edição digital está disponível em <a href="${this.escapeHtml(this.env.MAGAZINE_URL!)}">abrir a revista</a>.</p><p>Receberá futuras edições e novidades neste endereço.</p>`,
    );
    if (!mail.ok) return json({ ok: false, subscribed: true, deliveryConfigured: true, deliverySent: false }, 502);

    this.ctx.storage.sql.exec("UPDATE newsletter_subscribers SET latest_issue_sent_at = ? WHERE email = ?", new Date().toISOString(), email);
    return json({ ok: true, subscribed: true, deliveryConfigured: true, deliverySent: true });
  }

  private async listJobs(): Promise<Response> {
    const rows = this.ctx.storage.sql.exec(
      "SELECT id, title, company, category, budget, location, deadline, brief, created_at AS createdAt FROM opportunities ORDER BY created_at DESC LIMIT 200",
    ).toArray();
    return json({ ok: true, jobs: rows });
  }

  private async createJob(request: Request): Promise<Response> {
    let payload: OpportunityInput;
    try { payload = await request.json() as OpportunityInput; }
    catch { return json({ ok: false, error: "Invalid request body." }, 400); }

    const title = String(payload.title || "").trim().slice(0, 160);
    const company = String(payload.company || "").trim().slice(0, 160);
    const category = String(payload.category || "").trim().slice(0, 100);
    const brief = String(payload.brief || "").trim().slice(0, 4000);
    if (!title || !company || !category || !brief) {
      return json({ ok: false, error: "Title, company, category and brief are required." }, 400);
    }

    const job = {
      id: String(payload.id || crypto.randomUUID()).slice(0, 80),
      title,
      company,
      category,
      budget: String(payload.budget || "A combinar").trim().slice(0, 100),
      location: String(payload.location || "A definir").trim().slice(0, 120),
      deadline: String(payload.deadline || "A definir").trim().slice(0, 120),
      brief,
      createdAt: new Date().toISOString(),
    };

    this.ctx.storage.sql.exec(
      "INSERT OR REPLACE INTO opportunities (id, title, company, category, budget, location, deadline, brief, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      job.id, job.title, job.company, job.category, job.budget, job.location, job.deadline, job.brief, job.createdAt,
    );
    return json({ ok: true, job }, 201);
  }

  private async sendMagazine(request: Request): Promise<Response> {
    const token = this.env.NEWSLETTER_ADMIN_TOKEN;
    if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
      return json({ ok: false, error: "Unauthorized." }, 401);
    }
    if (!this.env.RESEND_API_KEY || !this.env.NEWSLETTER_FROM) {
      return json({ ok: false, error: "Magazine email delivery is not configured." }, 503);
    }

    let payload: { title?: string; url?: string; subject?: string };
    try { payload = await request.json() as { title?: string; url?: string; subject?: string }; }
    catch { return json({ ok: false, error: "Invalid request body." }, 400); }

    const title = String(payload.title || "Revista Nobre Creators").trim().slice(0, 160);
    let issueUrl = "";
    try {
      const parsed = new URL(String(payload.url || ""));
      if (parsed.protocol !== "https:") throw new Error("HTTPS required");
      issueUrl = parsed.toString();
    } catch { return json({ ok: false, error: "A valid HTTPS magazine URL is required." }, 400); }

    const subscribers = this.ctx.storage.sql.exec("SELECT email FROM newsletter_subscribers ORDER BY subscribed_at").toArray() as unknown as Array<{ email: string }>;
    let sent = 0;
    let failed = 0;
    for (const subscriber of subscribers) {
      const result = await this.sendEmail(
        subscriber.email,
        String(payload.subject || title).trim().slice(0, 200),
        `<p>A nova edição da revista Nobre Creators, <strong>${this.escapeHtml(title)}</strong>, está disponível.</p><p><a href="${this.escapeHtml(issueUrl)}">Ler a revista</a></p><p>Obrigado por fazer parte da rede Nobre Creators.</p>`,
      );
      if (result.ok) {
        sent += 1;
        this.ctx.storage.sql.exec("UPDATE newsletter_subscribers SET latest_issue_sent_at = ? WHERE email = ?", new Date().toISOString(), subscriber.email);
      } else {
        failed += 1;
      }
    }
    return json({ ok: failed === 0, total: subscribers.length, sent, failed }, failed === 0 ? 200 : 502);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean }> {
    if (!this.env.RESEND_API_KEY || !this.env.NEWSLETTER_FROM) return { ok: false };
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "authorization": `Bearer ${this.env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: this.env.NEWSLETTER_FROM, to: [to], subject, html }),
      });
      return { ok: response.ok };
    } catch {
      return { ok: false };
    }
  }

  private escapeHtml(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
}
