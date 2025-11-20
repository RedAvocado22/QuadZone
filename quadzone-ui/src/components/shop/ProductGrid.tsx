import type { Product } from "../../types/Product";
import type { ViewMode } from "../../types/shop";
import { useCart } from "../../contexts/CartContext";
import ProductCard from "../../components/shared/ProductCard";
import ListProductCard from "../shared/ListProductCard";
import ListSmallProductCard from "../shared/SmallListProductCard";

interface ProductGridProps {
    products: Product[];
    viewMode: ViewMode;
}

const ProductGrid = ({ products, viewMode }: ProductGridProps) => {
    const { addToCart } = useCart();
    if (viewMode === "grid") {
        return <GridView products={products}  />;
    } else if (viewMode === "list") {
        return <ListView products={products} addToCart={addToCart} />;
    } else if (viewMode === "list-small") {
        return <ListSmallView products={products} addToCart={addToCart} />;
    }

    return <GridView products={products}  />;
};

// Grid View (Default)
interface GridViewProps {
    products: Product[];
    addToCart: (product: any, quantity?: number) => void;
}

const GridView = ({ products }: { products: Product[] }) => {
    return (
        <div className="tab-content pt-2">
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-6 col-md-3 col-wd-2gdot4 px-2 mb-4">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// List View
const ListView = ({ products, addToCart }: GridViewProps) => {
    return (
        <div className="tab-content pt-2">
            <ul className="d-block list-unstyled products-group prodcut-list-view">
                {products.map((product) => (
                    <ListProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                    />
                ))}
            </ul>
        </div>
    );
};

// List Small View
const ListSmallView = ({ products, addToCart }: GridViewProps) => {
    return (
        <div className="tab-content pt-2">
            <ul className="d-block list-unstyled products-group prodcut-list-view-small">
                {products.map((product) => (
                    <ListSmallProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                    />
                ))}
            </ul>
        </div>
    );
};

export default ProductGrid;
