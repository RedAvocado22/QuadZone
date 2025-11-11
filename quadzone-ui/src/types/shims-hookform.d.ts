/* eslint-disable */
// Temporary shims for form libraries until type resolution is available in the environment.
// These are minimal and intended to silence missing-module/type errors; prefer the real types shipped with the packages.
// @ts-nocheck

declare module "react-hook-form" {
    // Minimal typings to satisfy TypeScript when library types aren't resolved in the environment.
    // Prefer installing the real package types; this file is a temporary shim.
    export function useForm<T = any>(opts?: any): any;
    export type UseFormRegister<T> = any;
    export type FieldErrors = any;
}

declare module "@hookform/resolvers/yup" {
    import * as yup from "yup";
    export function yupResolver(schema: yup.AnySchema): any;
}

declare module "yup" {
    // Re-export the real yup types if available; otherwise minimal shims
    export type AnySchema = any;
    export const string: any;
    export const object: any;
    export const ref: (s: string) => any;
}
