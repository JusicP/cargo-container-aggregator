import { Box, Heading } from "@chakra-ui/react";
import ListingsGrid from "@/components/ListingsGrid";
import { mockListings } from "./mockListings";

export default function DeletedListingsPage() {
  return (
    <Box>
      <Heading size="md" mb={4}>Неактивні</Heading>

      <ListingsGrid
        listings={mockListings.filter((l) => l.status === "deleted")}
        status="inactive"
        onActivate={(id) => console.log("activate", id)}
        onDelete={(id) => console.log("delete", id)}
      />
    </Box>
  );
}
