# UML Діаграма аутентифікації та авторизації

```mermaid
sequenceDiagram
    actor Seller
    actor Customer
    actor Admin
    participant Browser as Website (Frontend)
    participant API as FastAPI Server
    participant DB as Database (users, listings)

    Seller->>Browser: Enter email & password
    Browser->>API: POST /auth/login (credentials)
    API->>DB: SELECT * FROM users WHERE email=... AND password=...
    DB-->>API: Return User(id, role="user")
    API-->>Browser: JWT token {role="user"}

    Seller->>Browser: Create new container listing
    Browser->>API: POST /listings (token, ad data)
    API->>API: Verify JWT (role="user")
    API->>DB: INSERT INTO listings (status="pending")
    API-->>Browser: Listing submitted (waiting for admin)

    Admin->>Browser: Enter email & password
    Browser->>API: POST /auth/login (credentials)
    API->>DB: SELECT * FROM users WHERE email=... AND password=...
    DB-->>API: Return User(id, role="admin")
    API-->>Browser: JWT token {role="admin"}

    Admin->>Browser: Open dashboard (pending listings)
    Browser->>API: GET /listings?status=pending (token)
    API->>API: Verify JWT (role="admin")
    API->>DB: SELECT * FROM listings WHERE status="pending"
    DB-->>API: Pending listings
    API-->>Browser: Show pending ads

    Admin->>Browser: Approve or reject ad
    Browser->>API: PATCH /listings/{id} (decision, token)
    API->>API: Verify JWT (role="admin")
    API->>DB: UPDATE listings SET status="active" OR "rejected"
    DB-->>API: Confirmation
    API-->>Browser: Return result
    Browser-->>Seller: Notify approved/rejected

    Customer->>Browser: Browse containers
    Browser->>API: GET /listings?status=active
    API->>DB: SELECT * FROM listings WHERE status="active"
    DB-->>API: Approved listings
    API-->>Browser: Show ads
