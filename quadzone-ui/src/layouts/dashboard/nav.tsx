import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useEffect } from "react";

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
                backgroundColor: theme.vars?.palette.grey[900] || theme.palette.grey[900] || "#121212",
                borderRight: "none",
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

    const theme = useTheme();

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
                    backgroundColor: theme.vars?.palette.grey[900] || theme.palette.grey[900],
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
                            gap: 0,
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
                                                const whiteColor =
                                                    theme.vars?.palette.common.white || theme.palette.common.white || "#FFFFFF";
                                                const activeBgColor = "#42A5F5"; // Light blue solid background for active state - lighter shade
                                                const hoverBgColor = "rgba(66, 165, 245, 0.3)"; // Lighter blue with opacity for hover state

                                                return {
                                                    pl: 2,
                                                    py: 1.5,
                                                    gap: 2,
                                                    pr: 1.5,
                                                    borderRadius: 1,
                                                    typography: "body2",
                                                    fontWeight: "fontWeightMedium",
                                                    color: whiteColor,
                                                    minHeight: 44,
                                                    ...(isActived && {
                                                        fontWeight: "fontWeightSemiBold",
                                                        color: whiteColor,
                                                        bgcolor: activeBgColor,
                                                        "&:hover": {
                                                            bgcolor: activeBgColor,
                                                            color: whiteColor
                                                        }
                                                    }),
                                                    ...(!isActived && {
                                                        "&:hover": {
                                                            bgcolor: hoverBgColor,
                                                            color: whiteColor
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
