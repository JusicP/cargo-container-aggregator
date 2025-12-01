import React from 'react';
import { useParams } from 'react-router-dom';
import { ImageCarousel } from '@/components/ui/listing/ImageCarousel';
import { ContainerDescription } from '@/components/ui/listing/ContainerDescription';
import { RecommendedSection } from '@/components/ui/listing/RecommendedSection';
import { containerData, recommendedContainers } from '@/components/ui/listing/mockData.ts';
import './listing-page.css';

const ListingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="container-details-page">
            <div className="details-content">
                <div className="content-left">
                    <ImageCarousel images={containerData.images || []} />
                </div>
                <div className="content-right">
                    <ContainerDescription data={containerData} />
                </div>
            </div>

            <RecommendedSection containers={recommendedContainers} />
        </div>
    );
};

export default ListingPage;