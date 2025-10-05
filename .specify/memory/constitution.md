# Static Web App Template Constitution

This constitution codifies the non‑negotiable standards, decision filters, and quality bars for any project derived from the Static Web App Template ("the Template"). It is intentionally opinionated to optimize for: predictable performance, accessibility, security, maintainability, and frictionless iteration.

## Core Principles

### I. Content & User Value First

Every change must articulate the user value (persona + need) before implementation. Layouts, navigation, and semantics prioritize clarity and accessibility over aesthetics. Avoid premature abstraction until at least two real use cases exist.

### II. Performance Budget Enforcement

Hard budgets (production, 75th percentile): LCP ≤ 2.0s on fast 4G (≤ 3.0s on regular 4G), CLS ≤ 0.1, TBT ≤ 200ms, TTFB (edge) ≤ 200ms, Total JS (uncompressed, executed) ≤ 160KB, Critical CSS ≤ 25KB. Any PR breaching a budget must either: (a) reduce elsewhere (net neutral) or (b) include an approved written exemption with an expiry.

### III. Accessibility & Inclusive Design (NON‑NEGOTIABLE)

Baseline WCAG 2.1 AA. Automated axe + manual keyboard + screen reader smoke required for all new interactive components. Color contrast ≥ 4.5:1 (normal text). No content locked behind pointer interaction only. Semantic HTML > ARIA; ARIA used only to fix real gaps.

### IV. Security & Privacy by Default

Enforce least privilege, zero trust for dynamic endpoints. All scripts loaded with SRI + `nonce`/`sha256` if CSP disallows inline. No inline event handlers. User data collection is explicit, consent‑gated, and minimized. Secrets never embedded client-side; build-time environment variables are vetted.

### V. Observability & Continuous Improvement

Every deploy emits a signed provenance artifact (build metadata + git commit). Real user monitoring (RUM) + synthetic checks tracked against SLIs; SLO breaches create issues automatically. Logs, metrics, and traces for serverless edges share a unified correlation ID.

## Static Web App Requirements

### 1. Scope

The Template delivers a statically generated, CDN‑accelerated, accessibility‑compliant marketing / documentation / lightweight application shell with optional serverless functions for dynamic form handling, search indexing, and incremental regeneration.

### 2. Out of Scope

- Stateful multi-user sessions beyond anonymous + lightweight authenticated (token-based) API calls.
- Real-time websockets (use external service if needed; add via extension RFC).
- Arbitrary server-side rendering on every request (ISR / prerender only).
- Direct database connections from client (must traverse serverless API facade).

### 3. Personas

- Visitor: Consumes content quickly on mobile / limited bandwidth.
- Editor / Content Manager: Publishes markdown or MDX; expects preview builds.
- Developer: Extends components, builds integrations, maintains quality gates.
- SEO / Growth Analyst: Needs structured data, sitemaps, performance metrics.

### 4. Key User Journeys

1. First paint of home page under constrained network (fast 4G) ≤ 1.2s FCP.
2. Navigation between prerendered pages is instant (≤ 150ms perceived) via client router + prefetch.
3. Form submission (contact or signup) completes with optimistic UI and fallback revalidation.
4. Content editor opens a PR → automatic preview URL with identical production CSP + feature flags.
5. User shares URL → unfurled metadata is correct (Open Graph, Twitter, structured JSON-LD).

### 5. Functional Requirements

| Domain | Requirement |
|--------|-------------|
| Content Source | Markdown / MDX compiled at build; image optimization pipeline with width sets + AVIF/WebP fallback. |
| Routing | File-system routing; 301 canonical redirects defined declaratively. |
| Navigation | Accessible skip links, landmark roles, focus ring preserved, prefetch on idle. |
| Theming | Optional dark mode via `prefers-color-scheme`; no layout shift on toggle. |
| Search | Pluggable (e.g., static Lunr/mini index or external API). Must lazy-load and be ≤ 35KB JS. |
| Forms | Posted to serverless endpoint; spam protection (honeypot + optional token). All PII fields enumerated. |
| Images | Responsive `<img>` / `<picture>` with defined `width`/`height`; lazy load non-critical below fold. |
| Internationalization (Optional) | Path or domain-based locale segmentation; default language fallback; language switch persists. |
| Error Pages | Custom 404, 500, maintenance pages prerendered. |
| Config | All public runtime config prefixed (e.g., `PUBLIC_`); non-prefixed vars blocked from client bundle. |
| Analytics | Pluggable provider; must support cookieless mode; consent gating if tracking beyond essential. |
| Feature Flags | Build-time static substitution + minimal runtime flags via JSON manifest hashed per deploy. |

