import HeroSection from "../components/home/HeroSection";
import ProductSlider from "../components/home/ProductSlider";
import { useProducts } from "../hooks/useProducts";

const HomePage = () => {
    const { products, loading, error } = useProducts(0, 20);

    if (loading) {
        return (
            <div className="home-v6">
                <HeroSection />
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-v6">
                <HeroSection />
                <div className="container">
                    <div className="alert alert-danger" role="alert">
                        Error loading products: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-v6">
            <HeroSection />

            <div className="container">
                <div className="mb-6">
                    <ProductSlider title="Featured Products" products={products.slice(0, 6)} />
                </div>

                <div className="mb-6">
                    <ProductSlider title="Best Sellers" products={products.slice(6, 12)} />
                </div>

                <div className="mb-6">
                    <ProductSlider title="New Arrivals" products={products.slice(12, 18)} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
