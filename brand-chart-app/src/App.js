// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Chart from './BrandChart';
import yaml from 'js-yaml';
import BrandChart from "./BrandChart";

function App() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/brands.yaml');
                const yamlData = await response.text();
                const parsedData = yaml.load(yamlData);
                console.log(parsedData);
                setBrands(parsedData.brands); // Use the 'brands' array from the YAML data
            } catch (error) {
                console.error('Error fetching and parsing YAML data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <h1>Brand Chart App</h1>
            <BrandChart brands={brands} />
        </div>
    );
}

export default App;
