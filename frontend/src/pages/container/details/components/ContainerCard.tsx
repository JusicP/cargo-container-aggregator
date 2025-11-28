import React from 'react';
import type {Container} from '../mockData';

interface ContainerCardProps {
    container: Container;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
    return (
        <div className="container-card">
            <div className="card-image">
                <img src={container.image} alt={container.title} />
            </div>
            <div className="card-content">
                <div className="card-header">
                    <span className="card-badge">40ft High Cube</span>
                </div>
                <h3 className="card-title">{container.title}</h3>
                <p className="card-subtitle">Used: {container.price} {container.currency}</p>
                <p className="card-subtitle">Від: вих.</p>
                <p className="card-location">Одеса, Ukraine</p>
                <div className="card-specs">
                    {container.specs?.map((color, index) => (
                        <span
                            key={index}
                            className="spec-dot"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};