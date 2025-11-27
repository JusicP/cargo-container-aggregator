import { Box, Heading } from "@chakra-ui/react";
import ListingsGrid from "@/components/ListingsGrid";
import { mockListings } from "./mockListings";

export default function RejectedListingsPage() {
  return (
    <Box>
      <Heading size="md" mb={4}>Відхилені</Heading>

      <ListingsGrid
        listings={mockListings.filter((l) => l.status === "rejected")}
        status="rejected"
        onEdit={(id) => console.log("edit", id)}
        onDelete={(id) => console.log("delete", id)}
      />
    </Box>
  );
}
