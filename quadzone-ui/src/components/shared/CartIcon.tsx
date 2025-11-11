import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

const CartIcon = () => {
    const { totalItems, totalPrice } = useCart();

    return (
        <li className="col pr-xl-0 px-2 px-sm-3">
            <Link
                to="/cart"
                className="text-gray-90 position-relative d-flex"
                data-toggle="tooltip"
                data-placement="top"
                title="Cart">
                <i className="font-size-22 ec ec-shopping-bag"></i>
                <span className="width-22 height-22 bg-dark position-absolute d-flex align-items-center justify-content-center rounded-circle left-12 top-8 font-weight-bold font-size-12 text-white">
                    {totalItems}
                </span>
                <span className="d-none d-xl-block font-weight-bold font-size-16 text-gray-90 ml-3">
                    ${totalPrice.toFixed(2)}
                </span>
            </Link>
        </li>
    );
};

export default CartIcon;
