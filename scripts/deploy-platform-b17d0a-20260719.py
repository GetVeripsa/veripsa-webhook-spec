#!/usr/bin/env python3
"""Deploy one reviewed Platform SHA to Render, smoke it, and roll back on failure."""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

APP_URL = "https://veripsa.com"
RENDER_SERVICE_ID = "srv-d8rs58ernols73frt87g"
TARGET_SHA = "b17d0a03ccf2b282a8bcd6215b4dbba796bb7ca0"
RENDER_API = f"https://api.render.com/v1/services/{RENDER_SERVICE_ID}"
ACTIVE = {
    "created",
    "queued",
    "build_in_progress",
    "pre_deploy_in_progress",
    "update_in_progress",
    "deploying",
}
FAILED = {
    "build_failed",
    "pre_deploy_failed",
    "update_failed",
    "canceled",
    "deactivated",
    "failed",
}


def request_json(
    url: str,
    *,
    api_key: str,
    method: str = "GET",
    payload: dict[str, object] | None = None,
) -> object:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "veripsa-public-contract-release/1.0",
        },
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.loads(response.read().decode("utf-8"))


def deploy_record(value: object) -> dict[str, object]:
    if not isinstance(value, dict):
        return {}
    nested = value.get("deploy")
    return nested if isinstance(nested, dict) else value


def deploy_commit(deploy: dict[str, object]) -> str:
    commit = deploy.get("commit")
    if isinstance(commit, dict):
        value = commit.get("id")
        if isinstance(value, str):
            return value
    value = deploy.get("commitId")
    return value if isinstance(value, str) else ""


def deploy_id(deploy: dict[str, object]) -> str:
    value = deploy.get("id")
    return value if isinstance(value, str) else ""


def deploy_status(deploy: dict[str, object]) -> str:
    value = deploy.get("status")
    return value if isinstance(value, str) else "unknown"


def list_deploys(api_key: str) -> list[dict[str, object]]:
    body = request_json(f"{RENDER_API}/deploys?limit=20", api_key=api_key)
    values = body if isinstance(body, list) else []
    if isinstance(body, dict) and isinstance(body.get("deploys"), list):
        values = body["deploys"]
    return [record for value in values if (record := deploy_record(value))]


def create_deploy(api_key: str, commit: str) -> str:
    body = request_json(
        f"{RENDER_API}/deploys",
        api_key=api_key,
        method="POST",
        payload={"commitId": commit, "clearCache": "do_not_clear"},
    )
    identifier = deploy_id(deploy_record(body))
    if not identifier:
        raise RuntimeError("Render create response omitted deploy id")
    return identifier


def wait_live(api_key: str, identifier: str, expected_commit: str) -> None:
    deadline = time.monotonic() + 1800
    while time.monotonic() < deadline:
        body = request_json(f"{RENDER_API}/deploys/{identifier}", api_key=api_key)
        deploy = deploy_record(body)
        status = deploy_status(deploy)
        commit = deploy_commit(deploy)
        print(f"Render {identifier}: {status} {commit[:12]}", flush=True)
        if status == "live":
            if commit != expected_commit:
                raise RuntimeError(
                    f"Render marked the wrong commit live: {commit}, expected {expected_commit}"
                )
            return
        if status in FAILED:
            raise RuntimeError(f"Render deploy {identifier} ended as {status}")
        time.sleep(10)
    raise TimeoutError(f"Render deploy {identifier} did not become live within 30 minutes")


def fetch_page(path: str) -> tuple[str, dict[str, str]]:
    url = f"{APP_URL}{path}"
    error: Exception | None = None
    for attempt in range(8):
        try:
            request = urllib.request.Request(
                url,
                headers={"User-Agent": "veripsa-production-smoke/1.0"},
            )
            with urllib.request.urlopen(request, timeout=45) as response:
                body = response.read().decode("utf-8", errors="replace")
                headers = {key.lower(): value for key, value in response.headers.items()}
                if response.status != 200:
                    raise RuntimeError(f"{path}: HTTP {response.status}")
                return body, headers
        except Exception as exc:  # noqa: BLE001 - bounded retry and final failure
            error = exc
            if attempt != 7:
                time.sleep(3)
    raise RuntimeError(f"{path}: request failed after retries: {error}")


def require(body: str, needle: str, path: str) -> None:
    if needle not in body:
        raise AssertionError(f"{path}: missing required text {needle!r}")


def forbid(body: str, needle: str, path: str, *, casefold: bool = False) -> None:
    haystack = body.casefold() if casefold else body
    target = needle.casefold() if casefold else needle
    if target in haystack:
        raise AssertionError(f"{path}: forbidden stale text remains: {needle!r}")


