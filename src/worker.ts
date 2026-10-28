interface SqlRow {
  [key: string]: string | number | null;
}

interface SqlResult {
  toArray(): SqlRow[];
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

interface AssetFetcherLike {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcherLike;
  STATE: DurableNamespaceLike;
  RESEND_API_KEY?: string;
  NEWSLETTER_FROM?: string;
  MAGAZINE_URL?: string;
  NEWSLETTER_ADMIN_TOKEN?: string;
}

type OpportunityInput = {
  id?: string;
  title?: string;
  company?: string;
  category?: string;
  budget?: string;
  location?: string;
  deadline?: string;
  brief?: string;
};

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (url.pathname === "/api/health" && request.method === "GET") return json({ ok: true, service: "nobre-creators-api" });

    const state = env.STATE.get(env.STATE.idFromName("nobre-creators-shared"));
    return state.fetch(request);
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
