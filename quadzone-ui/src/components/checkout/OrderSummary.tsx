interface OrderSummaryItem {
    id: number | string;
    name: string;
    quantity: number;
    total: string;
}

import type { ReactNode } from "react";

interface OrderSummaryProps {
    items: OrderSummaryItem[];
    subtotal: string;
    shipping: ReactNode;
    total: string;
}

const OrderSummary = ({ items, subtotal, shipping, total }: OrderSummaryProps) => (
    <div className="bg-gray-1 rounded-lg p-4">
        <div className="border-bottom border-color-1 mb-4">
            <h3 className="section-title mb-0 pb-2 font-size-25">Your order</h3>
        </div>
        <div className="checkout-table mb-4">
            <table className="table">
                <thead>
                <tr>
                    <th className="product-name">Product</th>
                    <th className="product-total text-right">Total</th>
                </tr>
                </thead>
                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan={2} className="text-center text-muted py-4">
                            Your cart is empty.
                        </td>
                    </tr>
                ) : (
                    items.map((item) => (
                        <tr key={item.id} className="cart_item">
                            <td>
                                {item.name} <strong className="product-quantity">× {item.quantity}</strong>
                            </td>
                            <td className="text-right">{item.total}</td>
                        </tr>
                    ))
                )}
                </tbody>
                <tfoot>
                <tr>
                    <th>Subtotal</th>
                    <td className="text-right">{subtotal}</td>
                </tr>
                <tr>
                    <th>Shipping</th>
                    <td className="text-right">{shipping}</td>
                </tr>
                <tr>
                    <th>Total</th>
                    <td className="text-right">
                        <strong>{total}</strong>
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
);

export default OrderSummary;
