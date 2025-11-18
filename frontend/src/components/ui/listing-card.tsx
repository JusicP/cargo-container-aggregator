import type { Listing } from "@/services/api/listings";
import { Box, Card, Flex, IconButton, Link, Text } from "@chakra-ui/react";
import { ArrowUpRight } from "@mynaui/icons-react";
import container from "@/assets/container.png";

export function extractPhotoUrl(listing: Listing): string {
    const mainPhoto = listing.photos?.find(p => p.is_main) 
        ?? listing.photos?.[0];

    return mainPhoto
        ? `${import.meta.env.VITE_SERVER_URL}/user/photo/${mainPhoto.photo_id}`
        : container; // fallback
}

export function ListingCard({ listing }: { listing: Listing }) {
    const photoUrl = extractPhotoUrl(listing);

    return (
        <Card.Root
            key={listing.id}
            width="417px"
            height="277px"
            position="relative"
            overflow="hidden"
            borderRadius="10px"
            bgColor="#F5F5F5"
            border={0}
        >
            {/* Full background */}
            <Box
                position="absolute"
                inset={0}
                bgImage={`url(${photoUrl})`}
                bgSize="cover"
                bgRepeat="no-repeat"
                zIndex={0}
                margin={1}
                borderRadius="10px"
            />

            {/* Overlay */}
            <Box
                position="absolute"
                inset={0}
                zIndex={1}
            />

            <Card.Body zIndex={2}></Card.Body>

            <Card.Footer zIndex={2}>
                <Flex bgColor="#F5F5F5" width="100%" padding={3} justifyContent="space-between" borderRadius="md">
                    <Text>{listing.title}</Text>
                    {/* лінк чомусь фарбує інонку в синій колір -_- */}
                    <IconButton as={Link} size="md" paddingRight={5} paddingLeft={5} href={`/listing/${listing.id}`}><ArrowUpRight/></IconButton>
                </Flex>
            </Card.Footer>
        </Card.Root>
    );
}
