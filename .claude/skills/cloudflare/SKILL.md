---
name: cloudflare
description: Comprehensive Cloudflare platform skill covering Workers, Pages, storage (KV, D1, R2), AI (Workers AI, Vectorize, Agents SDK). Use for any Cloudflare development task.
references:
  - workers
  - pages
  - d1
  - durable-objects
  - workers-ai
---

# Cloudflare Platform Skill

Consolidated skill for building on the Cloudflare platform.

## Reference File Structure

Each product in `./references/<product>/` contains a `README.md` as entry point.

**Multi-file format:**
| File | Purpose |
|------|---------|
| `README.md` | Overview, when to use, getting started |
| `api.md` | Runtime API, types, method signatures |
| `configuration.md` | wrangler.toml, bindings, setup |
| `patterns.md` | Common patterns, best practices |
| `gotchas.md` | Pitfalls, limitations, edge cases |

**Single-file format:** All information in `README.md`.

## Product Index

### Compute & Runtime
| Product | Path |
|---------|------|
| Workers | `./references/workers/` |
| Pages | `./references/pages/` |
| Pages Functions | `./references/pages-functions/` |
| Durable Objects | `./references/durable-objects/` |
| Workflows | `./references/workflows/` |
| Cron Triggers | `./references/cron-triggers/` |
| Smart Placement | `./references/smart-placement/` |
| Workerd | `./references/workerd/` |

### Storage & Data
| Product | Path |
|---------|------|
| KV | `./references/kv/` |
| D1 | `./references/d1/` |
| R2 | `./references/r2/` |
| R2 Data Catalog | `./references/r2-data-catalog/` |
| R2 SQL | `./references/r2-sql/` |
| DO Storage | `./references/do-storage/` |
| Queues | `./references/queues/` |
| Secrets Store | `./references/secrets-store/` |
| Hyperdrive | `./references/hyperdrive/` |

### AI & Machine Learning
| Product | Path |
|---------|------|
| Workers AI | `./references/workers-ai/` |
| Vectorize | `./references/vectorize/` |
| AI Gateway | `./references/ai-gateway/` |
| AI Search | `./references/ai-search/` |

### Developer Tools
| Product | Path |
|---------|------|
| Wrangler | `./references/wrangler/` |
| Miniflare | `./references/miniflare/` |
| C3 | `./references/c3/` |
| Observability | `./references/observability/` |
| Analytics Engine | `./references/analytics-engine/` |
| Web Analytics | `./references/web-analytics/` |

### Other
| Product | Path |
|---------|------|
| Bindings | `./references/bindings/` |
| Static Assets | `./references/static-assets/` |
| API | `./references/api/` |
| API Shield | `./references/api-shield/` |