# Releasing the public contract

1. Update both contract manifest versions and `package.json` together.
2. Regenerate artifacts and update `CHANGELOG.md`.
3. Run `npm ci`, `npm run check`, and `npm pack --dry-run`.
4. Merge through review.
5. The `release-public-contract` workflow reads the merged package version and creates the missing immutable `vX.Y.Z` tag plus GitHub Release. An existing tag is never moved or replaced.
6. Verify the tag resolves to the reviewed merge and the Release is public.
7. Do not claim registry availability unless a package was actually published and verified.

Schema `$id` values are tag-pinned. A released schema must never be changed in place; publish a new contract version instead.
