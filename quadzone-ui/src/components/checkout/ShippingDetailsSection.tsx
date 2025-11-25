import type { AddressFields } from "../../types/checkout";
import AddressFieldsSection from "./AddressFieldSection";

interface ShippingDetailsSectionProps {
    shippingAddress: AddressFields;
    shipToDifferentAddress: boolean;
    onToggle: (value: boolean) => void;
    onChange: (field: keyof AddressFields, value: string) => void;
}

const ShippingDetailsSection = ({
                                    shippingAddress,
                                    shipToDifferentAddress,
                                    onToggle,
                                    onChange,
                                }: ShippingDetailsSectionProps) => (
    <>
        <div className="border-bottom border-color-1 mb-4 mt-5">
            <h3 className="section-title mb-0 pb-2 font-size-25">Shipping details</h3>
        </div>
        <div className="custom-control custom-checkbox d-flex align-items-center">
            <input
                type="checkbox"
                className="custom-control-input"
                id="shipToDifferent"
                checked={shipToDifferentAddress}
                onChange={(event) => onToggle(event.target.checked)}
            />
            <label className="custom-control-label form-label" htmlFor="shipToDifferent">
                Ship to a different address?
            </label>
        </div>
        {shipToDifferentAddress && (
            <div className="mt-4">
                <AddressFieldsSection
                    title="Shipping details"
                    address={shippingAddress}
                    onChange={onChange}
                    prefix="shipping"
                />
            </div>
        )}
    </>
);

export default ShippingDetailsSection;
