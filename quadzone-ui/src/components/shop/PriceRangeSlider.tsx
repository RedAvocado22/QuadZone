import { useState } from "react";

interface PriceRange {
    min: number;
    max: number;
}

interface PriceRangeSliderProps {
    min?: number;
    max?: number;
    onFilter?: (range: PriceRange) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min = 0, max = 3456, onFilter }) => {
    const [minValue, setMinValue] = useState<number>(min);
    const [maxValue, setMaxValue] = useState<number>(max);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = Math.min(Number(e.target.value), maxValue - 1);
        setMinValue(value);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = Math.max(Number(e.target.value), minValue + 1);
        setMaxValue(value);
    };

    const handleFilter = (): void => {
        if (onFilter) {
            onFilter({ min: minValue, max: maxValue });
        }
    };

    const minPercent: number = ((minValue - min) / (max - min)) * 100;
    const maxPercent: number = ((maxValue - min) / (max - min)) * 100;

    return (
        <div className="border-bottom pb-4 mb-4">
            <h4 className="font-size-14 mb-3 font-weight-bold">Price</h4>

            {/* Range Slider Container */}
            <div className="position-relative pt-4 pb-2">
                {/* Track */}
                <div
                    className="position-absolute bg-gray-200 rounded w-100"
                    style={{
                        height: "4px",
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}></div>

                {/* Active Range */}
                <div
                    className="position-absolute bg-primary rounded"
                    style={{
                        height: "4px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`
                    }}></div>

                {/* Min Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minValue}
                    onChange={handleMinChange}
                    className="position-absolute w-100"
                    style={{
                        height: "4px",
                        background: "transparent",
                        pointerEvents: "none",
                        appearance: "none",
                        WebkitAppearance: "none",
                        zIndex: 2
                    }}
                />

                {/* Max Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxValue}
                    onChange={handleMaxChange}
                    className="position-absolute w-100"
                    style={{
                        height: "4px",
                        background: "transparent",
                        pointerEvents: "none",
                        appearance: "none",
                        WebkitAppearance: "none",
                        zIndex: 3
                    }}
                />
            </div>

            {/* Price Display */}
            <div className="mt-3 mb-4 font-size-13 text-gray-111 d-flex">
                <span className="mr-1">Price:</span>
                <span>$</span>
                <span>{minValue}</span>
                <span className="mx-2">—</span>
                <span>$</span>
                <span>{maxValue}</span>
            </div>

            {/* Filter Button */}
            <button type="button" onClick={handleFilter} className="btn btn-primary-dark-w px-4 py-2 rounded-lg w-100">
                Filter
            </button>

            <style>{`
                input[type="range"]::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #fff;
                    border: 2px solid var(--primary, #007bff);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                
                input[type="range"]::-moz-range-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #fff;
                    border: 2px solid var(--primary, #007bff);
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default PriceRangeSlider;
