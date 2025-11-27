import { Box, Heading } from "@chakra-ui/react";
import ListingsGrid from "@/components/ListingsGrid";
import { mockListings } from "./mockListings";

export default function ActiveListingsPage() {
  return (
    <Box>
      <Heading size="md" mb={4}>Активні оголошення</Heading>

      <ListingsGrid
        listings={mockListings.filter((l) => l.status === "active")}
        status="active"
        onEdit={(id) => console.log("edit", id)}
        onDelete={(id) => console.log("delete", id)}
      />
    </Box>
  );
}
