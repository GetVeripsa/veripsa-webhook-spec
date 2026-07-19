# Releasing the public contract

1. Update both contract manifest versions and `package.json` together.
2. Regenerate artifacts and update `CHANGELOG.md`.
3. Run `npm ci`, `npm run check`, and `npm pack --dry-run`.
4. Merge through review.
5. Create an immutable `vX.Y.Z` Git tag and GitHub Release from the merge commit.
6. Do not claim registry availability unless a package was actually published and verified.

Schema `$id` values are tag-pinned. A released schema must never be changed in place; publish a new contract version instead.
