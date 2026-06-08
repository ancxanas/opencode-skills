---
render_with_liquid: false
---
{% raw %}
----|---

-|----- |
| `get_user()` | `fetch_user()` | Async now |
| `delete_user()` | `remove_user()` | Returns Promise |

## Deprecation Timeline
- v1.x: Supported until Dec 2025
- v2.0: Released Jan 2025
- v2.1: Current (June 2025)
```

## Search Implementation

### Algolia DocSearch

```html
<!-- Add to theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@docsearch/css@3" />

<script src="https://cdn.jsdelivr.net/npm/@docsearch/js@3"></script>
<script>
  docsearch({
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_API_KEY',
    indexName: 'your_index',
    container: '#docsearch',
  });
</script>
```

### Local Search (Lunr.js)

```javascript
const idx = lunr(function() {
  this.ref('id');
  this.field('title', { boost: 10 });
  this.field('content');

  documents.forEach(doc => this.add(doc));
});

// Search
const results = idx.search('authentication');
```

## Documentation Testing

### Link Checking

```bash
# linkcheck (Python)
pip install linkchecker
linkchecker http://localhost:3000/docs

# broken-link-checker (Node)
npm install -g broken-link-checker
blc http://localhost:3000 -ro
```

### Code Example Testing

```python
# doctest for Python examples
"""
>>> add(2, 3)
5
>>> add(-1, 1)
0
"""

# Run tests
python -m doctest -v docs/*.md
```

```javascript
// Jest for TypeScript examples
// Extract code blocks and test
import { runExamples } from './test-docs';

test('API examples work', async () => {
  const examples = extractExamples('./docs/api.md');
  await expect(runExamples(examples)).resolves.toBeTruthy();
});
```

## Performance Optimization

### Build Optimization

```javascript
// Webpack/Vite config
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },

  optimizeDeps: {
    include: ['prismjs'],
  },
};
```

### CDN & Caching

```nginx
# nginx.conf
location /docs {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
  expires 1h;
  add_header Cache-Control "public, must-revalidate";
}
```

## Analytics Integration

### Google Analytics

```javascript
// Docusaurus
gtag: {
  trackingID: 'G-XXXXXXXXXX',
  anonymizeIP: true,
},
```

### Custom Analytics

```javascript
// Track search queries
function trackSearch(query, results) {
  analytics.track('docs_search', {
    query,
    resultCount: results.length,
    timestamp: new Date(),
  });
}
```

## Quick Reference

| Tool | Best For | Tech Stack |
|------|----------|-----------|
| Docusaurus | React projects, versioning | React, MDX |
| MkDocs | Python projects, simple setup | Python, Jinja2 |
| VitePress | Vue projects, fast builds | Vue, Vite |
| Nextra | Next.js integration | React, Next.js |
| Mintlify | Modern UI, AI search | React |

| Search Solution | Cost | Features |
|----------------|------|----------|
| Algolia DocSearch | Free (OSS) | Fast, typo-tolerant |
| Local (Lunr.js) | Free | Offline, no server |
| Typesense | Free (self-host) | Privacy-focused |
| Meilisearch | Free (self-host) | Fast, relevance |
{% endraw %}
