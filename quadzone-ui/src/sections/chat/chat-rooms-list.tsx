import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { Iconify } from 'src/components/iconify';
import type { ChatRoom } from 'src/api/chat';
import { getAllActiveChatRooms } from 'src/api/chat';

import { ChatRoomCard } from './chat-room-card';

// ----------------------------------------------------------------------

interface ChatRoomsListProps {
  selectedRoomId?: number;
  onRoomSelect: (room: ChatRoom) => void;
  onRefresh?: () => void;
}

export function ChatRoomsList({ selectedRoomId, onRoomSelect, onRefresh }: ChatRoomsListProps) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL');
  const [page, setPage] = useState(0);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllActiveChatRooms(page, 50);
      setRooms(response.content);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (onRefresh) {
      loadRooms();
    }
  }, [onRefresh, loadRooms]);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    // "ACTIVE" tab shows both ACTIVE and ASSIGNED rooms (rooms needing attention)
    let matchesStatus = false;
    if (statusFilter === 'ALL') {
      matchesStatus = true;
    } else if (statusFilter === 'ACTIVE') {
      matchesStatus = room.status === 'ACTIVE' || room.status === 'ASSIGNED';
    } else if (statusFilter === 'CLOSED') {
      matchesStatus = room.status === 'CLOSED';
    }

    return matchesSearch && matchesStatus;
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'ALL' | 'ACTIVE' | 'CLOSED') => {
    setStatusFilter(newValue);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Chat Rooms
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Status tabs */}
        <Tabs
          value={statusFilter}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab label="All" value="ALL" />
          <Tab label="Active" value="ACTIVE" />
          <Tab label="Closed" value="CLOSED" />
        </Tabs>
      </Box>

      {/* Rooms list */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredRooms.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Iconify
              icon={"eva:inbox-outline" as any}
              sx={{ width: 64, height: 64, mb: 2, color: 'text.disabled' }}
            />
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No chat rooms found' : 'No chat rooms yet'}
            </Typography>
          </Box>
        ) : (
          filteredRooms.map((room) => (
            <ChatRoomCard
              key={room.id}
              room={room}
              selected={room.id === selectedRoomId}
              onClick={() => onRoomSelect(room)}
            />
          ))
        )}
      </Box>
    </Card>
  );
}

