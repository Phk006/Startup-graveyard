export type FailureClassification =
  | "formal_bankruptcy" | "insolvency" | "liquidation" | "shutdown"
  | "distressed_acquisition" | "restructuring" | "product_discontinuation"
  | "business_collapse" | "unknown";

export type VerificationStatus = "unverified" | "needs_review" | "partially_verified" | "verified";
export type LocationPrecision = "exact_address" | "neighbourhood" | "city_approximate" | "country_only" | "unknown";

export interface StartupLocation {
  location_type: "founding_office" | "original_operating_location" | "historical_headquarters" | "final_headquarters" | "registered_office" | "city_reference";
  address: string | null;
  neighbourhood: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  precision: LocationPrecision;
  coordinate_source_url: string | null;
}

export interface StartupSource {
  url: string;
  title: string | null;
  publisher: string | null;
  publication_date: string | null;
  source_type: "official_filing" | "company_announcement" | "court_record" | "news_report" | "directory" | "interview" | "other";
  supports: string[];
}

export interface StartupRecord {
  id: string;
  name: string;
  aliases: string[];
  description: string | null;
  industry: string | null;
  founded_date: string | null;
  founded_year: number | null;
  failure_event_date: string | null;
  failure_classification: FailureClassification;
  founders: string[];
  locations: StartupLocation[];
  failure_summary: string | null;
  failure_causes: string[];
  verification_status: VerificationStatus;
  sources: StartupSource[];
}
