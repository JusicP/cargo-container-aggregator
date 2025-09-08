# To be adjusted...
```mermaid
erDiagram
    USER {
      uuid id
      string name
      string email
      string password
      enum role "user|admin"
      datetime registration_date
      enum status "active|suspended|blocked"
      string phone_number "optional"
      string company_name "optional (seller)"
    }

    LISTING {
      uuid id
      uuid user_id "seller"
      string title
      text description
      enum container_type "20ft|40ft|40hc|reefer|tank|other"
      enum condition "new|used"
      enum listing_type "sale|rent"
      decimal price
      enum currency "USD|EUR|UAH"
      string location
      datetime date_added
      datetime updated_at
      enum source "own|external"
      string original_url "if external"
      enum status "active|pending|rejected|deleted"
      int views_count
      int contacts_count
    }

    FAVORITE {
      uuid id
      uuid user_id "buyer"
      uuid listing_id
      datetime date_added
      unique user_listing "user_id+listing_id"
    }

    PARSERJOB {
      uuid id
      string company_name
      string url
      datetime last_started_at
      datetime last_finished_at
      enum status "idle|running|success|error"
      int imported_count
      text error_message "optional"
    }

    ANALYTICS {
      string id "or composite key"
      enum container_type "as in Listing"
      decimal average_price
      json price_trend "JSON/API"
      json regional_availability
      int active_listings
      datetime updated_at
    }

    %% Logical/Virtual view (ETL cache)
    CATALOG {
      string normalized_name
      decimal average_price
      int listings_count
    }

    %% Relations
    USER ||--o{ LISTING : "seller 1–N"
    USER ||--o{ FAVORITE : "buyer 1–N"
    FAVORITE }o--|| LISTING : "many-to-one"
    PARSERJOB ||--o{ LISTING : "1–N (external)"
    LISTING }o--|| ANALYTICS : "feeds (active only)"
```
