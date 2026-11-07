# Data discovery, research and ingestion

## Scope

The intended historical coverage window is 2000-01-01 to 2026-12-31, based on the date of the failure event. Companies founded before 2000 may be included when their relevant failure event occurred within the window. In-progress 2026 events must be labelled year-to-date and rechecked.

## Source hierarchy

1. Court records, insolvency/bankruptcy registries, official filings and regulators for legal status and dates.
2. Company statements and archived official notices for shutdowns, acquisitions and discontinuations.
3. Reputable financial/business reporting for chronology and context.
4. Founder/employee interviews for first-hand context, clearly attributed.
5. Directories such as Failory for discovery and cross-reference, not sole proof of legal bankruptcy or precise coordinates.

Potential discovery sources include Failory's `/failures` directory and `/cemetery`, plus other archives. Confirm current terms, robots policy, licensing and access rules before crawling or importing. Use official APIs or permitted exports where available. Do not bypass paywalls, authentication, robots restrictions or rate limits. Do not copy full copyrighted case studies; store factual metadata, brief independently written summaries and citations.

## Ingestion pipeline

1. Discover candidate company records and store the source page URL.
2. Normalise names, known aliases, domains and parent/subsidiary relationships.
3. Deduplicate using multiple identifiers; do not merge merely similar names.
4. Research the event and classify it correctly:
   - `formal_bankruptcy`: formal court/registry proceeding.
   - `insolvency`: formal insolvency procedure.
   - `liquidation`: formal liquidation.
   - `shutdown`: operations ceased; no claim of bankruptcy.
   - `distressed_acquisition`: acquired in a distressed context; specify what happened to operations.
   - `restructuring`: business restructured; not automatically a failure or closure.
   - `product_discontinuation`: only a product/service ended; parent company may continue.
   - `business_collapse`: use only where evidence supports collapse but legal category is unknown.
5. Record event date separately from announcement, filing, last-operation and dissolution dates.
6. Research founding location separately from final headquarters and registered office.
7. Geocode using the policy in `GEOCODING_POLICY.md`.
8. Attach evidence URLs to claims; record publication/access dates.
9. Assign verification status and reviewer notes.
10. Publish verified or appropriately labelled partial records; incomplete records stay in review queue.

## Required audit output

Every import run should report: candidates discovered, unique companies, duplicates, records added/updated, failures by type, records missing failure date, records missing source, geocoding success by precision, coordinate conflicts and records awaiting human review.

## Live update model

A scheduled refresh (for example every 6-12 hours, subject to source permissions) is not instant real-time news. Keep `event_date`, `published_at`, `fetched_at` and `verified_at` separate. Display feed freshness and never label an old historical event as newly occurring.
