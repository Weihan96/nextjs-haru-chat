# Search Actions

Full-text search utilities for the AI companion chat platform using PostgreSQL.

## Features

- ✅ **Global Search** - Search across companions, users, messages, and checkpoints
- ✅ **Relevance Ranking** - Results sorted by PostgreSQL `ts_rank`
- ✅ **Privacy Aware** - Respects user permissions and public/private settings
- ✅ **Performance Optimized** - Uses PostgreSQL full-text search with proper indexes
- ✅ **Type Safe** - Full TypeScript support

## Usage Examples

### Global Search
```typescript
import { globalSearch } from "@/actions";

const results = await globalSearch("romantic girlfriend");
// Returns: { companions: [...], users: [...], messages: [...], checkpoints: [...] }
```

### Search Companions
```typescript
import { searchCompanions } from "@/actions";

const companions = await searchCompanions("friendly chatbot");
// Returns public companions + user's own companions matching the query
```

### Search Within Chat
```typescript
import { searchWithinChat } from "@/actions";

const messages = await searchWithinChat("chat_id_123", "birthday party");
// Returns messages within specific chat matching the query
```

### Search Messages Across All Chats
```typescript
import { searchMessages } from "@/actions";

const messages = await searchMessages("favorite book");
// Returns messages from user's chats matching the query
```

## Search Query Syntax

Based on PostgreSQL `plainto_tsquery`, supports:

- **Simple terms**: `romantic girlfriend`
- **Phrase matching**: `"artificial intelligence"`
- **Boolean operators**: `cat & dog` (AND), `cat | dog` (OR)
- **Negation**: `cat & !dog` (cat but not dog)
- **Prefix matching**: `roman*` (matches romantic, romance, etc.)

## Performance Notes

- Queries are limited (20-50 results) for performance
- Uses PostgreSQL indexes for fast searching
- Relevance ranking with `ts_rank` for best results first
- Excludes soft-deleted content automatically

## Security

- **User isolation**: Users only see their own private content
- **Permission checks**: Public content visibility respected
- **SQL injection safe**: Uses parameterized queries
- **Authentication**: All functions require valid user session 