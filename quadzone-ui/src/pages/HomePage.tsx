import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import ProductSlider from "../components/home/ProductSlider";
import API from "@/api/base";
import type { Product } from "../types/Product";
import { toast } from "react-toastify";

const HomePage = () => {
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [featured, setFeatured] = useState<Product[]>([]);
    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomeProducts = async () => {
            try {
                setError(null);
                const response = await API.get("/public");

                // simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const { bestSellers, featured, newArrivals } = response.data;

                setBestSellers(bestSellers?.content || []);
                setFeatured(featured?.content || []);
                setNewArrivals(newArrivals?.content || []);
            } catch {
                const errorMessage = "Failed to load products.";
                setError(errorMessage);
                toast.error(errorMessage + " Please try again later.");

                setBestSellers([]);
                setFeatured([]);
                setNewArrivals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeProducts();
    }, []);

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
                    <ProductSlider title="Featured Products" products={featured.slice(0, 8)} />
                </div>

                <div className="mb-6">
                    <ProductSlider title="Best Sellers" products={bestSellers.slice(0, 8)} />
                </div>

                <div className="mb-6">
                    <ProductSlider title="New Arrivals" products={newArrivals.slice(0, 8)} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
