import { Link } from "react-router-dom";

interface CheckoutBreadcrumbProps {
    title?: string;
}

const CheckoutBreadcrumb = ({ title = "Checkout" }: CheckoutBreadcrumbProps) => (
    <div className="bg-gray-13 bg-md-transparent mb-4">
    <div className="container">
    <div className="my-md-3">
    <nav aria-label="breadcrumb">
    <ol className="breadcrumb mb-3 flex-nowrap flex-xl-wrap overflow-auto">
    <li className="breadcrumb-item flex-shrink-0">
    <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item flex-shrink-0 active" aria-current="page">
    {title}
    </li>
    </ol>
    </nav>
    </div>
    </div>
    </div>
);

export default CheckoutBreadcrumb;
