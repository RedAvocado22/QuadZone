import type { Theme } from "@mui/material/styles";

import { createTheme as createMuiTheme } from "@mui/material/styles";

import { shadows } from "./core/shadows";
import { palette } from "./core/palette";
import { themeConfig } from "./theme-config";
import { components } from "./core";
import { typography } from "./core";
import { customShadows } from "./core";

import type { ThemeOptions } from "./types";

// ----------------------------------------------------------------------

export const baseTheme: ThemeOptions = {
    colorSchemes: {
        light: {
            palette: palette.light,
            shadows: shadows.light,
            customShadows: customShadows.light
        }
    },
    components,
    typography,
    shape: { borderRadius: 8 },
    cssVariables: themeConfig.cssVariables
};

// ----------------------------------------------------------------------

type CreateThemeProps = {
    themeOverrides?: ThemeOptions;
};

export function createTheme({ themeOverrides = {} }: CreateThemeProps = {}): Theme {
    return createMuiTheme(baseTheme, themeOverrides);
}
