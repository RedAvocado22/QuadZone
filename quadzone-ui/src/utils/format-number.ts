/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

export type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions;

const DEFAULT_LOCALE = { code: 'en-US', currency: 'USD' };

function processInput(inputValue: InputNumberValue): number | null {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

// ----------------------------------------------------------------------

export function fNumber(inputValue: InputNumberValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  return new Intl.NumberFormat(locale.code, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
    }).format(number);
}

// ----------------------------------------------------------------------

export function fCurrency(inputValue: InputNumberValue, options?: Options & { currency?: string }) {
  const currencyCode = options?.currency || DEFAULT_LOCALE.currency;
  const locale = currencyCode === 'VND' ? { code: 'vi-VN', currency: 'VND' } : DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const { currency: _, ...restOptions } = options || {};

  return new Intl.NumberFormat(locale.code, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: currencyCode === 'VND' ? 0 : 2,
        ...restOptions
    }).format(number);
}

// ----------------------------------------------------------------------

export function fPercent(inputValue: InputNumberValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  return new Intl.NumberFormat(locale.code, {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        ...options
    }).format(number / 100);
}

// ----------------------------------------------------------------------

export function fShortenNumber(inputValue: InputNumberValue, options?: Options) {
  const locale = DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    notation: 'compact',
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}
