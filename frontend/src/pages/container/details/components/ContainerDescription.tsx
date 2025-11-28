import React from 'react';
import { Button } from '@chakra-ui/react';
import type {Container} from '../mockData';

interface ContainerDescriptionProps {
    data: Container;
}

export const ContainerDescription: React.FC<ContainerDescriptionProps> = ({ data }) => {
    return (
        <div className="container-description">
            <div className="description-header">
                <span className="size-badge">{data.specifications?.size}</span>
                <span className="type-badge">{data.specifications?.type}</span>
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
                <span className="price">{data.price}</span>
                <span className="currency">{data.currency}</span>
                <Button className="!cta-button">Придбати</Button>
            </div>

            <div className="meta-info">
                <div className="meta-item">
                    <span className="meta-label">sale</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">{data.condition}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">{data.location}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">{data.owner}</span>
                </div>
            </div>
        </div>
    );
};