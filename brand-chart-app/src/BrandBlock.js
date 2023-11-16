// BrandBlock.js
import React from 'react';

const BrandBlock = ({ brand }) => {
    return (
        <div>
            <h3>{brand.name}</h3>
            <img src={brand.logo} alt={brand.name} width={50} />
            <p>Description: {brand.description}</p>
            {/* Render other information as needed */}
        </div>
    );
};

export default BrandBlock;
