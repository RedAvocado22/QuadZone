export type UserRole = "STAFF" | "CUSTOMER" | "SHIPER";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phoneNumber?: string;
    address?: string;
    city?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    dateOfBirth?: string;
}
