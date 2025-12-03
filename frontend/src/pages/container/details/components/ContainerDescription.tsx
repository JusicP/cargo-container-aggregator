import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Grid, useTabs } from '@chakra-ui/react';
import { Click, Bookmark, BookmarkCheck } from '@mynaui/icons-react';
import RalColorBox from '@/components/ui/ral-color-box';
import { conditionMap, listingTypes, containerTypes, containerDimensions } from '@/schemas/listingSchema';
import type { Listing } from '@/services/api/listings';

interface ContainerDescriptionProps {
    data: Listing;
}

export const ContainerDescription: React.FC<ContainerDescriptionProps> = ({ data }) => {
    const toast = useTabs();

    // Стани для відслідковування взаємодій користувача
    const [hasContacted, setHasContacted] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [contactCount, setContactCount] = useState(data.last_history?.contacts || 0);
    const [favoriteCount, setFavoriteCount] = useState(data.last_history?.favorites || 0);

    // Завантаження стану з localStorage при монтуванні
    useEffect(() => {
        const contactedKey = `listing_${data.id}_contacted`;
        const favoritedKey = `listing_${data.id}_favorited`;

        setHasContacted(localStorage.getItem(contactedKey) === 'true');
        setIsFavorited(localStorage.getItem(favoritedKey) === 'true');
    }, [data.id]);

    // Обробник кнопки "Контакти"
    const handleContact = async () => {
        if (hasContacted) {
            toast({
                title: "Вже зареєстровано",
                description: "Ви вже переглянули контакти для цього контейнера",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            // TODO: Замініть на реальний API endpoint
            // await axios.post(`/api/listings/${data.id}/contact`);

            // Симуляція API запиту
            await new Promise(resolve => setTimeout(resolve, 500));

            setHasContacted(true);
            setContactCount(prev => prev + 1);
            localStorage.setItem(`listing_${data.id}_contacted`, 'true');

            toast({
                title: "Контакти відкрито",
                description: "Телефон: +380 XX XXX XX XX",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            toast({
                title: "Помилка",
                description: "Не вдалося отримати контакти",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    // Обробник кнопки "Додати в обране"
    const handleFavorite = async () => {
        try {
            // TODO: Замініть на реальний API endpoint
            // if (isFavorited) {
            //     await axios.delete(`/api/listings/${data.id}/favorite`);
            // } else {
            //     await axios.post(`/api/listings/${data.id}/favorite`);
            // }

            // Симуляція API запиту
            await new Promise(resolve => setTimeout(resolve, 300));

            const newFavoritedState = !isFavorited;
            setIsFavorited(newFavoritedState);
            setFavoriteCount(prev => newFavoritedState ? prev + 1 : prev - 1);

            if (newFavoritedState) {
                localStorage.setItem(`listing_${data.id}_favorited`, 'true');
            } else {
                localStorage.removeItem(`listing_${data.id}_favorited`);
            }

            toast({
                title: newFavoritedState ? "Додано в обране" : "Видалено з обраного",
                description: newFavoritedState
                    ? "Контейнер додано до вашого списку обраних"
                    : "Контейнер видалено з вашого списку обраних",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            toast({
                title: "Помилка",
                description: "Не вдалося оновити обране",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    // Отримуємо локалізовані назви
    const conditionLabel = conditionMap[data.condition] || data.condition;
    const listingTypeLabel = listingTypes[data.type] || data.type;
    const containerTypeLabel = containerTypes[data.container_type] || data.container_type;
    const dimensionLabel = containerDimensions[data.dimension] || data.dimension;

    return (
        <Flex direction="column" gap="24px">
            {/* Статистика переглядів і збережень */}
            <Flex gap="16px" align="center">
                <Flex align="center" gap="6px" color="#A1A1AA">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="21px"
                        fontWeight="500"
                        lineHeight="1"
                        color="#A1A1AA"
                    >
                        {contactCount}
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
                        {favoriteCount}
                    </Text>
                    <Box as={Bookmark} w="21px" h="21px" color="#A1A1AA" />
                </Flex>
            </Flex>

            {/* Назва контейнера */}
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

            {/* Колір RAL */}
            {data.ral_color && (
                <Box>
                    <RalColorBox ralColorKey={data.ral_color} />
                </Box>
            )}

            {/* Ціна та кнопки */}
            <Flex align="center" gap="16px" py="24px" flexWrap="wrap">
                <Flex align="baseline" gap="8px">
                    <Text
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="48px"
                        fontWeight="700"
                        color="#18181B"
                        lineHeight="1"
                    >
                        {data.last_history?.price || 0}
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
                        bg={hasContacted ? "#71717A" : "#FD7F16"}
                        color="white"
                        px="32px"
                        py="12px"
                        borderRadius="4px"
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        _hover={{ bg: hasContacted ? "#52525B" : "#e65c00" }}
                        transition="all 0.3s ease"
                        onClick={handleContact}
                        isDisabled={hasContacted}
                        cursor={hasContacted ? "not-allowed" : "pointer"}
                    >
                        {hasContacted ? "Контакти переглянуто" : "Контакти"}
                    </Button>
                    <Button
                        bg={isFavorited ? "#FD7F16" : "white"}
                        color={isFavorited ? "white" : "#18181B"}
                        border={isFavorited ? "none" : "1px solid #E4E4E7"}
                        px="32px"
                        py="12px"
                        borderRadius="4px"
                        fontFamily="'Geologica Variable', sans-serif"
                        fontSize="16px"
                        fontWeight="500"
                        _hover={{ bg: isFavorited ? "#e65c00" : "#F4F4F5" }}
                        transition="all 0.3s ease"
                        onClick={handleFavorite}
                        leftIcon={isFavorited ? <BookmarkCheck size={20} /> : undefined}
                    >
                        {isFavorited ? "В обраному" : "Додати в обране"}
                    </Button>
                </Flex>
            </Flex>

            {/* Характеристики */}
            <Grid
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
                gap="24px"
            >
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
                        {listingTypeLabel}
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
                        {conditionLabel}
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
                        {containerTypeLabel}
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
                        {dimensionLabel}
                    </Text>
                </Flex>
            </Grid>

            {/* Опис */}
            {data.description && (
                <Box>
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
                        lineHeight="1.6"
                    >
                        {data.description}
                    </Text>
                </Box>
            )}
        </Flex>
    );
};