import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { ProductDetails } from "../api/types";

interface CompareContextType {
    compareProducts: ProductDetails[];
    addToCompare: (product: ProductDetails) => void;
    removeFromCompare: (productId: number) => void;
    clearCompare: () => void;
    isInCompare: (productId: number) => boolean;
    maxCompare: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within CompareProvider");
    }
    return context;
};

interface CompareProviderProps {
    children: ReactNode;
}

export const CompareProvider: React.FC<CompareProviderProps> = ({ children }) => {
    const MAX_COMPARE = 4;
    const [compareProducts, setCompareProducts] = useState<ProductDetails[]>([]);

    // Load compare products from localStorage on mount
    useEffect(() => {
        const savedCompare = localStorage.getItem("compareProducts");
        if (savedCompare) {
            try {
                setCompareProducts(JSON.parse(savedCompare));
            } catch (error) {
                console.error("Error loading compare products:", error);
            }
        }
    }, []);

    // Save to localStorage whenever compareProducts changes
    useEffect(() => {
        localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
    }, [compareProducts]);

    const addToCompare = (product: ProductDetails) => {
        if (compareProducts.length >= MAX_COMPARE) {
            alert(`You can only compare up to ${MAX_COMPARE} products at once.`);
            return;
        }

        if (!isInCompare(product.id)) {
            setCompareProducts([...compareProducts, product]);
        }
    };

    const removeFromCompare = (productId: number) => {
        setCompareProducts(compareProducts.filter((p) => p.id !== productId));
    };

    const clearCompare = () => {
        setCompareProducts([]);
    };

    const isInCompare = (productId: number): boolean => {
        return compareProducts.some((p) => p.id === productId);
    };

    const value: CompareContextType = {
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        maxCompare: MAX_COMPARE
    };

    return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};
