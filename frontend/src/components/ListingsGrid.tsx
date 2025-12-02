import type { Listing } from "@/services/api/listings";
import { Box, ButtonGroup, Center, Flex, Grid, IconButton, Pagination } from "@chakra-ui/react";
import { ListingCard } from "./ui/listing-card";
import { ChevronLeft, ChevronRight } from "@mynaui/icons-react";

export type ListingStatus = "active" | "pending" | "rejected" | "deleted" | "inactive";

interface Props {
  listings: Listing[];
  onPageSet: (page: number) => void;
  total: number;
  currentPage: number;
  pageSize: number;
  onDelete?: (listing_id: number) => void;
}

export default function ListingsGrid({
  listings,
  onPageSet,
  total,
  currentPage,
  pageSize,
  onDelete
}: Props) {

  return (
    <Flex className="flex-col gap-6" alignItems="center">
      <Grid 
        templateColumns="repeat(2, auto)"
        gap="24px"
        bg="#F5F5F5"
        w="fit-content"
      >
          {listings.map((listing) => (
            <Box key={listing.id} w="100%"> 
              <ListingCard
                listing={listing}
                coolCard={true}
                onDelete={onDelete}
              />
            </Box>
          ))}
      </Grid>
      <Center mt="32px" mb="16px">
          <Pagination.Root 
              count={total ?? 0}
              pageSize={pageSize ?? 10}
              page={currentPage}
              onPageChange={(p) => onPageSet(p.page)}
          >
              <ButtonGroup gap="4" size="sm" variant="ghost">
                  <Pagination.PrevTrigger asChild>
                      <IconButton>
                          <ChevronLeft  />
                      </IconButton>
                  </Pagination.PrevTrigger>
                  <Pagination.PageText />
                  <Pagination.NextTrigger asChild>
                      <IconButton>
                          <ChevronRight />
                      </IconButton>
                  </Pagination.NextTrigger>
              </ButtonGroup>
          </Pagination.Root>
      </Center>
    </Flex>
  );
}
