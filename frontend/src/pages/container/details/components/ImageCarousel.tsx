import React, { useState } from 'react';
import { Box, Flex, Image, Button } from '@chakra-ui/react';

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

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Flex direction="column" gap="16px" position="relative" px="60px">
            <Box position="relative" w="100%" aspectRatio="4/3" bg="#F5F5F5" borderRadius="8px">
                <Box w="100%" h="100%" overflow="hidden" borderRadius="8px">
                    <Image
                        src={images[currentImageIndex]}
                        alt={`Container ${currentImageIndex + 1}`}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                    />
                </Box>

                <Button
                    aria-label="Previous image"
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
                    aria-label="Next image"
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
            </Box>

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
                        <Image src={img} alt={`Thumbnail ${index + 1}`} w="100%" h="100%" objectFit="cover" />
                    </Box>
                ))}
            </Flex>
        </Flex>
    );
};