import { Link } from "react-router-dom";

const ShopBreadcrumb = () => {
    return (
        <div className="bg-gray-13 bg-md-transparent">
            <div className="container">
                <div className="my-md-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-3 flex-nowrap flex-xl-wrap overflow-auto overflow-xl-visble">
                            <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="breadcrumb-item flex-shrink-0 flex-xl-shrink-1 active" aria-current="page">
                                Shop
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ShopBreadcrumb;
