import { useState, useCallback } from "react";

import type { CardProps } from "@mui/material/Card";
import type { IconifyName } from "src/components/iconify";

import { varAlpha } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";

import { fDate, fShortenNumber } from "src/utils/formatters";

import { Iconify } from "src/components/iconify";
import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

export type IPostItem = {
    id: string;
    title: string;
    coverUrl: string;
    totalViews: number;
    description: string;
    totalShares: number;
    totalComments: number;
    totalFavorites: number;
    postedAt: string | number | null;
    author: {
        name: string;
        avatarUrl: string;
    };
};

export function PostItem({
    sx,
    post,
    latestPost,
    latestPostLarge,
    onView,
    onEdit,
    onDelete,
    ...other
}: CardProps & {
    post: IPostItem;
    latestPost: boolean;
    latestPostLarge: boolean;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    const handleView = useCallback(() => {
        handleClosePopover();
        if (onView) {
            onView(post.id);
        }
    }, [onView, post.id, handleClosePopover]);

    const handleEdit = useCallback(() => {
        handleClosePopover();
        if (onEdit) {
            onEdit(post.id);
        }
    }, [onEdit, post.id, handleClosePopover]);

    const handleDelete = useCallback(() => {
        handleClosePopover();
        if (onDelete) {
            onDelete(post.id);
        }
    }, [onDelete, post.id, handleClosePopover]);

    const renderAvatar = (
        <Avatar
            alt={post.author.name}
            src={post.author.avatarUrl}
            sx={{
                left: 24,
                zIndex: 9,
                bottom: -24,
                position: "absolute",
                ...((latestPostLarge || latestPost) && {
                    top: 24
                })
            }}
        />
    );

    const renderTitle = (
        <Link
            color="inherit"
            variant="subtitle2"
            underline="hover"
            onClick={(event) => {
                event.preventDefault();
                if (onView) {
                    onView(post.id);
                }
            }}
            sx={{
                height: 44,
                overflow: "hidden",
                WebkitLineClamp: 2,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                ...(latestPostLarge && { typography: "h5", height: 60 }),
                ...((latestPostLarge || latestPost) && {
                    color: "common.white"
                })
            }}>
            {post.title}
        </Link>
    );

    const renderInfo = (
        <Box
            sx={{
                mt: 3,
                gap: 1.5,
                display: "flex",
                flexWrap: "wrap",
                color: "text.disabled",
                justifyContent: "flex-end"
            }}>
            {[
                { number: post.totalComments, icon: "solar:chat-round-dots-bold" },
                { number: post.totalViews, icon: "solar:eye-bold" },
                { number: post.totalShares, icon: "solar:share-bold" }
            ].map((info, _index) => (
                <Box
                    key={_index}
                    sx={{
                        display: "flex",
                        ...((latestPostLarge || latestPost) && {
                            opacity: 0.64,
                            color: "common.white"
                        })
                    }}>
                    <Iconify width={16} icon={info.icon as IconifyName} sx={{ mr: 0.5 }} />
                    <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
                </Box>
            ))}
        </Box>
    );

    const renderCover = (
        <Box
            component="img"
            alt={post.title}
            src={post.coverUrl}
            sx={{
                top: 0,
                width: 1,
                height: 1,
                objectFit: "cover",
                position: "absolute"
            }}
        />
    );

    const renderDate = (
        <Typography
            variant="caption"
            component="div"
            sx={{
                mb: 1,
                color: "text.disabled",
                ...((latestPostLarge || latestPost) && {
                    opacity: 0.48,
                    color: "common.white"
                })
            }}>
            {fDate(post.postedAt)}
        </Typography>
    );

    const renderShape = (
        <SvgColor
            src="/assets/icons/shape-avatar.svg"
            sx={{
                left: 0,
                width: 88,
                zIndex: 9,
                height: 36,
                bottom: -16,
                position: "absolute",
                color: "background.paper",
                ...((latestPostLarge || latestPost) && { display: "none" })
            }}
        />
    );

    const renderActions = (
        <IconButton
            onClick={handleOpenPopover}
            sx={{
                top: 8,
                right: 8,
                zIndex: 20,
                position: "absolute",
                bgcolor: "background.paper",
                "&:hover": {
                    bgcolor: "background.paper"
                }
            }}>
            <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
    );

    return (
        <>
            <Card sx={sx} {...other}>
                <Box
                    sx={(theme) => ({
                        position: "relative",
                        pt: "calc(100% * 3 / 4)",
                        ...((latestPostLarge || latestPost) && {
                            pt: "calc(100% * 4 / 3)",
                            "&:after": {
                                top: 0,
                                content: "''",
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                bgcolor: varAlpha(theme.palette.grey["900Channel"], 0.72)
                            }
                        }),
                        ...(latestPostLarge && {
                            pt: {
                                xs: "calc(100% * 4 / 3)",
                                sm: "calc(100% * 3 / 4.66)"
                            }
                        })
                    })}>
                    {renderShape}
                    {renderAvatar}
                    {renderCover}
                    {renderActions}
                </Box>

                <Box
                    sx={(theme) => ({
                        p: theme.spacing(6, 3, 3, 3),
                        ...((latestPostLarge || latestPost) && {
                            width: 1,
                            bottom: 0,
                            position: "absolute"
                        })
                    })}>
                    {renderDate}
                    {renderTitle}
                    {renderInfo}
                </Box>
            </Card>

            <Popover
                open={!!openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}>
                <MenuList
                    disablePadding
                    sx={{
                        p: 0.5,
                        gap: 0.5,
                        width: 160,
                        display: "flex",
                        flexDirection: "column",
                        [`& .${menuItemClasses.root}`]: {
                            px: 1,
                            gap: 2,
                            borderRadius: 0.75,
                            [`&.${menuItemClasses.selected}`]: { bgcolor: "action.selected" }
                        }
                    }}>
                    <MenuItem onClick={handleView}>
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>

                    <MenuItem onClick={handleEdit}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>

                    <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
