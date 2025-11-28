import React from 'react';
import { ContainerCard } from './ContainerCard';
import type {Container} from '../mockData';

interface RecommendedSectionProps {
    containers: Container[];
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({ containers }) => {
    return (
        <div className="recommended-section">
            <h2 className="recommended-title">Схожі пропозиції</h2>
            <div className="recommended-grid">
                {containers.map((container) => (
                    <ContainerCard key={container.id} container={container} />
                ))}
            </div>
        </div>
    );
};