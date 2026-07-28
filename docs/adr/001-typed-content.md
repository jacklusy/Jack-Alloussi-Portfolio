# ADR 001: Typed content modules instead of a CMS

## Status

Accepted

## Context

The portfolio must be a work sample. Content changes infrequently and must be reviewable in PRs. Invented CMS complexity would dilute the engineering signal.

## Decision

Store all site content as TypeScript modules validated by Zod. Fail the build on schema violations.

## Consequences

- Content is type-checked and diffable.
- No runtime database or admin UI to maintain.
- Non-developers cannot edit copy without a PR (acceptable for this brief).
