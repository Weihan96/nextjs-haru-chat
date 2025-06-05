# Search Hooks with React Query

This directory contains React Query hooks for integrating with the search server actions.

## Files

### `useSearch.ts`

Provides React Query hooks for all search functionality with optimized caching and loading states.

## Available Hooks

### Global Search
```typescript
import { useGlobalSearch } from '@/hooks/useSearch';

const { data, isLoading, error } = useGlobalSearch('search query');
```

### Individual Search Functions
```typescript
import { 
  useSearchCompanions,
  useSearchUsers, 
  useSearchMessages,
  useSearchCheckpoints 
} from '@/hooks/useSearch';

// Search specific content types
const companions = useSearchCompanions('friendly AI');
const users = useSearchUsers('John');
const messages = useSearchMessages('birthday party');
const checkpoints = useSearchCheckpoints('save point');
```

### Chat-Specific Search
```typescript
import { useSearchWithinChat } from '@/hooks/useSearch';

const { data: messages } = useSearchWithinChat('chat-id-123', 'search term');
```

### Debounced Search
```typescript
import { useDebouncedGlobalSearch } from '@/hooks/useSearch';

// Automatically debounces the query for real-time search
const { data, isLoading } = useDebouncedGlobalSearch(inputValue, 500);
```

### Recent Searches Management
```typescript
import { useRecentSearches } from '@/hooks/useSearch';

const { 
  recentSearches, 
  addRecentSearch, 
  removeRecentSearch, 
  clearRecentSearches 
} = useRecentSearches();
```

## Features

- ✅ **Automatic Caching** - Results cached for 2-5 minutes depending on content type
- ✅ **Loading States** - Built-in loading and error states
- ✅ **Debounced Search** - Prevents excessive API calls during typing
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Error Handling** - Automatic retry logic for network failures
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Local Storage** - Recent searches persisted locally

## Query Keys

React Query uses structured query keys for efficient caching:

```typescript
['search', 'global', query]           // Global search
['search', 'companions', query]      // Companion search
['search', 'users', query]           // User search
['search', 'messages', query]        // Message search
['search', 'checkpoints', query]     // Checkpoint search
['search', 'chat', chatId, query]    // Chat-specific search
```

## Configuration

Query defaults are configured in `src/providers/query-provider.tsx` following TanStack Query SSR best practices:

- **Global Stale Time**: 1 minute (SSR-optimized default)
- **Individual Hook Stale Times**: 
  - Messages/Chat Search: 1 minute (dynamic content)
  - Global/Companions/Users/Checkpoints: 2-5 minutes (stable content)
- **Cache Time (gcTime)**: 30 minutes
- **Retry Logic**: Max 2 retries, skip 4xx errors
- **Refetch on Window Focus**: Disabled
- **SSR Pattern**: Separate server/browser QueryClient instances to prevent hydration mismatches

## SSR Optimizations

The QueryProvider follows the [TanStack Query Advanced SSR guide](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr):

- Uses `isServer` utility for server/client detection
- Creates new QueryClient on server, reuses on browser
- Avoids `useState` for QueryClient initialization to prevent Suspense issues
- Minimum 1-minute stale time to prevent immediate refetching on hydration

## Components Using These Hooks

- `SearchBar` - Global search with suggestions
- `SearchResults` - Search results page  
- `ChatSearch` - In-chat message search

## Performance Notes

- Search queries with less than 2 characters are disabled
- Results are limited server-side (20-100 items)
- Debouncing prevents API spam during real-time search
- Stale-while-revalidate strategy for better UX
- SSR-optimized to prevent hydration mismatches