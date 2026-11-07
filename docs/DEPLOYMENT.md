# Deployment checklist

This repository includes a starter Next.js application. It is not a fully connected production database or complete worldwide dataset.

## Required configuration

Set environment variables in the hosting platform, not in source control:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never use `NEXT_PUBLIC_`)
- Either a restricted Google Maps browser key and configured Map ID, or the selected MapLibre tile provider configuration.
- Server-side geocoding provider credentials, if required.

Restrict map browser keys by HTTP referrer and API. Restrict server keys by IP/service where supported. Set quotas and billing alerts.

## Database

1. Create a Supabase project.
2. Enable PostGIS.
3. Apply `sql/schema.sql`.
4. Enable and test RLS for public reads and admin writes.
5. Import seed records only into a review/staging state.
6. Validate source URLs and location precision before publishing.

## Hosting

1. Connect the repository to Vercel or Netlify.
2. Configure the build command `npm run build`.
3. Add environment variables.
4. Deploy a preview and test map attribution, map key restrictions, search, mobile layouts and RLS.
5. Configure scheduled ingestion only after the sources and permissions have been reviewed.
6. Verify freshness timestamps and alerting.

## Production gate

Do not claim the website is a complete or live global bankruptcy database until source coverage, legal classifications, coordinates and scheduled refresh jobs have been independently tested. The supplied Netlify URL is a reference/live preview URL, not proof that this repository kit has been deployed there.
