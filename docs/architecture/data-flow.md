# Data Flow Diagram

This document describes the data flow within the DealWise frontend application.

## Overview

We use **TanStack React Query** as the primary mechanism for managing server state. This centralizes our data fetching, caching, and synchronization logic.

```mermaid
sequenceDiagram
    participant Component
    participant ReactQuery as React Query Cache
    participant API as Backend API

    Component->>+ReactQuery: useQuery('deals', fetchDeals)
    ReactQuery-->>-Component: return { data, isLoading, isError }
    alt cache miss or stale
        ReactQuery->>+API: GET /api/deals
        API-->>-ReactQuery: Deals Data
    end
    ReactQuery-->>Component: (re-render with fresh data)
```
