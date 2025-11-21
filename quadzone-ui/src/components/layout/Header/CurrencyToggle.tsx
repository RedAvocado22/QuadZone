import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useCurrency } from "../../../contexts/CurrencyContext";

const CurrencyToggle = () => {
    const { currency, setCurrency, isLoading } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Toggle clicked, current isOpen:", isOpen);
        
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 4,
                right: window.innerWidth - rect.right,
            });
        }
        
        setIsOpen(!isOpen);
    };

    const handleCurrencyChange = (newCurrency: "USD" | "VND", e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Currency change clicked:", newCurrency);
        setCurrency(newCurrency);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const dropdownMenu = isOpen ? (
        <div
            ref={dropdownRef}
            className="dropdown-menu dropdown-menu-right"
            style={{
                position: "fixed",
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
                zIndex: 99999,
                minWidth: "150px",
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                padding: "8px 0",
                display: "block",
                pointerEvents: "auto",
            }}>
            <button
                type="button"
                className="dropdown-item u-header-topbar__nav-link"
                onClick={(e) => handleCurrencyChange("USD", e)}
                style={{
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "left",
                    color: currency === "USD" ? "#007bff" : "#333",
                    backgroundColor: currency === "USD" ? "#f8f9fa" : "transparent",
                    cursor: "pointer",
                    textDecoration: "none",
                    border: "none",
                    background: currency === "USD" ? "#f8f9fa" : "transparent",
                }}
                onMouseEnter={(e) => {
                    if (currency !== "USD") {
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }
                }}
                onMouseLeave={(e) => {
                    if (currency !== "USD") {
                        e.currentTarget.style.backgroundColor = "transparent";
                    }
                }}>
                <i className="ec ec-dollar mr-2"></i>
                Dollar (US)
            </button>
            <button
                type="button"
                className="dropdown-item u-header-topbar__nav-link"
                onClick={(e) => handleCurrencyChange("VND", e)}
                style={{
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "left",
                    color: currency === "VND" ? "#007bff" : "#333",
                    backgroundColor: currency === "VND" ? "#f8f9fa" : "transparent",
                    cursor: "pointer",
                    textDecoration: "none",
                    border: "none",
                    background: currency === "VND" ? "#f8f9fa" : "transparent",
                }}
                onMouseEnter={(e) => {
                    if (currency !== "VND") {
                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }
                }}
                onMouseLeave={(e) => {
                    if (currency !== "VND") {
                        e.currentTarget.style.backgroundColor = "transparent";
                    }
                }}>
                <i className="ec ec-dollar mr-2"></i>
                Đồng (VN)
            </button>
        </div>
    ) : null;

    return (
        <>
            <div className="position-relative">
                <button
                    ref={buttonRef}
                    type="button"
                    className="dropdown-nav-link dropdown-toggle d-flex align-items-center u-header-topbar__nav-link font-weight-normal"
                    onClick={handleToggle}
                    style={{ 
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        padding: 0,
                        color: "inherit",
                    }}>
                    <span className="d-none d-sm-inline-flex align-items-center">
                        <i className={`ec ec-${currency === "USD" ? "dollar" : "dollar"} mr-1`}></i>
                        {currency === "USD" ? "Dollar (US)" : "Đồng (VN)"}
                    </span>
                </button>
                {isLoading && (
                    <span className="ml-1" style={{ fontSize: "10px", color: "#999" }}>
                        (Loading...)
                    </span>
                )}
            </div>
            {isOpen && createPortal(dropdownMenu, document.body)}
        </>
    );
};

export default CurrencyToggle;

