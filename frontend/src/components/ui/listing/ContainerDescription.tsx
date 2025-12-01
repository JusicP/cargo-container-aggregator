import React from 'react';
import { Box, Flex, Heading, Text, Button, Grid } from '@chakra-ui/react';
import type { Container } from './mockData';
// Імпорт іконок з MynaUI (встанови: npm install @mynaui/icons-react)
import { Click, Bookmark } from '@mynaui/icons-react';

interface ContainerDescriptionProps {
    data: Container;
}

export const ContainerDescription: React.FC<ContainerDescriptionProps> = ({ data }) => {
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
                        {data.specifications?.clicks || 54}
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
                        {data.specifications?.saves || 13}
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

            <Flex flexWrap="wrap" gap="8px">
                {data.colors?.map((color, index) => (
                    <Flex
                        key={index}
                        align="center"
                        gap="6px"
                        px="12px"
                        py="6px"
                        bg="#F5F5F5"
                        borderRadius="4px"
                    >
                        <Box
                            w="16px"
                            h="16px"
                            borderRadius="2px"
                            border="1px solid rgba(0, 0, 0, 0.1)"
                            bg={color}
                        />
                        <Text
                            fontFamily="'Geologica Variable', sans-serif"
                            fontSize="14px"
                            fontWeight="400"
                            color="#52525B"
                        >
                            {color}
                        </Text>
                    </Flex>
                ))}
            </Flex>

            <Flex align="center" gap="16px" py="24px" flexWrap="wrap">
                <Flex align="baseline" gap="8px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="48px"
                        fontWeight="700"
                        color="#18181B"
                        lineHeight="1"
                    >
                        {data.price}
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
                    Орендувати
                </Button>
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
                        sale
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
                        {data.condition}
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
                        Тип конейнера
                    </Text>
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        color="#18181B"
                    >
                        {data.type}
                    </Text>
                </Flex>
            </Grid>
        </Flex>
    );
};