/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

import type { Dayjs } from "dayjs";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

// ----------------------------------------------------------------------

dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------
// Number Formatting
// ----------------------------------------------------------------------

export type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions;

const DEFAULT_LOCALE = { code: "en-US", currency: "USD" };

function processInput(inputValue: InputNumberValue): number | null {
    if (inputValue == null || Number.isNaN(inputValue)) return null;
    return Number(inputValue);
}

export function fNumber(inputValue: InputNumberValue, options?: Options) {
    const locale = DEFAULT_LOCALE;

    const number = processInput(inputValue);
    if (number === null) return "";

    return new Intl.NumberFormat(locale.code, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
    }).format(number);
}

export function fCurrency(inputValue: InputNumberValue, options?: Options & { currency?: string }) {
    const currencyCode = options?.currency || DEFAULT_LOCALE.currency;
    const locale = currencyCode === "VND" ? { code: "vi-VN", currency: "VND" } : DEFAULT_LOCALE;

    const number = processInput(inputValue);
    if (number === null) return "";

    const { currency: _, ...restOptions } = options || {};

    return new Intl.NumberFormat(locale.code, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: currencyCode === "VND" ? 0 : 2,
        ...restOptions
    }).format(number);
}

export function fPercent(inputValue: InputNumberValue, options?: Options) {
    const locale = DEFAULT_LOCALE;

    const number = processInput(inputValue);
    if (number === null) return "";

    return new Intl.NumberFormat(locale.code, {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        ...options
    }).format(number / 100);
}

export function fShortenNumber(inputValue: InputNumberValue, options?: Options) {
    const locale = DEFAULT_LOCALE;

    const number = processInput(inputValue);
    if (number === null) return "";

    const fm = new Intl.NumberFormat(locale.code, {
        notation: "compact",
        maximumFractionDigits: 2,
        ...options
    }).format(number);

    return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------
// Date/Time Formatting
// ----------------------------------------------------------------------

/**
 * @Docs
 * https://day.js.org/docs/en/display/format
 */

/**
 * Default timezones
 * https://day.js.org/docs/en/timezone/set-default-timezone#docsNav
 *
 */

/**
 * UTC
 * https://day.js.org/docs/en/plugin/utc
 * @install
 * import utc from 'dayjs/plugin/utc';
 * dayjs.extend(utc);
 * @usage
 * dayjs().utc().format()
 *
 */

export type DatePickerFormat = Dayjs | Date | string | number | null | undefined;

export const formatPatterns = {
    dateTime: "DD MMM YYYY h:mm a", // 17 Apr 2022 12:00 am
    date: "DD MMM YYYY", // 17 Apr 2022
    time: "h:mm a", // 12:00 am
    split: {
        dateTime: "DD/MM/YYYY h:mm a", // 17/04/2022 12:00 am
        date: "DD/MM/YYYY" // 17/04/2022
    },
    paramCase: {
        dateTime: "DD-MM-YYYY h:mm a", // 17-04-2022 12:00 am
        date: "DD-MM-YYYY" // 17-04-2022
    }
};

const isValidDate = (date: DatePickerFormat) => date !== null && date !== undefined && dayjs(date).isValid();

/**
 * @output 17 Apr 2022 12:00 am
 */
export function fDateTime(date: DatePickerFormat, template?: string): string {
    if (!isValidDate(date)) {
        return "Invalid date";
    }

    return dayjs(date).format(template ?? formatPatterns.dateTime);
}

/**
 * @output 17 Apr 2022
 */
export function fDate(date: DatePickerFormat, template?: string): string {
    if (!isValidDate(date)) {
        return "Invalid date";
    }

    return dayjs(date).format(template ?? formatPatterns.date);
}

/**
 * @output a few seconds, 2 years
 */
export function fToNow(date: DatePickerFormat): string {
    if (!isValidDate(date)) {
        return "Invalid date";
    }

    return dayjs(date).toNow(true);
}
// ----------------------------------------------------------------------
// HTML to Text Conversion
// ----------------------------------------------------------------------

/**
 * Converts HTML string to plain text, preserving readability.
 * Strips HTML tags and converts common elements to readable text.
 */
export function htmlToText(html: string): string {
    if (!html) return "";

    // Replace <br> and <br/> with newlines
    let text = html.replace(/<br\s*\/?>/gi, "\n");

    // Replace <p> tags with newlines
    text = text.replace(/<\/p>/gi, "\n");
    text = text.replace(/<p[^>]*>/gi, "");

    // Replace <li> tags with bullet points
    text = text.replace(/<\/li>/gi, "\n");
    text = text.replace(/<li[^>]*>/gi, "• ");

    // Replace <h1> to <h6> with newlines and uppercase for emphasis
    for (let i = 1; i <= 6; i++) {
        text = text.replace(new RegExp(`<h${i}[^>]*>`, "gi"), "");
        text = text.replace(new RegExp(`</h${i}>`, "gi"), "\n\n");
    }

    // Replace <blockquote> with indentation
    text = text.replace(/<blockquote[^>]*>/gi, "\n    ");
    text = text.replace(/<\/blockquote>/gi, "\n");

    // Remove all remaining HTML tags
    text = text.replace(/<[^>]+>/g, "");

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, " ");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/</g, "<");
    text = text.replace(/>/g, ">");
    text = text.replace(/"/g, '"');
    text = text.replace(/&#39;/g, "'");

    // Clean up extra whitespace
    text = text.replace(/\n\s*\n/g, "\n\n"); // Multiple newlines to double
   text = text.trim();

    return text;
}
