// BrandChart.js
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const BrandChart = ({ brands }) => {
    // Sort brands based on average price
    const sortedBrands = brands.sort((a, b) => {
        const avgPriceA = (a.prices.coreStart + a.prices.coreEnd) / 2;
        const avgPriceB = (b.prices.coreStart + b.prices.coreEnd) / 2;
        return avgPriceA - avgPriceB;
    });

    const stackBrands = (brands) => {
        const stackedData = [];

        brands.forEach((brand, index) => {
            const existingStack = stackedData.find((stack) => {
                return !stack.some((stackedBrand) =>
                    brand.prices.end > stackedBrand.brand.prices.start &&
                    brand.prices.start < stackedBrand.brand.prices.end
                );
            });

            if (existingStack) {
                existingStack.push({
                    x: existingStack[0].x, // Use the same x position for the entire stack
                    y: (brand.prices.coreStart + brand.prices.coreEnd) / 2,
                    width: 80, // Adjust as needed
                    brand,
                });
            } else {
                // Start a new stack with the next x position
                stackedData.push([
                    {
                        x: index,
                        y: (brand.prices.coreStart + brand.prices.coreEnd) / 2,
                        width: 80, // Adjust as needed
                        brand,
                    },
                ]);
            }
        });

        // Flatten the stackedData array
        return stackedData.reduce((result, stack) => [...result, ...stack], []);
    };

    const data = {
        datasets: [
            {
                label: 'Brand Sales',
                data: stackBrands(sortedBrands),
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Sales Volume',
                },
            },
            y: {
                type: 'logarithmic',
                position: 'left',
                title: {
                    display: true,
                    text: 'Average Price',
                },
                min: 0, // Set the minimum value of the y-axis to 0
                max: 20000,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        elements: {
            point: {
                radius: 0, // No point radius
            },
        },
    };

    const plugins = [
        {
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const yAxis = chart.scales.y;
                const dataset = chart.data.datasets[0];

                dataset.data.forEach((point) => {
                    const x = chart.scales.x.getPixelForValue(point.x);
                    const y = yAxis.getPixelForValue(point.y);
                    const height = Math.abs(yAxis.getPixelForValue(point.brand.prices.coreEnd) - yAxis.getPixelForValue(point.brand.prices.coreStart));
                    const halfWidth = point.width / 2;

                    // Draw lines for overall start and end prices
                    ctx.strokeStyle = 'rgba(200, 200, 200, 1.0)';
                    ctx.lineWidth = 5;

                    ctx.beginPath();
                    ctx.moveTo(x - halfWidth, yAxis.getPixelForValue(point.brand.prices.start));
                    ctx.lineTo(x + halfWidth, yAxis.getPixelForValue(point.brand.prices.start));
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x - halfWidth, yAxis.getPixelForValue(point.brand.prices.end));
                    ctx.lineTo(x + halfWidth, yAxis.getPixelForValue(point.brand.prices.end));
                    ctx.stroke();

                    // Draw separate black lines from `start` to `coreStart` and from `end` to `coreEnd`
                    ctx.beginPath();
                    ctx.moveTo(x, yAxis.getPixelForValue(point.brand.prices.start));
                    ctx.lineTo(x, y - height / 2);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x, yAxis.getPixelForValue(point.brand.prices.end));
                    ctx.lineTo(x, y + height / 2);
                    ctx.stroke();

                    // Draw a rectangle
                    ctx.fillStyle = 'rgba(200, 200, 200, 1.0)';
                    ctx.fillRect(x - halfWidth, y - height / 2, point.width, height);

                    // Draw brand logo
                    const logoImage = new Image();
                    logoImage.src = point.brand.logo;
                    ctx.drawImage(logoImage, x - halfWidth + 5, y - height / 2 + 5, 70, 70); // Adjust position and size as needed
                });
            },
        },
    ];

    return <Scatter data={data} options={options} plugins={plugins} />;
};

export default BrandChart;
