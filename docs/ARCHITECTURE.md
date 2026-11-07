# Suggested architecture

## Application

- Next.js App Router + TypeScript.
- Map-first page with search, map filters, clustered markers and a persistent map instance.
- Company detail panel layered over the map; preserve viewport and selected feature when panel opens/closes.
- Timeline and editorial case-study route for longer histories.
- Responsive keyboard and touch interactions; no hover-only controls.

## Mapping

Choose **one** provider initially:

- Google Maps JavaScript API with a configured Map ID and restricted browser key, or
- MapLibre GL JS with a licensed vector tile provider.

Do not mix map vendors without a clear product reason. Clearly show attribution required by the selected map/tile provider. Use clustering at global zoom and progressively reveal individual records as users zoom in.

## Backend

- Supabase PostgreSQL with PostGIS.
- Server-side API routes or Edge Functions for read/write access.
- Public client uses anon key with Row Level Security. Service-role key stays server-side only.
- Admin review queue for source, classification and location verification.
- Scheduled ingestion jobs write candidates, not automatically verified public facts.

## Data model

Use the SQL starter schema. A startup may have multiple locations and multiple events. This avoids overwriting founding location with a later head office, or collapsing announcement, filing and shutdown dates into one field.

## Quality and performance

- Query records by bounding box and zoom level; cluster at low zoom.
- Index spatial columns with GiST.
- Paginate search results and debounce geocoding/search requests.
- Cache permitted source metadata while respecting provider policies.
- Log ingestion decisions and provide a reversible import process.
- Do not load every global marker and article into the browser at once.
