# Security changes — 2026-11-27

This directory records the deployed database and Edge Function changes. No administrator password, password hash, or service-role key belongs in this repository.

## Challenge board

Existing public RPC signatures are preserved. Password hashes live in the non-exposed `challenge_security` schema; the old public column remains null for `SELECT *` compatibility. Existing author passwords are migrated without resetting them. The shared administrator credential has been replaced with a randomly generated password and bcrypt cost 12 hash stored privately. The password was delivered separately to the owner.

For a fresh installation, the first migration and an administrator hash provisioned securely by the operator must be committed in the same database transaction. Insert the bcrypt hash under `challenge_security.admin_credentials.name = 'primary'`. Do not copy production credentials into migration files. An unprovisioned administrator fails closed. This migration depends on the pre-existing challenge tables and pgcrypto in the `extensions` schema; it is not a standalone database bootstrap.

Server-side global budgets: 30 administrator checks, 60 edit/delete attempts, and 120 post creations per rolling minute. Global limits can also temporarily restrict legitimate users during abuse. Anonymous SECURITY DEFINER RPCs remain intentional for the password-based board; the private schema and helper functions are not executable by anonymous users. Account-based administration is a separate future change.

## Homepage guestbook

Deploy the guestbook migration before `supabase/functions/studio-guestbook/index.ts`. The legacy RPC remains service-role-only and uses the same counters during rollout. The Edge Function is public (`verify_jwt = false`); only it holds the service-role credential and calls the protected RPC.

The endpoint limits streamed request bodies to 1,800 bytes and reading to 3 seconds, validates origin and input, and returns generic backend errors. Origin checks are not authentication. The network limiter uses an HMAC of the managed Cloudflare client address and Korean calendar date; it never stores the raw address and does not trust X-Forwarded-For. Missing or malformed client-address headers share a restrictive bucket. This requires the managed Supabase Cloudflare ingress to overwrite CF-Connecting-IP; revalidate that trust boundary when changing hosting.

Budgets: 600 requests globally and 60 per network per minute; 50 new visitor IDs per network and 5,000 globally per day; one post per network or visitor per minute, 10 per network per hour, plus a 3-second global posting interval. A shared office network shares these limits. These controls reduce abuse but are not bot-proof visitor analytics. Distributed traffic can still consume the global budget.

A database transaction lock makes checks and inserts atomic. Daily aggregates preserve existing visit totals. Visitor history and messages are retained; only transient rate-counter rows older than two days expire. Private actor hashes are excluded from public responses.

## Validation

Run `node --test tests/security/guestbook.test.mjs` for endpoint validation, subject derivation, private-data isolation, and error/rate-limit responses. Before deployment, rollback-only SQL tests verified author/admin authorization, private-schema access, public-hash removal, visit idempotency, UUID rotation resistance, network caps, and request caps. Test posts were rolled back.

Scope does not include GitHub branch protection, homepage CSP, account-based admin sign-in, or the separate event/VIP PIN workflow.
