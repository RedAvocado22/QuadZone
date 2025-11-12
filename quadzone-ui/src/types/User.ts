export type UserRole = "STAFF" | "CUSTOMER" | "SHIPER";

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
}
