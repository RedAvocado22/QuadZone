import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export type ProductItemProps = {
  id: string;
  name: string;
  price: number;
  status: string;
  coverUrl: string;
  colors: string[];
  priceSale: number | null;
};

type ProductItemComponentProps = {
  product: ProductItemProps;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onLock?: (id: string) => void;
  onUnlock?: (id: string) => void;
};

export function ProductItem({ product, onViewDetails, onEdit, onLock, onUnlock }: ProductItemComponentProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleViewDetails = useCallback(() => {
    handleClosePopover();
    if (onViewDetails) {
      onViewDetails(product.id);
    }
  }, [product.id, onViewDetails, handleClosePopover]);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    if (onEdit) {
      onEdit(product.id);
    }
  }, [product.id, onEdit, handleClosePopover]);

  const handleLock = useCallback(() => {
    handleClosePopover();
    if (onLock) {
      onLock(product.id);
    }
  }, [product.id, onLock, handleClosePopover]);

  const handleUnlock = useCallback(() => {
    handleClosePopover();
    if (onUnlock) {
      onUnlock(product.id);
    }
  }, [product.id, onUnlock, handleClosePopover]);

  const isLocked = product.status === 'locked';
  const renderStatus = (
    <Label
      variant="inverted"
      color={(product.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.coverUrl
                ? `http://localhost:8080/api/v1/public/images/${product.coverUrl}`
                : "/assets/img/default-product.png"}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product.priceSale && fCurrency(product.priceSale)}
      </Typography>
      &nbsp;
      {fCurrency(product.price)}
    </Typography>
  );

  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {product.status && renderStatus}
          {renderImg}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Link color="inherit" underline="hover" variant="subtitle2" noWrap sx={{ flex: 1 }}>
              {product.name}
            </Link>
            <IconButton
              onClick={handleOpenPopover}
              size="small"
              sx={{
                ml: 1,
                flexShrink: 0,
              }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderPrice}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ColorPreview colors={product.colors} />
          </Box>
        </Stack>
      </Card>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleViewDetails}>
            <Iconify icon="solar:eye-bold" />
            View Details
          </MenuItem>

          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          {isLocked ? (
            <MenuItem onClick={handleUnlock} sx={{ color: 'success.main' }}>
              Unlock
            </MenuItem>
          ) : (
            <MenuItem onClick={handleLock} sx={{ color: 'error.main' }}>
              Lock
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
