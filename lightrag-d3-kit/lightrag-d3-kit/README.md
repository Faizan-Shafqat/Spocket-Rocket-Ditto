# Ditto · HubSpot SR LightRAG graph (D3)

Interactive D3.js force-directed graph for the **Spocket Rocket Ditto** LightRAG entity–relation graph stored under `cache/lightrag/`.

## Quick start (this repo)

1. Ensure the graph exists: `cache/lightrag/.lightrag_data/graph_chunk_entity_relation.graphml` (from `npm run ingest:lightrag` or your ingest flow; see `cache/lightrag/README.md`).
2. Regenerate the viewer data: from the repo root run `npm run graph:d3` (runs `scripts/graphml-to-d3-graph.cjs` and writes `lightrag-d3-kit/lightrag-d3-kit/data.json`).
3. Start Ditto: `npm run dev` (or `npm start`).
4. Open **http://localhost:3000/lightrag-graph/** in a browser.

`index.html` loads `data.json` over HTTP. Opening the HTML as `file://` will not load `data.json` in most browsers; use the URL above or a static server in `lightrag-d3-kit/lightrag-d3-kit` (for example `npx --yes serve .`).

### Optional: cap graph size

Large graphs (2000+ nodes) can be heavy in the browser. Export only the top nodes by degree:

```bash
node scripts/graphml-to-d3-graph.cjs --max-nodes 800
```

## Data format (`data.json`)

```json
{
  "nodes": [
    {
      "id": "Entity Name",
      "group": "person|organization|concept|event|artifact",
      "degree": 5,
      "desc": "Description of this entity extracted from your knowledge graph",
      "ageHours": 48,
      "isNew": false,
      "isRecent": true
    }
  ],
  "links": [
    {
      "source": "Entity A",
      "target": "Entity B",
      "weight": 3.0,
      "desc": "Description of the relationship between A and B",
      "keywords": "keyword1,keyword2,keyword3"
    }
  ]
}
```

### Node fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Entity name (unique) |
| `group` | string | Entity type — determines color. Built-in: `person`, `organization`, `concept`, `event`, `artifact`. Add custom types in the `COLORS` map in `index.html` |
| `degree` | number | Number of connections (affects node size) |
| `desc` | string | Description text shown in detail panel |
| `ageHours` | number | Hours since entity was last updated (for recency filtering) |
| `isNew` | boolean | Show green "NEW" ring/badge (< 24h) |
| `isRecent` | boolean | Recent entity (< 168h / 7 days) |

### Link fields

| Field | Type | Description |
|-------|------|-------------|
| `source` | string | Source node `id` |
| `target` | string | Target node `id` |
| `weight` | number | Relationship strength (affects line thickness) |
| `desc` | string | Relationship description shown in detail panel |
| `keywords` | string | Comma-separated keywords for the relationship |

## Features

- **Search** — Type `/` or click search bar to find entities by name or type
- **Click** a node to see its details and connections
- **Drag** nodes to pin them in place
- **Double-click** a pinned node to release it
- **Scroll** to zoom, drag background to pan
- **Filter** by "New" or "Recent" entities using toggle buttons
- **Navigate** between connected entities via the detail panel

## Customization

### Branding

Edit the header in `index.html` (logo text, subtitle) and `:root` CSS variables (accent is aligned with SR / HubSpot-style orange in this fork).

### Entity types / colors

Add or modify entity type colors in the `COLORS` constant in `index.html`:

```javascript
const COLORS = {
  person: '#4A90D9',
  organization: '#E67E22',
  concept: '#9B59B6',
  event: '#27AE60',
  artifact: '#E74C3C',
  default: '#8b949e'
};
```

The export script maps LightRAG `entity_type` values into these groups (see `mapEntityTypeToGroup` in `scripts/graphml-to-d3-graph.cjs`).

### Performance

The visualizer handles hundreds of nodes well. For very large graphs, use `--max-nodes`, filter in the export script, or tune D3 forces in `index.html` (for example `alphaDecay`, collision radius).
