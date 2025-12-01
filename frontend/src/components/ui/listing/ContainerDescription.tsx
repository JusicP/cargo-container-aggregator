import React from 'react';
import type {Container} from './mockData';
// Імпорт іконок з MynaUI (встанови: npm install @mynaui/icons-react)
import { Click, Bookmark } from '@mynaui/icons-react';

interface ContainerDescriptionProps {
    data: Container;
}

export const ContainerDescription: React.FC<ContainerDescriptionProps> = ({ data }) => {
    return (
        <div className="container-description">
            <div className="description-header">
                <div className="stat-badge">
                    <span className="stat-value">{data.specifications?.clicks || 54}</span>
                    <Click className="stat-icon" />
                </div>
                <div className="stat-badge">
                    <span className="stat-value">{data.specifications?.saves || 13}</span>
                    <Bookmark className="stat-icon" />
                </div>
            </div>

            <h1 className="container-title">{data.title}</h1>

            <div className="color-tags">
                {data.colors?.map((color, index) => (
                    <div key={index} className="color-tag">
                        <span
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                        />
                        <span className="color-code">{color}</span>
                    </div>
                ))}
            </div>

            <div className="price-section">
                <div className="price-wrapper">
                    <span className="price">{data.price}</span>
                    <span className="currency">{data.currency}</span>
                </div>
                <button className="cta-button">Продовжити</button>
            </div>

            <div className="meta-info-grid">
                <div className="meta-info-item">
                    <span className="meta-info-label">Тип</span>
                    <span className="meta-info-value">sale</span>
                </div>
                <div className="meta-info-item">
                    <span className="meta-info-label">Стан</span>
                    <span className="meta-info-value">{data.condition}</span>
                </div>
                <div className="meta-info-item">
                    <span className="meta-info-label">Локація</span>
                    <span className="meta-info-value">{data.location}</span>
                </div>
                <div className="meta-info-item">
                    <span className="meta-info-label">Тип конейнера</span>
                    <span className="meta-info-value">{data.owner}</span>
                </div>
            </div>
        </div>
    );
};