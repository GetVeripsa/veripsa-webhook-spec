from pathlib import Path
import json
from jsonschema import Draft202012Validator
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "examples/manifest.json").read_text(encoding="utf-8"))
passed = 0
for item in manifest:
    data = json.loads((root / item["file"]).read_text(encoding="utf-8"))
    schema = json.loads((root / item["schema"]).read_text(encoding="utf-8"))
    errors = list(Draft202012Validator(schema).iter_errors(data))
    # JSON Schema cannot express equality between duplicate raw GitHub fields.
    # Treat the top-level PR number as canonical and reject contradictory fixtures.
    if item["schema"].endswith("webhook-routing-event.schema.json") and isinstance(data, dict):
        nested = ((data.get("pull_request") or {}).get("number"))
        if data.get("number") is not None and nested is not None and data["number"] != nested:
            errors.append(ValueError("top-level and nested PR numbers differ"))
    expected_valid = bool(item["valid"])
    if expected_valid and errors:
        raise SystemExit(f"{item['file']} unexpectedly invalid: {errors[0]}")
    if not expected_valid and not errors:
        raise SystemExit(f"{item['file']} unexpectedly valid")
    passed += 1
print(f"validated {passed} positive/negative examples")
