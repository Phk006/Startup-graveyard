# Geocoding and location verification policy

1. **Do not invent coordinates.** Missing coordinates must remain null.
2. Separate founding office, operating location, registered office and headquarters. They can be different locations and dates.
3. Record the source that establishes the address independently of the geocoding result.
4. Geocode only a sourced address or sourced city. Save provider, query, provider result identifier, retrieval date and confidence.
5. `exact_address` is allowed only when a historical source establishes the specific premises and the geocoder resolves the same premises. Otherwise downgrade precision.
6. If only a city is documented, use an explicitly labelled approximate city point. Do not render it as an exact office pin.
7. If only a country is known, show a country-level count or highlighted polygon, not a fabricated office pin.
8. Preserve historical location validity dates. Do not replace an original founding place with the final headquarters.
9. Check duplicate or conflicting addresses against multiple sources. Send conflicts to human review.
10. Respect geocoding provider terms, attribution requirements, caching rules and quotas. Do not bulk-geocode through a service that prohibits it.

## UI representation

- Exact address: solid pin, label `Verified address`.
- Neighbourhood: neighbourhood marker, label `Area-level location`.
- City approximate: larger/less precise halo, label `Approximate city location`.
- Country-only / unknown: no city pin; disclose missing precision.
