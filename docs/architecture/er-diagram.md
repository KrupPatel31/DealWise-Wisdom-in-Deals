# Entity-Relationship (ER) Diagram

This document outlines the database schema for the DealWise application. It describes the core entities, their attributes, and the relationships between them.

## Diagram

```mermaid
erDiagram
    USERS {
        id UUID PK
        username VARCHAR(255)
        email VARCHAR(255) UNIQUE
        password_hash VARCHAR(255)
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    DEALS {
        id UUID PK
        title VARCHAR(255)
        description TEXT
        price DECIMAL
        original_price DECIMAL
        link URL
        image_url URL
        posted_by_id UUID FK
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    COMMENTS {
        id UUID PK
        content TEXT
        deal_id UUID FK
        user_id UUID FK
        created_at TIMESTAMP
    }

    USERS ||--o{ DEALS : "posts"
    USERS ||--o{ COMMENTS : "writes"
    DEALS ||--o{ COMMENTS : "has"
```