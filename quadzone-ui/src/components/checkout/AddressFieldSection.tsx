import type { AddressFields } from "../../types/checkout";

interface AddressFieldsSectionProps {
    title: string;
    address: AddressFields;
    onChange: (field: keyof AddressFields, value: string) => void;
    prefix: string;
}

const AddressFieldsSection = ({ title, address, onChange, prefix }: AddressFieldsSectionProps) => (
    <>
        <div className="border-bottom border-color-1 mb-4">
            <h3 className="section-title mb-0 pb-2 font-size-25">{title}</h3>
        </div>

        <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-firstName`}>
                        First name <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-firstName`}
                        type="text"
                        className="form-control"
                        value={address.firstName}
                        onChange={(event) => onChange("firstName", event.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-lastName`}>
                        Last name <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-lastName`}
                        type="text"
                        className="form-control"
                        value={address.lastName}
                        onChange={(event) => onChange("lastName", event.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-address`}>
                        Street Address <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-address`}
                        type="text"
                        className="form-control"
                        value={address.address}
                        onChange={(event) => onChange("address", event.target.value)}
                        placeholder="Enter street address"
                        required
                    />
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-apartment`}>
                        Village <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-apartment`}
                        type="text"
                        className="form-control"
                        value={address.apartment}
                        onChange={(event) => onChange("apartment", event.target.value)}
                        placeholder="Enter village"
                        required
                    />
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-block`}>
                        Block <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-block`}
                        type="text"
                        className="form-control"
                        value={address.block}
                        onChange={(event) => onChange("block", event.target.value)}
                        placeholder="Enter block"
                        required
                    />
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-district`}>
                        Town <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-district`}
                        type="text"
                        className="form-control"
                        value={address.district}
                        onChange={(event) => onChange("district", event.target.value)}
                        placeholder="Enter town"
                        required
                    />
                </div>
            </div>
            <div className="col-md-12">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-city`}>
                        City <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-city`}
                        type="text"
                        className="form-control"
                        value={address.city}
                        onChange={(event) => onChange("city", event.target.value)}
                        placeholder="Enter city"
                        required
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-email`}>
                        Email address <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-email`}
                        type="email"
                        className="form-control"
                        value={address.email}
                        onChange={(event) => onChange("email", event.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label className="form-label" htmlFor={`${prefix}-phone`}>
                        Phone <span className="text-danger">*</span>
                    </label>
                    <input
                        id={`${prefix}-phone`}
                        type="tel"
                        className="form-control"
                        value={address.phone}
                        onChange={(event) => onChange("phone", event.target.value)}
                        required
                    />
                </div>
            </div>
        </div>
    </>
);

export default AddressFieldsSection;
