import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
records = json.loads((root / "data/startups.seed.json").read_text())
ids = [record["id"] for record in records]
assert len(ids) == len(set(ids)), "Duplicate record IDs found"
for record in records:
    assert record.get("sources"), f"{record['name']} has no source references"
    for location in record.get("locations", []):
        lat, lon = location.get("latitude"), location.get("longitude")
        assert (lat is None) == (lon is None), f"Partial coordinates: {record['name']}"
        if lat is not None:
            assert -90 <= lat <= 90 and -180 <= lon <= 180
print(f"Validated {len(records)} seed records.")
