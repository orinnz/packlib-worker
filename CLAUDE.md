## Getting Started

Read [README.md](./README.md) for architecture, workflow, and best practices.

## Code Style

- Prefer early return/continue over nested conditionals. Symptom: existence of `else`
- Never use `as` type assertions - use type guards or narrowing instead
- Never use non-null assertions (`!`) - use proper null checks
- Avoid obvious comments

## Type Safety

- Always write strong, type-safe code
- Use `pnpm`

## Verification

- Always check mcp__ide__getDiagnostics after each edit
- Don't assume the code works without verifying diagnostics are clean

## Wrangler/Cloudflare Safety

- NEVER execute wrangler commands with `--remote` flag (production database)
- User will manually execute all wrangler commands for production safety
- Provide wrangler commands as documentation only, not for execution

## Technical Accuracy

- Always cite official documentation, GitHub issues, or reliable sources when making technical claims
- Never assume infrastructure behavior without checking documentation
- When uncertain about tech stack/framework behavior, search for and cite sources before proceeding
- Include source URLs using markdown hyperlinks in responses

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Cloudflare Queues

- Individual `msg.ack()`/`msg.retry()` takes precedence over `batch.ackAll()`/`batch.retryAll()`
- `batch.ackAll()` at end is valid pattern - catches any unhandled messages
- For batch processing with chunks: ack per chunk after success, let failed chunks auto-retry
- Use `shouldRetryQueueError(err, additionalNonRetryable?)` from `hxxp/error.ts` for consistent error handling
- Default non-retryable: `Exist`, `Invalid`, `Validation`. Add `NotExist` for R2 file operations.

## D1 Limits

- Max 100 bound parameters per query
- For bulk inserts: chunk size = floor(100 / columns). E.g., 14 columns → max 7 rows, use 6 for safety margin.

## Code Review Approach

- Trace actual code paths before claiming issues - understand business logic first
- Avoid false positives - ask for context if uncertain about design intent
- Check if "issues" are actually handled elsewhere (dedup, idempotency, DLQ refunds)