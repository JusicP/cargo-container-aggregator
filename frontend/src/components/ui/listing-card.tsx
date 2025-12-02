import type { Listing } from "@/services/api/listings";
import { Box, Button, Card, Flex, Grid, HStack, Icon, IconButton, Link, Separator, Text, VStack } from "@chakra-ui/react";
import { ArrowUpRight, Bookmark, Click, Telephone } from "@mynaui/icons-react";
import container from "@/assets/container.png";

export function extractPhotoUrl(listing: Listing): string {
    const mainPhoto = listing.photos?.find(p => p.is_main) 
        ?? listing.photos?.[0];

    return mainPhoto
        ? `${import.meta.env.VITE_SERVER_URL}/user/photo/${mainPhoto.photo_id}`
        : container; // fallback
}

export function ListingCard({ listing, coolCard = false, onDelete }: { listing: Listing, coolCard?: boolean, onDelete?: (listing_id: number) => void}) {
    const photoUrl = extractPhotoUrl(listing);

    if (coolCard) {
        return (
            <Card.Root
                key={listing.id}
                width="548px"
                height="328px"
                position="relative"
                overflow="hidden"
                borderRadius="10px"
                bgColor="#F5F5F5"
                border={0}
            >
                <Card.Body>
                    <Flex mb={3}>
                        <Box
                            w="265px"
                            h="193px"
                            bgImage={`url(${photoUrl})`}
                            bgSize="cover"
                            bgRepeat="no-repeat"
                            margin={1}
                            borderRadius="10px"
                        />
                            <Grid
                                templateAreas={`
                                    "info price"
                                    "info stats"
                                `}
                                templateColumns="1fr auto"
                                gap={4}
                            >
                            <Box gridArea="info">
                                <Text fontWeight="bold" fontSize="lg" mb={1}>
                                    {listing.container_type}
                                </Text>
                                <Text color="gray.600" fontSize="sm">Тип: {listing.type}</Text>
                                <Text color="gray.600" fontSize="sm">Локація: {listing.location}</Text>
                                <Text color="gray.600" fontSize="sm">Дата: {listing.approval_date}</Text>
                            </Box>

                            <Box gridArea="stats" justifySelf="end" alignSelf="end">
                                <Text fontWeight="bold" fontSize="xl" textAlign="right">
                                    {listing.last_history.price} <Box as="span" fontSize="sm" color="gray.500">{listing.currency}</Box>
                                </Text>

                                <HStack color="gray.400" gap={3} fontSize="sm">
                                    <HStack gap={1}>
                                        <Text fontWeight="bold">{listing.last_history.views}</Text>
                                        <Icon><Click /></Icon>
                                    </HStack>
                                    <HStack gap={1}>
                                        <Text fontWeight="bold">{listing.last_history.favorites}</Text>
                                        <Icon><Bookmark /></Icon>
                                    </HStack>
                                    <HStack gap={1}>
                                        <Text fontWeight="bold">{listing.last_history.contacts}</Text>
                                        <Icon><Telephone /></Icon>
                                    </HStack>
                                </HStack>
                            </Box>
                        </Grid>
                    </Flex>
                    <Separator />
                </Card.Body>
                <Card.Footer justifyContent="flex-end">
                    {onDelete && (
                        <>
                            <Button>Редагувати</Button>
                            <Button color="red" variant="outline" borderColor="red" borderWidth={1} onClick={() => onDelete(listing.id)}>Видалити</Button>
                        </>
                    )}
                </Card.Footer>
            </Card.Root>
        )
    }

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
                <Flex 
                    bgColor="#f5f5f5c7" 
                    width="100%" 
                    borderRadius="md"
                    height="60px" 
                    alignItems="center"
                    px={4} 
                    gap={3}
                >
                    <Text 
                        flex="1" 
                        minW="0" 
                        title={listing.title}
                    >
                        {listing.title}
                    </Text>

                    {listing.last_history.price !== null && listing.last_history.price > 0 && (
                        <Text 
                            fontWeight="bold" 
                            whiteSpace="nowrap"
                        >
                            {listing.last_history.price} {listing.currency}
                        </Text>
                    )}

                    <IconButton as={Link} size="md" paddingRight={5} paddingLeft={5} href={`/listing/${listing.id}`}><ArrowUpRight color="white"/></IconButton>
                </Flex>
            </Card.Footer>
        </Card.Root>
    );
}
