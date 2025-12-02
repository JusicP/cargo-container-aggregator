import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Flex } from '@chakra-ui/react';
import { ImageCarousel } from './components/ImageCarousel';
import { ContainerDescription } from './components/ContainerDescription';
import { RecommendedSection } from './components/RecommendedSection';
import { containerData, recommendedContainers } from './mockData';

const ContainerDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

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
                    <ImageCarousel images={containerData.images || []} />
                </Box>
                <Box flex="1" maxW={{ lg: '600px' }}>
                    <ContainerDescription data={containerData} />
                </Box>
            </Flex>

            <RecommendedSection containers={recommendedContainers} />
        </Box>
    );
};

export default ContainerDetailsPage;