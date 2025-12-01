import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import type { Container } from '../mockData';

interface ContainerCardProps {
    container: Container;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
    const colorCode = container.specs?.[0] || '#204F73';

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
                <Image src={container.image} alt={container.title} w="100%" h="100%" objectFit="cover" />
            </Box>

            <Flex direction="column" gap="4px" align="center" textAlign="center">
                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="18px"
                    fontWeight="500"
                    color="#18181B"
                >
                    {container.title}
                </Text>

                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="14px"
                    fontWeight="500"
                    color="#18181B"
                >
                    Ціна: {container.price} {container.currency}
                </Text>

                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="14px"
                    fontWeight="400"
                    color="#18181B"
                >
                    Тип: sale
                </Text>

                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="14px"
                    fontWeight="400"
                    color="#18181B"
                >
                    Стан: used
                </Text>

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
            </Flex>
        </Box>
    );
};