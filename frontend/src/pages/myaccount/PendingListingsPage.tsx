import { Box, Heading } from "@chakra-ui/react";
import ListingsGrid from "@/components/ListingsGrid";
import { mockListings } from "./mockListings";

export default function PendingListingsPage() {
  return (
    <Box>
      <Heading size="md" mb={4}>Очікуючі</Heading>

      <ListingsGrid
        listings={mockListings.filter((l) => l.status === "pending")}
        status="pending"
        onDelete={(id) => console.log("delete", id)}
      />
    </Box>
  );
}
