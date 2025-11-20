interface TermsCheckboxProps {
    checked: boolean;
    onChange: (value: boolean) => void;
}

const TermsCheckbox = ({ checked, onChange }: TermsCheckboxProps) => (
    <div className="form-group d-flex align-items-center justify-content-between px-1 mb-4">
        <div className="custom-control custom-checkbox">
            <input
                type="checkbox"
                className="custom-control-input"
                id="terms"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            <label className="custom-control-label form-label" htmlFor="terms">
                I have read and agree to the website{" "}
                <a href="/terms" className="text-blue">
                    terms and conditions
                </a>{" "}
                <span className="text-danger">*</span>
            </label>
        </div>
    </div>
);

export default TermsCheckbox;

