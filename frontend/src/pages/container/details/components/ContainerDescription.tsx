import React from 'react';
import { Box, Flex, Heading, Text, Button, Grid } from '@chakra-ui/react';
import type { Listing } from '@/services/api/listings';
import { Click, Bookmark } from '@mynaui/icons-react';
import RalColorBox from '@/components/ui/ral-color-box';
import { conditionMap, containerTypes, listingTypes, containerDimensions } from '@/schemas/listingSchema';

interface ContainerDescriptionProps {
    data: Listing;
}

export const ContainerDescription: React.FC<ContainerDescriptionProps> = ({ data }) => {
    const price = data.last_history?.price || 0;
    const views = data.analytics?.views || data.last_history?.views || 0;
    const favorites = data.analytics?.favorites || data.last_history?.favorites || 0;

    return (
        <Flex direction="column" gap="24px">
            <Flex gap="16px" align="center">
                <Flex align="center" gap="6px" color="#A1A1AA">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="21px"
                        fontWeight="500"
                        lineHeight="1"
                        color="#A1A1AA"
                    >
                        {views}
                    </Text>
                    <Box as={Click} w="21px" h="21px" color="#A1A1AA" />
                </Flex>
                <Flex align="center" gap="6px" color="#A1A1AA">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="21px"
                        fontWeight="500"
                        lineHeight="1"
                        color="#A1A1AA"
                    >
                        {favorites}
                    </Text>
                    <Box as={Bookmark} w="21px" h="21px" color="#A1A1AA" />
                </Flex>
            </Flex>

            <Heading
                as="h1"
                fontFamily="'Geologica Variable', sans-serif"
                fontSize="32px"
                fontWeight="600"
                color="#18181B"
                lineHeight="1.2"
            >
                {data.title}
            </Heading>

            {data.ral_color && (
                <div className="!text-black">
                    <RalColorBox ralColorKey={data.ral_color} />
                </div>
            )}

            <Flex align="center" gap="16px" py="24px" flexWrap="wrap">
                <Flex align="baseline" gap="8px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="48px"
                        fontWeight="700"
                        color="#18181B"
                        lineHeight="1"
                    >
                        {price}
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="24px"
                        fontWeight="400"
                        color="#71717A"
                        textTransform="uppercase"
                    >
                        {data.currency}
                    </Text>
                </Flex>
                <Flex gap="12px">
                    <Button
                        bg="#FD7F16"
                        color="white"
                        px="32px"
                        py="12px"
                        borderRadius="4px"
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        _hover={{ bg: '#e65c00' }}
                        transition="background 0.3s ease"
                    >
                        Контакти
                    </Button>
                    <Button
                        bg="white"
                        color="#18181B"
                        border="1px solid #E4E4E7"
                        px="32px"
                        py="12px"
                        borderRadius="4px"
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        _hover={{ bg: '#F4F4F5' }}
                        transition="background 0.3s ease"
                    >
                        Додати в обране
                    </Button>
                </Flex>
            </Flex>

            <Grid templateColumns="repeat(4, 1fr)" gap="24px">
                <Flex direction="column" gap="4px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="14px"
                        fontWeight="400"
                        color="#A1A1AA"
                    >
                        Тип
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        color="#18181B"
                    >
                        {listingTypes[data.type] || data.type}
                    </Text>
                </Flex>
                <Flex direction="column" gap="4px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="14px"
                        fontWeight="400"
                        color="#A1A1AA"
                    >
                        Стан
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        color="#18181B"
                    >
                        {conditionMap[data.condition] || data.condition}
                    </Text>
                </Flex>
                <Flex direction="column" gap="4px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="14px"
                        fontWeight="400"
                        color="#A1A1AA"
                    >
                        Локація
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        color="#18181B"
                    >
                        {data.location}
                    </Text>
                </Flex>
                <Flex direction="column" gap="4px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="14px"
                        fontWeight="400"
                        color="#A1A1AA"
                    >
                        Тип контейнера
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        color="#18181B"
                    >
                        {containerTypes[data.container_type] || data.container_type}
                    </Text>
                </Flex>
                <Flex direction="column" gap="4px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="14px"
                        fontWeight="400"
                        color="#A1A1AA"
                    >
                        Розмір
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        color="#18181B"
                    >
                        {containerDimensions[data.dimension] || data.dimension}
                    </Text>
                </Flex>
            </Grid>

            {data.description && (
                <Box mt="24px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="14px"
                        fontWeight="400"
                        color="#A1A1AA"
                        mb="8px"
                    >
                        Опис
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="400"
                        color="#18181B"
                        whiteSpace="pre-wrap"
                    >
                        {data.description}
                    </Text>
                </Box>
            )}
        </Flex>
    );
};