import type { Listing } from "@/services/api/listings";
import AdvertisementCard from "./AdvertisementCard";
import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

export type ListingStatus = "active" | "pending" | "rejected" | "deleted" | "inactive";

interface Props {
  listings: Listing[];
  status: ListingStatus;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onActivate?: (id: number) => void;
}

export default function ListingsGrid({
  listings,
  status,
  onEdit,
  onDelete,
  onActivate,
}: Props) {
  const [page, setPage] = useState(1);
  const perPage = 4;

  const totalPages = Math.ceil(listings.length / perPage);
  const start = (page - 1) * perPage;
  const visibleListings = listings.slice(start, start + perPage);

  return (
    <Box className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        {visibleListings.map((listing) => (
          <AdvertisementCard
            key={listing.id}
            listing={listing}
            status={status}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          ‹
        </Button>

        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            onClick={() => setPage(idx + 1)}
            variant={page === idx + 1 ? "solid" : "outline"}
          >
            {idx + 1}
          </Button>
        ))}

        <Button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          ›
        </Button>
      </div>
    </Box>
  );
}
