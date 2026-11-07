# Contributing

Thank you for helping improve THE GRAVEYARD.

## Before opening a pull request

- Search for an existing company record before adding a new one.
- Use a stable ID and preserve known aliases.
- Add source URLs for the failure event, classification and location claims.
- Keep shutdown, insolvency, bankruptcy, liquidation, acquisition and product discontinuation distinct.
- Record uncertainty explicitly; use null for facts that are not established.
- Never invent exact addresses or coordinates.

## Data contributions

See `docs/DATA_COLLECTION.md`, `docs/DATA_DICTIONARY.md` and `docs/GEOCODING_POLICY.md`.

A data correction should include:
1. Company name and record ID.
2. Field being corrected.
3. Evidence URL and publication date, where available.
4. Why the evidence supports the correction.
5. Whether the location is exact, neighbourhood-level or city-approximate.

Do not paste full copyrighted articles into the repository. Add concise original summaries and source links.

## Code contributions

- Keep map rendering separate from UI state where practical.
- Preserve the map viewport when opening and closing a company drawer.
- Add tests or validation for data and core interactions.
- Run `npm run validate:data`, `npm run typecheck`, `npm run lint` and `npm run build` before requesting review.
- Never commit secrets or credentials.
