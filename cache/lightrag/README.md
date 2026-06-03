# LightRAG — HubSpot / SR knowledge cache

This folder holds **source knowledge** extracted from `hubspot-sr-claude-skills` for ingestion into [LightRAG](https://github.com/HKUDS/LightRAG) (or compatible pipelines).

## Layout

| Path | Purpose |
|------|---------|
| `source/*.md` | **Chunked text** — edit here; ingest these into LightRAG |
| `.lightrag_data/` | **Runtime cache** — graph, KV stores, vectors (created by LightRAG after ingest; optional to gitignore) |

## Ingestion

1. Point your LightRAG worker at `source/` (or concatenate chunks into one doc).
2. Run your project’s normal ingest command so LightRAG writes `graph_chunk_entity_relation.graphml`, `kv_store_*.json`, `vdb_*.json`, etc. under `.lightrag_data/`.

Do **not** hand-edit GraphML / vector JSON unless you know the exact schema LightRAG expects.

## Updating knowledge

When `hubspot-sr-claude-skills` changes, refresh the `source/` markdown files (or re-export from the repo) and **re-ingest**.
