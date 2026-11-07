"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map, Marker } from "maplibre-gl";
import rawRecords from "@/data/startups.seed.json";
import type { StartupRecord } from "@/src/types";

const records = rawRecords as StartupRecord[];

function pointFor(record: StartupRecord) {
  return record.locations.find((location) => location.latitude !== null && location.longitude !== null) ?? null;
}

export default function GlobalAtlas() {
  const mapHost = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRefs = useRef<Marker[]>([]);
  const [selected, setSelected] = useState<StartupRecord | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [MarkerCtor, setMarkerCtor] = useState<typeof import("maplibre-gl").Marker | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleRecords = useMemo(() => records.filter((record) => {
    const matchesQuery = `${record.name} ${record.industry ?? ""} ${record.locations.map((l) => `${l.city ?? ""} ${l.country ?? ""}`).join(" ")}`
      .toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || record.failure_classification === category;
    return matchesQuery && matchesCategory;
  }), [query, category]);

  useEffect(() => {
    let cancelled = false;
    let createdMap: Map | null = null;
    if (!mapHost.current || mapRef.current) return;

    import("maplibre-gl").then(({ default: maplibregl, Marker: MarkerClass }) => {
      if (cancelled || !mapHost.current) return;
      const map = new maplibregl.Map({
        container: mapHost.current,
        style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: [18, 18],
        zoom: 1.45,
        minZoom: 1.2,
        maxZoom: 17,
        pitch: 0,
        attributionControl: true,
        cooperativeGestures: true
      });
      createdMap = map;
      mapRef.current = map;
      setMarkerCtor(() => MarkerClass);
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "bottom-right");
      map.once("load", () => {
        if (!cancelled) setMapReady(true);
      });
    }).catch((error: unknown) => {
      console.error("Unable to initialise the map renderer", error);
    });

    return () => {
      cancelled = true;
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      createdMap?.remove();
      if (mapRef.current === createdMap) mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !MarkerCtor) return;
    const renderMarkers = () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      visibleRecords.forEach((record) => {
        const location = pointFor(record);
        if (!location || location.latitude === null || location.longitude === null) return;
        const element = document.createElement("button");
        element.type = "button";
        element.className = `startup-pin ${record.verification_status === "verified" ? "is-verified" : "is-review"}`;
        element.setAttribute("aria-label", `Open ${record.name}; ${location.precision.replaceAll("_", " ")}`);
        element.title = `${record.name} · ${location.precision.replaceAll("_", " ")}`;
        element.addEventListener("click", () => {
          setSelected(record);
          map.flyTo({ center: [location.longitude as number, location.latitude as number], zoom: location.precision === "exact_address" ? 14 : location.precision === "neighbourhood" ? 11 : 8.5, duration: 1500, essential: true });
        });
        const marker = new MarkerCtor({ element, anchor: "bottom" })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map);
        markerRefs.current.push(marker);
      });
    };
    if (map.isStyleLoaded()) renderMarkers();
    else map.once("load", renderMarkers);
    return () => { map.off("load", renderMarkers); };
  }, [visibleRecords, mapReady, MarkerCtor]);

  const openRecord = (record: StartupRecord) => {
    setSelected(record);
    const location = pointFor(record);
    if (location && location.latitude !== null && location.longitude !== null) {
      mapRef.current?.flyTo({ center: [location.longitude, location.latitude], zoom: 8.5, duration: 1500, essential: true });
    }
  };

  return (
    <main className="atlas-shell">
      <div ref={mapHost} className="map-canvas" aria-label="Interactive map of startup failure locations" />
      <header className="topbar">
        <a className="brand" href="#home" aria-label="The Graveyard home">
          <span className="brand-mark">G.</span>
          <span><strong>THE GRAVEYARD</strong><small>GLOBAL STARTUP FAILURE ATLAS</small></span>
        </a>
        <div className="search-wrap">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, cities or industries" aria-label="Search companies, cities or industries" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
          {query && <div className="search-results">{visibleRecords.slice(0, 6).map((record) => <button type="button" key={record.id} onClick={() => openRecord(record)}><strong>{record.name}</strong><span>{record.industry ?? "Industry not recorded"} · {record.failure_event_date?.slice(0, 4) ?? "Year unknown"}</span></button>)}{visibleRecords.length === 0 && <p>No matching records in the current dataset.</p>}</div>}
        </div>
        <button className="icon-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>Filters <span>☷</span></button>
      </header>

      {menuOpen && <section className="filter-popover" aria-label="Failure filters">
        <div className="popover-title"><strong>Filter events</strong><button type="button" onClick={() => { setCategory("all"); setMenuOpen(false); }}>Done</button></div>
        {[['all', 'All classifications'], ['formal_bankruptcy', 'Formal bankruptcy'], ['insolvency', 'Insolvency'], ['liquidation', 'Liquidation'], ['shutdown', 'Company shutdown'], ['distressed_acquisition', 'Distressed acquisition'], ['restructuring', 'Restructuring'], ['product_discontinuation', 'Product discontinued']].map(([value, label]) => <label className="filter-option" key={value}><input type="radio" name="classification" checked={category === value} onChange={() => setCategory(value)} />{label}</label>)}
      </section>}

      <aside className="left-rail">
        <div className="rail-heading"><span className="live-dot" /> HISTORICAL ARCHIVE</div>
        <h1>Every failure<br />leaves a mark.</h1>
        <p>Explore documented startup shutdowns, insolvencies and business failures from across the world.</p>
        <div className="rail-stats"><div><strong>{records.length}</strong><span>Seed records</span></div><div><strong>2000–26</strong><span>Coverage window</span></div></div>
        <div className="rail-note">This is a starter archive. Records marked for review are not confirmed legal findings.</div>
      </aside>

      <div className="map-hint"><span className="hint-key">＋</span> Zoom to explore <span className="hint-separator">·</span> Select a marker for its story</div>

      <footer className="bottom-bar">
        <div className="legend"><span><i className="legend-dot verified" /> Verified</span><span><i className="legend-dot review" /> Needs review</span></div>
        <span className="map-attribution-note">Map tiles © CARTO · © OpenStreetMap contributors</span>
        <span className="record-count">{visibleRecords.length} records in local seed dataset</span>
      </footer>

      {selected && <>
        <button className="drawer-backdrop" type="button" aria-label="Close company details" onClick={() => setSelected(null)} />
        <aside className="detail-drawer" aria-label={`${selected.name} details`}>
          <div className="drawer-head"><span>COMPANY RECORD</span><button type="button" onClick={() => setSelected(null)} aria-label="Close details">×</button></div>
          <div className="drawer-content">
            <div className="eyebrow">{selected.industry ?? "Industry not recorded"}</div>
            <h2>{selected.name}</h2>
            <p className="summary">{selected.description ?? selected.failure_summary}</p>
            <div className="status-line"><span className="status-pill">{selected.failure_classification.replaceAll("_", " ")}</span><span className="review-pill">{selected.verification_status.replaceAll("_", " ")}</span></div>
            <div className="detail-grid"><div><small>Founded</small><strong>{selected.founded_year?.toString() ?? selected.founded_date?.slice(0, 4) ?? "Not recorded"}</strong></div><div><small>Failure event</small><strong>{selected.failure_event_date ?? "Not recorded"}</strong></div></div>
            <section className="drawer-section"><h3>Why it failed</h3>{selected.failure_causes.length ? <ul>{selected.failure_causes.map((cause) => <li key={cause}>{cause}</li>)}</ul> : <p>Failure analysis requires further research.</p>}</section>
            <section className="drawer-section"><h3>Location history</h3>{selected.locations.map((location, index) => <div className="location-card" key={`${selected.id}-${index}`}><strong>{[location.city, location.region, location.country].filter(Boolean).join(", ") || "Location unavailable"}</strong><span>{location.location_type.replaceAll("_", " ")} · {location.precision.replaceAll("_", " ")}</span>{location.latitude !== null && location.longitude !== null && <code>{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</code>}</div>)}</section>
            <section className="drawer-section"><h3>Sources</h3>{selected.sources.map((source) => <a className="source-link" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title ?? source.publisher ?? source.url}<span>↗</span></a>)}</section>
            <div className="disclaimer">Research status: {selected.verification_status}. Confirm all dates, legal classifications and location evidence before treating this record as verified.</div>
          </div>
        </aside>
      </>}
    </main>
  );
}
