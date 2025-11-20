import type { FormEvent } from "react";

interface CouponSectionProps {
    isOpen: boolean;
    couponCode: string;
    onToggle: () => void;
    onChange: (value: string) => void;
    onApply: (event: FormEvent) => void;
}

const CouponSection = ({ isOpen, couponCode, onToggle, onChange, onApply }: CouponSectionProps) => (
    <div className="accordion rounded mb-5">
        <div className="card border-0">
            <div className="alert alert-primary mb-0" role="alert">
                Have a coupon?{" "}
                <button type="button" className="btn btn-link p-0 align-baseline" onClick={onToggle}>
                    Click here to enter your code
                </button>
            </div>
            {isOpen && (
                <div className="border p-4">
                    <p className="text-gray-90">If you have a coupon code, please apply it below.</p>
                    <form onSubmit={onApply}>
                        <div className="input-group input-group-pill max-width-660-xl">
                            <input
                                type="text"
                                className="form-control"
                                value={couponCode}
                                onChange={(event) => onChange(event.target.value)}
                                placeholder="Coupon code"
                            />
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-dark btn-pill px-4" disabled={!couponCode.trim()}>
                                    Apply coupon
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    </div>
);

export default CouponSection;

