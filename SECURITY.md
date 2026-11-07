# Security policy

## Reporting a vulnerability

Please use GitHub's **Report a vulnerability** feature under the repository Security tab for private disclosure. Do not publish secrets, API keys, personal data or exploitable details in a public issue.

## Secrets and deployment

- Never commit Supabase service-role keys, private ingestion credentials or unrestricted map keys.
- Restrict browser map keys by allowed referrers and APIs.
- Keep ingestion and administrative operations server-side.
- Use Row Level Security and least-privilege database roles.
- Rotate any credential that is accidentally exposed.
