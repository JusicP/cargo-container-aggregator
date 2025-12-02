import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import type { Listing } from '@/services/api/listings';
import { conditionMap, listingTypes } from '@/schemas/listingSchema';

interface ContainerCardProps {
    container: Listing;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
    // Отримуємо головне фото або перше доступне
    const mainPhoto = container.photos?.find(photo => photo.is_main) || container.photos?.[0];
    const imageUrl = mainPhoto?.photo_url || `/api/photos/${mainPhoto?.photo_id}` || '/placeholder-image.jpg';

    const colorCode = container.ral_color || '#204F73';

    return (
        <Box
            bg="transparent"
            borderRadius="0"
            cursor="pointer"
            px="16px"
            position="relative"
            _after={{
                content: '""',
                position: 'absolute',
                right: 0,
                top: '45%',
                bottom: '45%',
                width: '6px',
                bg: '#E5E5E5',
            }}
            _last={{
                _after: {
                    display: 'none',
                }
            }}
        >
            <Box w="155px" h="100px" overflow="hidden" borderRadius="8px" mx="auto" mb="16px">
                <Image
                    src={imageUrl}
                    alt={container.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallbackSrc="/placeholder-image.jpg"
                />
            </Box>

            <Flex direction="column" gap="4px" align="center" textAlign="center">
                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="18px"
                    fontWeight="500"
                    color="#18181B"
                    noOfLines={2}
                >
                    {container.title}
                </Text>

                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="14px"
                    fontWeight="500"
                    color="#18181B"
                >
                    Ціна: {container.last_history?.price || 0} {container.currency}
                </Text>

                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="14px"
                    fontWeight="400"
                    color="#18181B"
                >
                    Тип: {listingTypes[container.type] || container.type}
                </Text>

                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="14px"
                    fontWeight="400"
                    color="#18181B"
                >
                    Стан: {conditionMap[container.condition] || container.condition}
                </Text>

                {container.ral_color && (
                    <Flex align="center" gap="6px" mt="4px">
                        <Box
                            w="16px"
                            h="16px"
                            borderRadius="2px"
                            flexShrink={0}
                            bg={colorCode}
                        />
                        <Text
                            fontFamily="'Geologica Variable', sans-serif"
                            fontSize="12px"
                            fontWeight="400"
                            color="#52525B"
                        >
                            {colorCode}
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};