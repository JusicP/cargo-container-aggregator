import React, { useState } from 'react';
import { Box, Flex, Image, Button, Text, Center } from '@chakra-ui/react';

interface ImageCarouselProps {
    images: string[];
}

const ChevronLeft = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);

const ChevronRight = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

const ImagePlaceholder = () => (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none">
        <rect width="400" height="300" fill="#F5F5F5"/>
        <path d="M150 120L200 180L250 140L300 200H100L150 120Z" fill="#D4D4D4"/>
        <circle cx="280" cy="80" r="20" fill="#D4D4D4"/>
    </svg>
);

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Якщо немає зображень
    if (!images || images.length === 0) {
        return (
            <Flex direction="column" gap="16px" position="relative" px="60px">
                <Box position="relative" w="100%" aspectRatio="4/3" bg="#F5F5F5" borderRadius="8px">
                    <Center w="100%" h="100%" flexDirection="column" gap="8px">
                        <ImagePlaceholder />
                        <Text
                            fontFamily="'Geologica Variable', sans-serif"
                            fontSize="16px"
                            fontWeight="400"
                            color="#A1A1AA"
                        >
                            Зображення відсутнє
                        </Text>
                    </Center>
                </Box>
            </Flex>
        );
    }

    return (
        <Flex direction="column" gap="16px" position="relative" px="60px">
            <Box position="relative" w="100%" aspectRatio="4/3" bg="#F5F5F5" borderRadius="8px">
                <Box w="100%" h="100%" overflow="hidden" borderRadius="8px">
                    <Image
                        src={images[currentImageIndex]}
                        alt={`Контейнер ${currentImageIndex + 1}`}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        fallback={
                            <Center w="100%" h="100%" bg="#F5F5F5">
                                <ImagePlaceholder />
                            </Center>
                        }
                    />
                </Box>

                {images.length > 1 && (
                    <>
                        <Button
                            aria-label="Попереднє зображення"
                            onClick={prevImage}
                            position="absolute"
                            left="-54px"
                            top="50%"
                            transform="translateY(-50%)"
                            bg="transparent"
                            color="#18181B"
                            w="48px"
                            h="48px"
                            minW="48px"
                            p={0}
                            _hover={{
                                bg: 'transparent',
                                color: '#FD7F16',
                                transform: 'translateY(-50%) scale(1.1)',
                            }}
                            transition="all 0.3s ease"
                        >
                            <ChevronLeft />
                        </Button>

                        <Button
                            aria-label="Наступне зображення"
                            onClick={nextImage}
                            position="absolute"
                            right="-54px"
                            top="50%"
                            transform="translateY(-50%)"
                            bg="transparent"
                            color="#18181B"
                            w="48px"
                            h="48px"
                            minW="48px"
                            p={0}
                            _hover={{
                                bg: 'transparent',
                                color: '#FD7F16',
                                transform: 'translateY(-50%) scale(1.1)',
                            }}
                            transition="all 0.3s ease"
                        >
                            <ChevronRight />
                        </Button>
                    </>
                )}
            </Box>

            {images.length > 1 && (
                <Flex gap="12px" w="100%">
                    {images.map((img, index) => (
                        <Box
                            key={index}
                            flex="1"
                            h="100px"
                            borderRadius="4px"
                            overflow="hidden"
                            cursor="pointer"
                            border="2px solid"
                            borderColor={index === currentImageIndex ? '#FD7F16' : 'transparent'}
                            transition="border-color 0.3s ease"
                            _hover={{ borderColor: '#FD7F16' }}
                            onClick={() => setCurrentImageIndex(index)}
                        >
                            <Image
                                src={img}
                                alt={`Мініатюра ${index + 1}`}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                                fallback={
                                    <Center w="100%" h="100%" bg="#F5F5F5">
                                        <ImagePlaceholder />
                                    </Center>
                                }
                            />
                        </Box>
                    ))}
                </Flex>
            )}
        </Flex>
    );
};