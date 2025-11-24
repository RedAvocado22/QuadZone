export interface AddressFields {
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    email: string;
    phone: string;
}

export type AlertState =
    | { type: "idle" }
    | { type: "error"; message: string }
    | { type: "success"; message: string };

export type PaymentMethod = "bank-transfer" | "cheque" | "cod" | "paypal";