def require_no_store(headers: dict[str, str], path: str) -> None:
    value = headers.get("cache-control", "")
    if "no-store" not in value.lower():
        raise AssertionError(f"{path}: expected Cache-Control no-store, got {value!r}")


def smoke() -> None:
    pages: dict[str, tuple[str, dict[str, str]]] = {}
    for path in (
        "/",
        "/support",
        "/security/disclosure",
        "/trust",
        "/ja/trust",
        "/pricing",
        "/docs/onboarding",
        "/try",
        "/status",
        "/robots.txt",
        "/updates/sitemap.xml",
    ):
        pages[path] = fetch_page(path)
        print(f"Smoke fetched {path}", flush=True)

    home = pages["/"][0]
    require(home, "pre-merge PR traffic control", "/")
    forbid(home, "GitHub-native merge control", "/")

    support = pages["/support"][0]
    require(support, "within a few business days", "/support")
    require(support, "contractual support SLA", "/support")

    disclosure = pages["/security/disclosure"][0]
    require(disclosure, "[SECURITY]", "/security/disclosure")
    forbid(disclosure, "[security]", "/security/disclosure")

    trust = pages["/trust"][0]
    require(trust, "Retention and deletion", "/trust")
    require(trust, "Rebuildable working data is short-lived", "/trust")
    require(trust, "remain until account erasure", "/trust")
    forbid(trust, "Retention is short by policy and short by construction", "/trust")

    ja_trust = pages["/ja/trust"][0]
    require(ja_trust, "保持期間と削除", "/ja/trust")
    require(ja_trust, "短期保持", "/ja/trust")
    require(ja_trust, "アカウント消去まで保持", "/ja/trust")
    forbid(ja_trust, "Paddle", "/ja/trust", casefold=True)

    require(pages["/pricing"][0], "Paused", "/pricing")
    require(pages["/docs/onboarding"][0], "Unknown", "/docs/onboarding")
    require(pages["/try"][0], "collide-a", "/try")
    require(pages["/try"][0], "collide-b", "/try")
    require(
        pages["/robots.txt"][0],
        "Sitemap: https://veripsa.com/updates/sitemap.xml",
        "/robots.txt",
    )
    require(
        pages["/updates/sitemap.xml"][0],
        "https://veripsa.com/ja/trust",
        "/updates/sitemap.xml",
    )
    require(
        pages["/updates/sitemap.xml"][0],
        "https://veripsa.com/legal/subprocessors",
        "/updates/sitemap.xml",
    )

    for path in ("/support", "/security/disclosure", "/trust", "/pricing", "/status"):
        require_no_store(pages[path][1], path)


def main() -> int:
    api_key = os.environ.get("RENDER_API_KEY", "")
    if not api_key:
        raise RuntimeError("RENDER_API_KEY is not available to this trusted workflow")

    deploys = list_deploys(api_key)
    active = [
        (deploy_id(deploy), deploy_status(deploy))
        for deploy in deploys
        if deploy_status(deploy) in ACTIVE
    ]
    if active:
        raise RuntimeError(f"active Render deploy exists: {active}")

    predecessor = next((deploy for deploy in deploys if deploy_status(deploy) == "live"), None)
    if predecessor is None:
        raise RuntimeError("no live Render predecessor; refusing unrollbackable release")
    predecessor_sha = deploy_commit(predecessor)
    predecessor_id = deploy_id(predecessor)
    if not predecessor_sha or not predecessor_id:
        raise RuntimeError("live predecessor lacks commit/deploy identity")
    print(f"Live predecessor: {predecessor_id} {predecessor_sha[:12]}", flush=True)

    mutated = predecessor_sha != TARGET_SHA
    target_deploy_id = predecessor_id
    try:
        if mutated:
            target_deploy_id = create_deploy(api_key, TARGET_SHA)
            print(f"Queued target deploy {target_deploy_id}", flush=True)
            wait_live(api_key, target_deploy_id, TARGET_SHA)
        else:
            print("Target commit is already live", flush=True)
        smoke()
    except Exception:  # noqa: BLE001 - rollback before re-raising original failure
        if mutated:
            print(f"Release failed; restoring predecessor {predecessor_sha[:12]}", flush=True)
            try:
                rollback_id = create_deploy(api_key, predecessor_sha)
                wait_live(api_key, rollback_id, predecessor_sha)
                print(f"Rollback succeeded via {rollback_id}", flush=True)
            except Exception as rollback_error:  # noqa: BLE001
                print(f"ROLLBACK FAILED: {rollback_error}", file=sys.stderr, flush=True)
        raise

    report = {
        "target_sha": TARGET_SHA,
        "deploy_id": target_deploy_id,
        "predecessor_sha": predecessor_sha,
        "production_smoke": "passed",
    }
    Path("release-report.json").write_text(
        json.dumps(report, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(report, indent=2), flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
