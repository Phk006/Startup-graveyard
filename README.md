# THE GRAVEYARD

<p align="center">
  <img src="public/graveyard-demo.gif" alt="THE GRAVEYARD animated interface preview" width="100%" />
</p>
<p align="center"><sub>Animated interface concept preview — locations shown are illustrative references, not verified company-office pins.</sub></p>

<p align="center">
  <strong>A global atlas of startup shutdowns, insolvencies and business failures.</strong><br />
  Explore where companies began, trace their lifecycle, and understand the evidence behind their outcomes.
</p>

<p align="center">
  <a href="https://dancing-gumption-3b93b4.netlify.app"><strong>Live Demo</strong></a> ·
  <a href="https://github.com/Phk006/Startup-graveyard"><strong>GitHub Repository</strong></a>
</p>

<p align="center">
  <img alt="Coverage" src="https://img.shields.io/badge/coverage-2000--2026-9b6b53" />
  <img alt="Interface" src="https://img.shields.io/badge/interface-geospatial-477d8a" />
  <img alt="Data quality" src="https://img.shields.io/badge/data-evidence--first-4b8062" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue" />
</p>

## Overview

THE GRAVEYARD is a map-first research experience for exploring documented startup failures and business distress around the world. Its intended coverage window is **1 January 2000 through 31 December 2026**. The project distinguishes formal bankruptcy and insolvency from ordinary shutdowns, acquisitions, restructurings and discontinued products.

**The map is the product.** Users can search for a company, filter by geography, industry, event year and failure classification, then inspect a sourced company profile and chronological lifecycle.

## Live experience

[Open the deployed preview](https://dancing-gumption-3b93b4.netlify.app)

## Product principles

- **Evidence before volume:** every published record should have source references and a review status.
- **Honest geography:** exact office coordinates, city-level approximations and country-only records are different levels of precision. Never fabricate a pin.
- **Correct legal status:** shutdown is not synonymous with bankruptcy. Product discontinuation is not company failure.
- **Historical clarity:** filter on the date of the failure event, not the founding date.
- **Attribution:** retain source URLs, dates and licensing notes; do not republish copyrighted articles wholesale.

## Repository guide

| Path | Purpose |
|---|---|
| `app/`, `components/` | Next.js map-first starter application |
| `data/startups.seed.json` | Small seed dataset with explicit review labels; not a complete archive |
| `data/startups.schema.json` | JSON Schema for startup records |
| `docs/DATA_DICTIONARY.md` | Field definitions and permitted values |
| `docs/DATA_COLLECTION.md` | Source discovery, research and responsible ingestion workflow |
| `docs/GEOCODING_POLICY.md` | Rules for address precision and map placement |
| `docs/ARCHITECTURE.md` | Suggested application architecture |
| `docs/DEPLOYMENT.md` | Deployment and environment configuration |
| `docs/CODEX_HANDOFF.md` | Implementation handoff for Codex |
| `sql/schema.sql` | PostgreSQL / PostGIS starter schema |
| `src/types.ts` | TypeScript data contracts |
| `scripts/` | Seed validation and preview GIF generator |

## Suggested stack

- Next.js + TypeScript for the application.
- MapLibre GL JS with CARTO dark vector tiles for the starter map.
- Supabase PostgreSQL + PostGIS for records and spatial queries.
- Server-side scheduled ingestion for permitted public feeds and licensed APIs.
- Vercel or Netlify for hosting. The live demo link above is supplied as a reference deployment; this repository branch has not been confirmed as the source deployed at that URL.

## Quick start

This repository includes a runnable Next.js map-first starter application plus the database, data contracts and research documentation.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The starter map uses CARTO dark vector tiles through MapLibre and includes a small review-labelled seed dataset. Configure production credentials and database access before enabling ingestion.

1. Apply `sql/schema.sql` to PostgreSQL with PostGIS enabled.
2. Validate records with `npm run validate:data`.
3. Configure map and database credentials using environment variables.
4. Expand the map, data ingestion and admin review workflows described in `docs/CODEX_HANDOFF.md`.

See `docs/DEPLOYMENT.md` before deploying. Never commit API keys, Supabase service-role keys or private credentials.

## Data status and limitations

The included seed records are illustrative starting points for integration and **are not a verified, exhaustive, or production-ready global dataset**. Some historical company locations and failure dates need further source review. City-level coordinates are approximate reference points, not exact historical office locations. The UI intentionally labels these records for review. Do not use this seed file to claim total worldwide coverage.

Failory and other directories can help discover candidate companies, but their coverage and individual claims must be checked. Respect robots.txt, terms of service, copyright, access controls, API rate limits and licensing. Prefer official filings, company announcements and reputable reporting for legal status and dates.

## Contributing

Please submit corrections with primary or reputable sources, distinguish reported facts from analysis, and explain whether a coordinate is exact or approximate. See `docs/DATA_COLLECTION.md`.

## License

The code and documentation in this starter kit are provided under the MIT License. Third-party datasets, logos, articles, map tiles and imagery remain subject to their own licenses and terms. See `LICENSE`.
