import { Box } from "@chakra-ui/react";
import ListingsGrid from "@/components/ListingsGrid";
import { useState } from "react";
import { useListings, useUpdateListingStatus } from "@/services/api/listings";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingListingsPage() {
  const {user} = useAuth();
  const [page, setPage] = useState(1);
  const { mutate: updateStatus } = useUpdateListingStatus();

  const { data, isLoading, isFetching, refetch } = useListings({
      status: "pending",
      page,
      page_size: 4,
      user_id: user?.id
  });

  const onDelete = (listingId: number) => {
    updateStatus({listingId: listingId, status: "deleted"})
  }

  return (
    <Box>
      {!isLoading && data && (
        <ListingsGrid
          listings={data?.listings}
          onPageSet={setPage}
          pageSize={data?.page_size}
          currentPage={data?.page}
          total={data?.total}
          onDelete={onDelete}
        />
      )}
    </Box>
  );
}
