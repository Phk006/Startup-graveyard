# Codex implementation handoff

Build on the existing THE GRAVEYARD application and preserve its current working map functionality. The primary interface is a Google Maps-like global startup-failure atlas.

## Required workflow

1. Inspect the current repository before changing files. Identify the framework, map provider, routes, database and deployment config. Do not overwrite working credentials or unrelated code.
2. Integrate `data/startups.schema.json`, `data/startups.seed.json` and `src/types.ts`.
3. Apply and review `sql/schema.sql`; keep company records, multiple historical locations and multiple dated events separate.
4. Implement map search, map viewport queries, clustering, filters (country, city, industry, failure year, legal/operational classification) and accessible marker selection.
5. Clicking a marker opens a detail drawer while preserving the exact map viewport. Show company overview, event timeline, evidence links and location precision label.
6. Implement ingestion as a server-side, auditable pipeline. Treat Failory and directories as discovery sources. Verify legal status with official filings/registries or credible reporting. Follow source terms, robots rules, copyright and rate limits. Never bypass access controls.
7. Geocode only source-supported addresses. Store raw address, source URL, provider, query, result ID, confidence, timestamp and precision. Do not fill null coordinates with guessed centroids. City centroids are allowed only as explicitly approximate city references.
8. Build admin review tools for conflicting facts, duplicate candidates, legal classification and geocoding.
9. Implement year filtering on `failure_event_date` between 2000-01-01 and 2026-12-31; distinguish announcement, filing, closure and dissolution dates. Mark 2026 events as current-year records where appropriate.
10. Run typecheck, lint, tests and production build; report actual results and outstanding environment variables.

## Non-negotiable quality rules

- Do not make up company facts, failure causes, addresses, dates or coordinates.
- A shutdown is not automatically bankruptcy.
- A product discontinuation is not automatically company failure.
- A distressed acquisition is not automatically liquidation.
- Keep source attribution visible in every company detail view.
- Do not expose service-role keys or ingestion credentials to the browser.
- Use RLS; do not make unreviewed imports publicly editable.
- Keep map attribution visible according to the provider's licence.
- Do not claim complete global coverage based on a handful of seed records.

## Acceptance criteria

- Global map can pan and zoom smoothly.
- Marker clustering works at world view.
- Marker positions use validated WGS84 coordinates only.
- Precision label is visible (verified address / area / approximate city / country-only).
- Search and all filters work from database records.
- A selected company drawer does not destroy the map instance or viewport.
- Company profile shows sourced lifecycle events and failure classification.
- Admin can approve, reject, merge and correct records with audit history.
- Import process is idempotent and reports duplicates/errors.
- Tests, lint, typecheck and build pass, or failures are documented accurately.
