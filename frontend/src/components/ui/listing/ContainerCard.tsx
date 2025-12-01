import React from 'react';
import type {Container} from '../mockData';

interface ContainerCardProps {
    container: Container;
}

export const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
    const colorCode = container.specs?.[0] || '#204F73';

    return (
        <div className="container-card">
            <div className="card-image">
                <img src={container.image} alt={container.title} />
            </div>
            <div className="card-content">
                <h3 className="card-title">{container.title}</h3>
                <p className="card-price-text">Ціна: {container.price} {container.currency}</p>
                <p className="card-meta-text">Тип: sale</p>
                <p className="card-meta-text">Стан: used</p>
                <div className="card-color-row">
                    <div className="card-color-indicator" style={{ backgroundColor: colorCode }}></div>
                    <span className="card-color-code">{colorCode}</span>
                </div>
            </div>
        </div>
    );
};