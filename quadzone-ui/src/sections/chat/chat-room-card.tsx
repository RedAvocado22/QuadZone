import { memo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';

import type { ChatRoom, ChatRoomStatus } from 'src/api/chat';
import { formatMessageTime } from 'src/api/chat';

// ----------------------------------------------------------------------

interface ChatRoomCardProps {
  room: ChatRoom;
  selected?: boolean;
  onClick?: () => void;
}

const getStatusColor = (status: ChatRoomStatus): 'success' | 'warning' | 'default' => {
  switch (status) {
    case 'ACTIVE':
      return 'warning';
    case 'ASSIGNED':
      return 'success';
    case 'CLOSED':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: ChatRoomStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Waiting';
    case 'ASSIGNED':
      return 'In Progress';
    case 'CLOSED':
      return 'Closed';
    default:
      return status;
  }
};

export const ChatRoomCard = memo(({ room, selected = false, onClick }: ChatRoomCardProps) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2,
        mb: 1,
        cursor: 'pointer',
        transition: 'all 0.2s',
        bgcolor: selected ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'background.paper',
        borderLeft: selected ? (theme) => `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.primary.main, selected ? 0.12 : 0.04),
          transform: 'translateX(4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Avatar with unread badge */}
        <Badge
          badgeContent={room.unreadCount || 0}
          color="error"
          max={99}
          invisible={!room.unreadCount}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            {room.customerName.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>

        {/* Room info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" noWrap>
              {room.customerName}
            </Typography>
            <Chip
              label={getStatusLabel(room.status)}
              color={getStatusColor(room.status)}
              size="small"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.5 }}
            noWrap
          >
            {room.customerEmail}
          </Typography>

          {room.staffName && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ fontWeight: 'medium' }}>
                Staff:
              </Box>
              {room.staffName}
            </Typography>
          )}
        </Box>

        {/* Time */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            {room.lastMessageAt ? formatMessageTime(room.lastMessageAt) : formatMessageTime(room.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
});

ChatRoomCard.displayName = 'ChatRoomCard';

