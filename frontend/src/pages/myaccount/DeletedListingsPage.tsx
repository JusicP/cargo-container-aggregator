import { Box } from "@chakra-ui/react";
import ListingsGrid from "@/components/ListingsGrid";
import { useState } from "react";
import { useListings, useUpdateListingStatus } from "@/services/api/listings";
import { useAuth } from "@/contexts/AuthContext";

export default function DeletedListingsPage() {
  const {user} = useAuth();
  const [page, setPage] = useState(1);
  const { mutate: updateStatus } = useUpdateListingStatus();

  const { data, isLoading, isFetching, refetch } = useListings({
      status: "deleted",
      page,
      page_size: 4,
      user_id: user?.id
  });

  return (
    <Box>
      {!isLoading && data && (
        <ListingsGrid
          listings={data?.listings}
          onPageSet={setPage}
          pageSize={data?.page_size}
          currentPage={data?.page}
          total={data?.total}
        />
      )}
    </Box>
  );
}
