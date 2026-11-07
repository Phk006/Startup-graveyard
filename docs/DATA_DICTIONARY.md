# Data dictionary

## Company fields

- `id`: stable internal slug; do not use a mutable display name as a primary key.
- `name`, `aliases`: canonical company name and known historical names.
- `founded_date`: earliest substantiated full founding date. If only a year is known, leave this null and use `founded_year`.
- `failure_event_date`: date of the specific event represented by the record. It is not necessarily the last trading day or dissolution date.
- `failure_classification`: one of `formal_bankruptcy`, `insolvency`, `liquidation`, `shutdown`, `distressed_acquisition`, `restructuring`, `product_discontinuation`, `business_collapse`, `unknown`.
- `verification_status`: `unverified`, `needs_review`, `partially_verified`, `verified`.
- `failure_causes`: concise evidence-backed factors. Do not infer causation from correlation or copy editorial speculation as fact.

## Location fields

Each company can have multiple time-specific locations. Keep location purpose explicit:

- `founding_office`: actual office where the company was founded, only when sourced.
- `original_operating_location`: early operational site.
- `historical_headquarters`: headquarters during a specified period.
- `final_headquarters`: last known headquarters.
- `registered_office`: legal registered address; this is not necessarily where the team worked.
- `city_reference`: city-level fallback, never an exact office pin.

`precision` values:

- `exact_address`: documented address geocoded to the actual premises and supported by a source.
- `neighbourhood`: documented neighbourhood/district, not a building.
- `city_approximate`: city centroid or representative point; visibly labelled approximate in UI.
- `country_only`: no city pin; show only at country level.
- `unknown`: no reliable geospatial placement.

Coordinates are WGS84 decimal degrees: latitude from -90 to 90, longitude from -180 to 180. Preserve geocoding provider, query, result ID, timestamp and source in production. A geocoder returning a point is not evidence that the company's office was there.

## Sources

For each factual claim record a URL and what it supports. Prefer official company notices, court/insolvency records, regulators and reputable reporting. Directory pages are discovery leads, not automatically sufficient proof of a legal status or exact location.
