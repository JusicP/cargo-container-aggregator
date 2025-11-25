import type { Listing } from "@/services/api/listings";

export const mockListings: Listing[] = [
  {
    id: 1,
    title: "40ft High Cube",
    description: "",
    container_type: "40ft",
    condition: "used",
    type: "sale",
    price: 2500,
    currency: "USD",
    location: "Одеса",
    ral_color: null,
    status: "active",
    addition_date: "2025-01-22",
    approval_date: null,
    updated_at: null,
    photos: [
      {
        photo_id: 1,
        is_main: true,
        listing_int: 1,
        uploaded_at: "2025-01-22",
      },
    ],
    analytics: {
      views: 54,
      favorites: 15,
      phone_views: 27,
    },
  },

  {
    id: 2,
    title: "20ft Standard",
    description: "",
    container_type: "20ft",
    condition: "new",
    type: "sale",
    price: 2100,
    currency: "USD",
    location: "Київ",
    ral_color: null,
    status: "active",
    addition_date: "2025-02-10",
    approval_date: null,
    updated_at: null,
    photos: [
      {
        photo_id: 2,
        is_main: true,
        listing_int: 2,
        uploaded_at: "2025-02-10",
      },
    ],
    analytics: {
      views: 33,
      favorites: 10,
      phone_views: 12,
    },
  },
];
