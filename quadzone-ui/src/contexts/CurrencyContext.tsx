import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getExchangeRate } from "../api/exchange";

export type Currency = "USD" | "VND";

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRate: number | null;
    isLoading: boolean;
    convertPrice: (usdPrice: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrencyState] = useState<Currency>(() => {
        const saved = localStorage.getItem("currency");
        return (saved as Currency) || "USD";
    });

    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch exchange rate on mount
    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                setIsLoading(true);
                const rate = await getExchangeRate();
                setExchangeRate(rate);
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExchangeRate();
    }, []);

    // Save currency to localStorage
    useEffect(() => {
        localStorage.setItem("currency", currency);
    }, [currency]);

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
    };

    const convertPrice = (usdPrice: number): number => {
        if (currency === "USD") {
            return usdPrice;
        }
        if (exchangeRate === null) {
            return usdPrice; // Fallback to USD if rate not loaded
        }
        return usdPrice * exchangeRate;
    };

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                exchangeRate,
                isLoading,
                convertPrice,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within CurrencyProvider");
    }
    return context;
};

