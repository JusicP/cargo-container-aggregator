import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex, Spinner, Text, Center } from '@chakra-ui/react';
import { ImageCarousel } from './components/ImageCarousel';
import { ContainerDescription } from './components/ContainerDescription';
import { RecommendedSection } from './components/RecommendedSection';
import { useListings } from '@/services/api/listings';

const ContainerDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const listingId = Number(id);

    // Отримуємо всі контейнери зі статусом 'active'
    const { data: allListingsData, isLoading, isFetching } = useListings({
        page: 1,
        page_size: 20,
        status: 'active',  // Використовуємо правильний статус!
    });

    // Знаходимо поточний контейнер
    const currentListing = useMemo(() => {
        return allListingsData?.listings?.find(listing => listing.id === listingId);
    }, [allListingsData, listingId]);

    // Фільтруємо рекомендовані контейнери
    const recommendedContainers = useMemo(() => {
        if (!allListingsData?.listings) return [];

        return allListingsData.listings
            .filter(container => container.id !== listingId)
            .slice(0, 4);
    }, [allListingsData, listingId]);

    // Перетворюємо фото в масив URL
    const images = useMemo(() => {
        if (!currentListing?.photos || currentListing.photos.length === 0) return [];

        return currentListing.photos
            .sort((a, b) => {
                // Спочатку головне фото
                if (a.is_main && !b.is_main) return -1;
                if (!a.is_main && b.is_main) return 1;
                return 0;
            })
            .map(photo => {
                // Якщо є photo_url, використовуємо його
                if (photo.photo_url) return photo.photo_url;
                // Інакше будуємо URL з photo_id
                return `/api/photos/${photo.photo_id}`;
            });
    }, [currentListing]);

    if (isLoading || isFetching) {
        return (
            <Center w="100%" minH="100vh" bg="white">
                <Spinner
                    size="xl"
                    color="#FD7F16"
                    thickness="4px"
                />
            </Center>
        );
    }

    if (!currentListing) {
        return (
            <Center w="100%" minH="100vh" bg="white" flexDirection="column" gap="16px">
                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="24px"
                    fontWeight="500"
                    color="#18181B"
                >
                    Контейнер не знайдено
                </Text>
                <Text
                    fontFamily="'Geologica Variable', sans-serif"
                    fontSize="16px"
                    fontWeight="400"
                    color="#71717A"
                >
                    Можливо, він був видалений або ID невірний
                </Text>
            </Center>
        );
    }

    return (
        <Box w="100%" minH="100vh" bg="white" pt="30px">
            <Flex
                gap="48px"
                px={{ base: '16px', md: '128px' }}
                py="64px"
                maxW="1920px"
                mx="auto"
                direction={{ base: 'column', lg: 'row' }}
            >
                <Box flex="1" maxW={{ lg: '600px' }}>
                    <ImageCarousel images={images} />
                </Box>
                <Box flex="1" maxW={{ lg: '600px' }}>
                    <ContainerDescription data={currentListing} />
                </Box>
            </Flex>

            {recommendedContainers.length > 0 && (
                <RecommendedSection containers={recommendedContainers} />
            )}
        </Box>
    );
};

export default ContainerDetailsPage;