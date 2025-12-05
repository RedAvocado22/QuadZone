import React from "react";
import { useCompare } from "../../contexts/CompareContext";
import { getProductDetails } from "src/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // make sure styles are imported

interface CompareButtonProps {
    productId: number;
    className?: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({ productId, className = "" }) => {
    const { addToCompare, removeFromCompare, isInCompare } = useCompare();
    const inCompare = isInCompare(productId);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (inCompare) {
            removeFromCompare(productId);
            toast.info("Removed from compare"); // show toast on remove
            return;
        }

        try {
            const details = await getProductDetails(productId);
            addToCompare(details);
            toast.success("Added to compare"); // show toast on add
        } catch (err) {
            console.error("Failed to load product details for compare", err);
            toast.error("Failed to add product to compare");
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`btn btn-icon ${inCompare ? "btn-primary" : "btn-primary"} ${className}`}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
        >
            <i className={`ec ec-compare ${inCompare ? "text-dark" : "text-dark"}`}></i>
        </button>
    );
};

export default CompareButton;
