interface OrderNotesProps {
    value: string;
    onChange: (value: string) => void;
}

const OrderNotes = ({ value, onChange }: OrderNotesProps) => (
    <div className="form-group mt-4">
        <label className="form-label" htmlFor="orderNotes">
            Order notes (optional)
        </label>
        <textarea
            id="orderNotes"
            className="form-control p-4"
            rows={4}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Notes about your order, e.g. special instructions for delivery."
        />
    </div>
);

export default OrderNotes;

