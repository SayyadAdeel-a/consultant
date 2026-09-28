# SECURITY REVIEW & HARDENING AUDIT: ALDERLINE ENVIRONMENTAL

## 1. Executive Summary
A comprehensive security review was performed on the unified **Alderline Environmental** application (`S:\Apps\consultant`). The application demonstrates a secure posture adhering to modern defense-in-depth principles across frontend interactions, Server Actions, database Row-Level Security, authentication session management, and credential isolation.

---

## 2. Threat Model & Perimeter Analysis

```
[ Public Internet ]
        │
        ▼ (HTTPS / TLS 1.3)
┌────────────────────────────────────────────────────────┐
│ Next.js 16 Edge / Node Runtime (Vercel)                │
│                                                        │
│  ├─ HTTP Headers (HSTS, X-Frame, X-Content-Type, CSP) │
│  ├─ Server Actions with Built-in Origin Verification   │
│  ├─ Honeypot Anti-Spam Barrier                         │
│  └─ Zod Runtime Schema Validation                      │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼ (SSL PostgreSQL / Supabase Client)
┌────────────────────────────────────────────────────────┐
│ Supabase Cloud (AWS us-east-1)                         │
│                                                        │
│  ├─ Anon Key: Read-Only Public Tables via RLS          │
│  ├─ Authenticated JWT: Admin Read/Write via RLS        │
│  ├─ Inquiries Table: INSERT-only for anon, SELECT-auth │
│  └─ Service Role Key: Strict server-side containment   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Credential & Environment Variable Containment

### 3.1 Key Segregation Audit
| Variable | Scope | Target | Risk Level | Protection Applied |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Project API Gateway | Low | Publicly visible; points to SSL endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Supabase Anon Key | Low | Publicly visible; constrained by RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Internal Worker / Admin | Critical | **NEVER** prefixed with `NEXT_PUBLIC_`. Isolated to `src/lib/supabase/admin.ts`. Excluded from client bundles. |

### 3.2 Repository Secrets Check
- Verified `.gitignore` covers `.env`, `.env.local`, `.env.*.local`, `node_modules`, and `.next`.
- Audit confirms no production API keys, service role keys, or database passwords are hardcoded in source control.

---

## 4. Input Validation & Injection Defenses

### 4.1 Server-Side Zod Validation
All data arriving via Server Actions undergoes strict schema validation prior to execution:
- **String Length Enforcements:** All text fields are capped (e.g. `fullName: max 100`, `projectScope: max 2000`) preventing memory exhaustion and buffer inflation attacks.
- **Email Validation:** RFC-compliant email validation prevents malformed address injection.
- **SQL Injection Immunity:** Supabase PostgREST uses parameterized queries natively; raw string concatenation of user input is strictly prohibited across all repositories.

### 4.2 Anti-Spam Honeypot Mechanism
The contact form features a hidden `website` input field:
- **Behavior:** Invisible to human users via Tailwind hidden classes and `tabIndex={-1}`.
- **Enforcement:** If populated by automated form-filling scripts, `submitInquiry` silently short-circuits with `{ success: true, message: "Inquiry received" }`. No database row is created, denying spam delivery while withholding rejection cues from bots.

---

## 5. Row-Level Security (RLS) Policy Audit

| Table | Policy Name | Permitted Roles | Condition | Security Status |
| :--- | :--- | :--- | :--- | :--- |
| `inquiries` | Public can create inquiry | `anon`, `authenticated` | `WITH CHECK (true)` | PASS (Write-only for visitors) |
| `inquiries` | Admins can view inquiries | `authenticated` | `USING (auth.role() = 'authenticated')` | PASS (Visitors cannot read leads) |
| `inquiries` | Admins can modify inquiries | `authenticated` | `USING (auth.role() = 'authenticated')` | PASS (Visitors cannot alter leads) |
| `site_settings`| Public can read settings | `anon`, `authenticated` | `USING (true)` | PASS (Read-only configuration) |
| `site_settings`| Admins can update settings| `authenticated` | `USING (auth.role() = 'authenticated')` | PASS (Visitors cannot modify config) |
| `services` | Public can read published | `anon`, `authenticated` | `USING (is_published = true)` | PASS (Drafts hidden from public) |
| `services` | Admins can manage all | `authenticated` | `USING (auth.role() = 'authenticated')` | PASS (Protected admin scope) |

---

## 6. Authentication & Session Security

- **Session Protocol:** Supabase SSR Auth using PKCE (Proof Key for Code Exchange) flow.
- **Cookie Security:**
  - `HttpOnly`: Session cookies cannot be accessed or stolen via malicious client JavaScript.
  - `SameSite=Lax`: Defends against Cross-Site Request Forgery (CSRF).
  - `Secure`: Cookie transmission is restricted to HTTPS in staging and production.
- **Server Action Protection:** Next.js Server Actions enforce native CSRF protection by validating the `Origin` header against the `Host` header on all POST requests.

---

## 7. Security Hardening Recommendations for Staging / Production
1. **Content Security Policy (CSP):** Ensure `next.config.ts` includes strict `frame-ancestors 'none'` to eliminate clickjacking.
2. **Rate Limiting:** Implement IP-based rate limiting on `/contact` submissions using Vercel KV or Upstash Redis prior to high-volume commercial marketing launches.
3. **MFA for Admin Users:** Enable Multi-Factor Authentication (TOTP) in Supabase Auth for all administrative roles before deploying the CMS admin frontend.
