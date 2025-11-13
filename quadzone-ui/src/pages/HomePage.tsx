import HeroSection from "../components/home/HeroSection";
import ProductSlider from "../components/home/ProductSlider";
import { productImages } from "../constants/images";

// Mock data for products
const mockProducts = [
    {
        id: 1,
        name: "Wireless Audio System Multiroom 360 degree Full base audio",
        category: { id: 1, name: "Speakers" },
        price: 685.0,
        quantity: 1,
        image: productImages[1],
        rating: 4.5
    },
    {
        id: 2,
        name: "Video Camera 4k Waterproof",
        category: { id: 2, name: "Camera" },
        price: 899.0,
        quantity: 1,
        image: productImages[2],
        rating: 5
    },
    {
        id: 3,
        name: "Smartphone 6S 32GB LTE",
        category: { id: 3, name: "Smartphones" },
        price: 685.0,
        quantity: 1,
        image: productImages[4],
        rating: 4
    },
    {
        id: 4,
        name: "Widescreen NX Mini F1 SMART NX",
        category: { id: 4, name: "Cameras" },
        price: 685.0,
        quantity: 1,
        image: productImages[5],
        rating: 4.5
    },
    {
        id: 5,
        name: "Full Color LaserJet Pro M452dn",
        category: { id: 5, name: "Printers" },
        price: 439.0,
        quantity: 1,
        image: productImages[6],
        rating: 4
    },
    {
        id: 6,
        name: "GameConsole Destiny Special Edition",
        category: { id: 6, name: "Gaming" },
        price: 399.0,
        quantity: 1,
        image: productImages[7],
        rating: 5
    }
];

const HomePage = () => {
    return (
        <div className="home-v6">
            <HeroSection />

            <div className="container">
                <div className="mb-6">
                    <ProductSlider title="Featured Products" products={mockProducts} />
                </div>

                <div className="mb-6">
                    <ProductSlider title="Best Sellers" products={mockProducts.slice().reverse()} />
                </div>

                <div className="mb-6">
                    <ProductSlider title="New Arrivals" products={mockProducts} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
