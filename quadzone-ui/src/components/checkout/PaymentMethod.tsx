import type { PaymentMethod } from "../../types/checkout";

interface PaymentMethodsProps {
    selected: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

const paymentOptions: { label: string; value: PaymentMethod; description: string }[] = [
    {
        label: "Cash on delivery",
        value: "cod",
        description: "Pay with cash when your order is delivered to your door.",
    },
    {
        label: "PayPal",
        value: "paypal",
        description: "Pay securely via PayPal; you can use your credit card if you don’t have a PayPal account.",
    },
    {
        label: "VNPay",
        value: "vnpay",
        description: "Thanh toán nhanh qua VNPay. Bạn sẽ được chuyển tới cổng VNPay để hoàn tất giao dịch.",
    },
];

const PaymentMethods = ({ selected, onChange }: PaymentMethodsProps) => (
    <div className="border-top border-width-3 border-color-1 pt-3 mb-3">
        {paymentOptions.map((option) => (
            <div key={option.value} className="border-bottom border-color-1 border-dotted-bottom">
                <div className="p-3">
                    <div className="custom-control custom-radio">
                        <input
                            type="radio"
                            className="custom-control-input"
                            id={`payment-${option.value}`}
                            name="paymentMethod"
                            value={option.value}
                            checked={selected === option.value}
                            onChange={() => onChange(option.value)}
                        />
                        <label className="custom-control-label form-label" htmlFor={`payment-${option.value}`}>
                            {option.label}
                        </label>
                    </div>
                    {selected === option.value && (
                        <div className="bg-dark-lighter border-top border-dotted-top mt-3 p-3 rounded">
                            {option.description}
                        </div>
                    )}
                </div>
            </div>
        ))}
    </div>
);

export default PaymentMethods;
