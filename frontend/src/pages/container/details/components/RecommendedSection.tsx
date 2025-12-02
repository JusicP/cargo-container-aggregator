import React from 'react';
import { Box, Grid, Heading } from '@chakra-ui/react';
import { ContainerCard } from './ContainerCard';
import type { Listing } from '@/services/api/listings';

interface RecommendedSectionProps {
    containers: Listing[];
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({ containers }) => {
    if (!containers || containers.length === 0) {
        return null;
    }

    return (
        <Box px={{ base: '16px', md: '128px' }} py="64px" bg="#FAFAFA">
            <Heading
                as="h2"
                fontFamily="'Geologica Variable', sans-serif"
                fontSize="36px"
                fontWeight="700"
                color="#18181B"
                mb="32px"
            >
                Рекомендовані контейнери
            </Heading>

            <Grid
                templateColumns={{
                    base: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                }}
                gap="0"
            >
                {containers.map((container) => (
                    <ContainerCard key={container.id} container={container} />
                ))}
            </Grid>
        </Box>
    );
};