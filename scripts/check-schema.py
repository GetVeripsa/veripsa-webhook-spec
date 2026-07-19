from pathlib import Path
import json
from jsonschema import Draft202012Validator
root = Path(__file__).resolve().parents[1]
count = 0
for path in sorted((root / "schemas").glob("*.json")):
    schema = json.loads(path.read_text(encoding="utf-8"))
    Draft202012Validator.check_schema(schema)
    if f"/v{json.loads((root/'contract/check-states.json').read_text())['contractVersion']}/" not in schema.get("$id", ""):
        raise SystemExit(f"{path}: $id is not version-pinned")
    count += 1
print(f"validated {count} draft-2020-12 schemas")