### 6. Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| Performance | Budgets (see Principle II). PR CI runs Lighthouse (mobile) + bundle analyzer diff. |
| Accessibility | Axe CI zero new serious/critical violations; manual checklist for new widgets. |
| Security | CSP: `default-src 'self'; object-src 'none'; frame-ancestors 'none';` Strict-Transport-Security (2y preload); Referrer-Policy `strict-origin-when-cross-origin`; Subresource Integrity for third-party assets; dependency scanning weekly. |
| Privacy | Data minimization documented; consent banner only if storing non-essential cookies; PII redacted in logs. |
| Reliability | 99.9% static content availability target; automated rollback if error rate > 2% over 5 mins post-deploy. |
| SEO | Sitemap, robots.txt, canonical tags, structured data (JSON-LD) for articles/products, meta descriptions, Open Graph. |
| Localization | UTF-8 everywhere; locale negotiation based on path > header; fallback strings must exist (no blank keys). |
| Resilience | All external calls (serverless) wrapped with 3 attempts (exponential jitter) + circuit breaker. |
| Maintainability | Cyclomatic complexity threshold per function ≤ 12; components > 250 LOC need decomposition RFC. |
| Scalability | Static assets edge-cached ≥ 1 year immutable fingerprinted; HTML default cache ≤ 5m unless ISR. |

### 7. Architecture & Stack

- Static Site Generator: Must support incremental / partial rebuild (e.g., Astro, Next.js static export, Eleventy + custom pipeline).
- Rendering: All primary pages prerendered; dynamic fallback only where content cardinality is large.
- Styling: Utility-first (e.g., Tailwind) or design token layer + minimal critical CSS extraction.
- JavaScript: Island / partial hydration approach preferred; reduce client JS surface.
- Assets: Fingerprinted; compression (Brotli + gzip) enforced; large media offloaded to object storage/CDN.
- Serverless Layer: Only for form handling, search indexing webhook, revalidation triggers, edge personalization.
- Infrastructure as Code: Deployment + configuration codified (Bicep/Terraform) — no manual portal drift.

### 8. Deployment & Environments

| Environment | Purpose | Promotion |
|-------------|---------|-----------|
| Local | Dev iteration | N/A |
| Preview (per PR) | Review + QA | Auto on PR open |
| Staging | Integration + load + compliance | Merge to `main` |
| Production | Public | Tag or approved release PR |

Constraints:

- Atomic deploys; previous version retained for instant rollback.
- Rollback target chosen via manifest snapshot; must complete < 2 minutes.
- Build must produce provenance file: commit SHA, dependency lockfile hash, build timestamp, performance summary.

### 9. Observability

- RUM: LCP, FID/INP, CLS, TTFB, JS payload recorded (anonymized) + exported.
- Synthetic: Hourly global GET checks (200 + LCP proxy metric) + daily full Lighthouse.
- Logging: Serverless functions output structured JSON: `{ts, level, traceId, event, duration_ms}`.
- Metrics: Error rate, cold start duration, function p95 latency. Alert thresholds documented.
- Trace Correlation: `x-trace-id` header propagated across function calls and client analytics beacon.

### 10. Versioning & Breaking Changes

- SemVer applies to public component library and serverless API contracts.
- A "breaking" change requires: (a) migration notes, (b) deprecation window (≥ 1 minor release), (c) CI test covering deprecated path until removal.
- Content-only changes do not bump SemVer; code + contract changes do.

### 11. Acceptance Criteria Template

Each requirement tracked in an issue must include:

1. User Story (persona + need + outcome)
2. Measurable Acceptance Tests (automated where possible)
3. Performance Impact (expected delta vs budgets)
4. Accessibility Impact review
5. Security/Privacy review (if handling data)

### 12. Glossary (Excerpt)

- ISR: Incremental Static Regeneration (on-demand partial rebuild).
- RUM: Real User Monitoring.
- SLO: Service Level Objective; SLI: Service Level Indicator.
- Budget Drift: Gradual erosion of performance or bundle size through small increments.

## Development Workflow & Quality Gates

1. Issue → Design Stub (RFC if architectural) → Tests/Acceptance Draft → Implementation → Review → Merge.
2. Mandatory CI stages: (a) Lint/Type Check, (b) Unit Tests, (c) Accessibility scan, (d) Bundle diff, (e) Lighthouse (mobile), (f) Security/dependency scan, (g) License compliance.
3. A PR failing any gate cannot be force merged; exemptions require temporary waiver label with expiry + issue reference.
4. Pair review strongly encouraged for changes affecting performance, security, or accessibility.
5. New component requires: story/demo, a11y notes, performance note (estimated added JS), dark mode check, tests.
6. Documentation updated in same PR: `CHANGELOG.md` + architecture notes if applicable.
7. Preview deploy link must be posted automatically in PR description; reviewer validates budgets in actual environment (not local only).

## Governance

1. This Constitution supersedes informal style guides or ad-hoc decisions.
2. Amendments require: (a) Proposal (ADR or RFC), (b) Impact analysis, (c) Tooling update (e.g., CI rule) if enforceable, (d) Version bump of Constitution.
3. Non-compliance discovered post-merge creates a blocking remediation issue with SLA: critical 24h, high 3d, normal next sprint.
4. Tooling > Policy: whenever feasible, encode a rule (lint, CI check) instead of relying on human review.
5. Performance, accessibility, and security metrics reported weekly; regressions must have owner + ETA.
6. Any introduction of a new third-party script requires privacy + security review and performance budget justification.
7. Feature flags must include expiry / review date; stale flags audited monthly.
8. Rollbacks are operationally neutral; no stigma in choosing safe revert over risky patch.

**Version**: 1.0.0 | **Ratified**: 2025-10-04 | **Last Amended**: 2025-10-04
