import React from 'react';
import { useParams } from 'react-router-dom';
import { ImageCarousel } from './components/ImageCarousel';
import { ContainerDescription } from './components/ContainerDescription';
import { RecommendedSection } from './components/RecommendedSection';
import { containerData, recommendedContainers } from './mockData';
import './container-details.css';

const ContainerDetailsPage: React.FC = () => {
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

export default ContainerDetailsPage;