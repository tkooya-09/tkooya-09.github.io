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

## Account-based administration follow-up

`changes/admin_login.sql` adds a private owner allowlist, one-time bootstrap state, audit metadata, and reversible moderation. Authenticated public RPCs call fixed-search-path private helpers; authorization checks a live Auth session (maximum age 30 minutes), confirmed non-anonymous account, and an enabled allowlist entry on every call. User-editable metadata never confers privileges. Revoking the membership or deleting the session takes effect at the next call.

The owner must register and verify an email, sign in at `/admin.html`, and prove possession of the separately delivered bootstrap password. A locked singleton row prevents concurrent claims. Five attempts per minute are allowed. A successful claim deletes the previous shared credential and permanently closes bootstrap. No production account was created during implementation. Until the owner completes setup, the previous strong-password administration remains available to avoid a lockout. Auth email delivery depends on the project's mail provider settings; the live signup/verification flow requires the owner's email and was not exercised with a real address.

The admin dashboard lists the latest 100 notes and challenge posts, supports hiding/restoring both and editing challenge posts, and does not expose visitor tokens, actor hashes or password hashes. Moderator actions retain the data and record only actor/action/record IDs in private audit storage. Direct public challenge SELECT uses RLS to omit hidden posts; the public guestbook snapshot omits hidden notes. Existing author-password edits remain supported. Credential tokens exist only in the administrator tab's memory and are removed on logout/navigation; no refresh token is persisted.

Both HTML pages now use a strict meta CSP without unsafe-inline or unsafe-eval, local scripts/styles, and no-referrer. Meta CSP cannot enforce frame-ancestors; an HTTP header would require hosting that supports configurable response headers. GitHub Actions runs seven checks with a pinned checkout action and read-only repository permissions. Repository branch protection still requires the repository administration setting to be configured separately.

## Public-content privacy review

Removed real-name occurrences and employer/department text from the homepage and README; the public brand remains the established pen name. Disabled automatic publication of new public GitHub repositories. Existing creative works, song lyrics and project titles remain published intentionally. The family webtoon still names the child and age in its description; external webtoon pages and the GitHub account can still identify the author. No telephone or email patterns were found in the reviewed homepage/catalog source. Audio metadata was separately inspected without modifying audio.

This change does not erase prior Git history, search caches, linked third-party sites, or personally identifying information embedded in the creative works themselves. Those require a separate publication/retention decision. This review covers this homepage repository and its guestbook/challenge administration, not a full security certification of every linked platform.

Public Git commit metadata also contains the owner's real-name/email attribution. Homepage redaction does not remove that metadata. Configure GitHub's private commit email for future commits; rewriting published history is outside this change and was not performed.
