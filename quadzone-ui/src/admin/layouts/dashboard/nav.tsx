import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useEffect } from "react";
import { varAlpha } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer, { drawerClasses } from "@mui/material/Drawer";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";

import type { NavItem } from "../nav-config-dashboard";

// ----------------------------------------------------------------------

export type NavContentProps = {
    data: NavItem[];
    slots?: {
        topArea?: React.ReactNode;
        bottomArea?: React.ReactNode;
    };
    sx?: SxProps<Theme>;
};

export function NavDesktop({ sx, data, slots, layoutQuery }: NavContentProps & { layoutQuery: Breakpoint }) {
    const theme = useTheme();
    const grey500Channel = theme.vars?.palette.grey["500Channel"];

    return (
        <Box
            sx={{
                pt: 2.5,
                px: 2.5,
                top: 0,
                left: 0,
                height: 1,
                display: "none",
                position: "fixed",
                flexDirection: "column",
                zIndex: "var(--layout-nav-zIndex)",
                width: "var(--layout-nav-vertical-width)",
                borderRight: grey500Channel
                    ? `1px solid ${varAlpha(grey500Channel, 0.12)}`
                    : `1px solid ${theme.palette.divider}`,
                [theme.breakpoints.up(layoutQuery)]: {
                    display: "flex"
                },
                ...sx
            }}>
            <NavContent data={data} slots={slots} />
        </Box>
    );
}

// ----------------------------------------------------------------------

export function NavMobile({
    sx,
    data,
    open,
    slots,
    onClose
}: NavContentProps & { open: boolean; onClose: () => void }) {
    const pathname = usePathname();

    useEffect(() => {
        if (open) {
            onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <Drawer
            open={open}
            onClose={onClose}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    pt: 2.5,
                    px: 2.5,
                    overflow: "unset",
                    width: "var(--layout-nav-mobile-width)",
                    ...sx
                }
            }}>
            <NavContent data={data} slots={slots} />
        </Drawer>
    );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
    const pathname = usePathname();

    return (
        <>
            <Logo />

            {slots?.topArea}

            <Scrollbar fillContent>
                <Box
                    component="nav"
                    sx={[
                        {
                            display: "flex",
                            flex: "1 1 auto",
                            flexDirection: "column"
                        },
                        ...(Array.isArray(sx) ? sx : [sx])
                    ]}>
                    <Box
                        component="ul"
                        sx={{
                            gap: 0.5,
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        {data.map((item) => {
                            // Normalize paths: remove trailing slashes for comparison
                            const normalizedPathname = pathname.replace(/\/$/, "") || pathname;
                            const normalizedItemPath = item.path.replace(/\/$/, "") || item.path;

                            // Check if pathname matches exactly
                            const isActived = normalizedPathname === normalizedItemPath;

                            return (
                                <ListItem disableGutters disablePadding key={item.title}>
                                    <ListItemButton
                                        disableGutters
                                        component={RouterLink}
                                        href={item.path}
                                        sx={[
                                            (theme) => {
                                                const textSecondary =
                                                    theme.vars?.palette.text.secondary || theme.palette.text.secondary;
                                                const primaryMain =
                                                    theme.vars?.palette.primary.main || theme.palette.primary.main;
                                                const primaryMainChannel = theme.vars?.palette.primary.mainChannel;

                                                return {
                                                    pl: 2,
                                                    py: 1,
                                                    gap: 2,
                                                    pr: 1.5,
                                                    borderRadius: 0.75,
                                                    typography: "body2",
                                                    fontWeight: "fontWeightMedium",
                                                    color: textSecondary,
                                                    minHeight: 44,
                                                    ...(isActived && {
                                                        fontWeight: "fontWeightSemiBold",
                                                        color: primaryMain,
                                                        bgcolor: primaryMainChannel
                                                            ? varAlpha(primaryMainChannel, 0.08)
                                                            : "action.selected",
                                                        "&:hover": {
                                                            bgcolor: primaryMainChannel
                                                                ? varAlpha(primaryMainChannel, 0.16)
                                                                : "action.hover"
                                                        }
                                                    })
                                                };
                                            }
                                        ]}>
                                        <Box component="span" sx={{ width: 24, height: 24 }}>
                                            {item.icon}
                                        </Box>

                                        <Box component="span" sx={{ flexGrow: 1 }}>
                                            {item.title}
                                        </Box>

                                        {item.info && item.info}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </Box>
                </Box>
            </Scrollbar>

            {slots?.bottomArea}
        </>
    );
}
