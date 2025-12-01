import React from 'react';
import { Box, Grid, Heading } from '@chakra-ui/react';
import { ContainerCard } from './ContainerCard';
import type {Container} from './mockData';

interface RecommendedSectionProps {
    containers: Container[];
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({ containers }) => {
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
            </Heading>

            <Grid templateColumns="repeat(4, 1fr)" gap="0">
                {containers.map((container) => (
                    <ContainerCard key={container.id} container={container} />
                ))}
            </Grid>
        </Box>
    );
};