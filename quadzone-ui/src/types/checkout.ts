export interface AddressFields {
    firstName: string;
    lastName: string;
    address: string;      // Street Address
    apartment: string;    // Village
    block: string;        // Block
    district: string;      // Town
    city: string;          // City
    email: string;
    phone: string;
}

export type AlertState =
    | { type: "idle" }
    | { type: "error"; message: string }
    | { type: "success"; message: string };

export type PaymentMethod = "bank-transfer" | "cheque" | "cod" | "paypal";
