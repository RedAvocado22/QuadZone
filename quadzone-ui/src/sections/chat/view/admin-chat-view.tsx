import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';
import type { ChatRoom } from 'src/api/chat';
import { Iconify } from 'src/components/iconify';
import webSocketService from 'src/services/websocket';
import { useUser } from 'src/hooks/useUser';

import { ChatRoomsList } from '../chat-rooms-list';
import { AdminChatWindow } from '../admin-chat-window';

// ----------------------------------------------------------------------

export function AdminChatView() {
  const { user } = useUser();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to WebSocket
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    const wsUrl = backendUrl.replace('/api/v1', '').replace('http://', '') + '/ws';
    const fullWsUrl = `http://${wsUrl}`;

    const connectWebSocket = async () => {
      try {
        if (!webSocketService.isConnected()) {
          await webSocketService.connect({
            url: fullWsUrl,
            token,
            getToken: () => {
              const freshToken = localStorage.getItem('access_token');
              return freshToken;
            },
            onConnect: () => {
              console.log('[Admin Chat] WebSocket connected');
              setIsConnected(true);
            },
            onDisconnect: () => {
              console.log('[Admin Chat] WebSocket disconnected');
              setIsConnected(false);
            },
            onError: (error) => {
              console.error('[Admin Chat] WebSocket error:', error);
            },
          });
        } else {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('[Admin Chat] Failed to connect:', error);
      }
    };

    connectWebSocket();
  }, [user]);

  const handleRoomSelect = useCallback((room: ChatRoom) => {
    setSelectedRoom(room);
  }, []);

  const handleRoomUpdate = useCallback((updatedRoom: ChatRoom) => {
    setSelectedRoom(updatedRoom);
    setRefreshKey((prev) => prev + 1); // Trigger room list refresh
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="solar:chat-round-line-bold-duotone" sx={{ width: 32, height: 32, mr: 2 }} />
        <Typography variant="h4">Chat Management</Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isConnected ? 'success.main' : 'error.main',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {isConnected ? 'Connected' : 'Disconnected'}
          </Typography>
        </Box>
      </Box>

      {/* Chat interface */}
      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Left: Room list */}
        <Grid item xs={12} md={4}>
          <ChatRoomsList
            selectedRoomId={selectedRoom?.id}
            onRoomSelect={handleRoomSelect}
            onRefresh={refreshKey > 0 ? () => {} : undefined}
          />
        </Grid>

        {/* Right: Chat window */}
        <Grid item xs={12} md={8}>
          {selectedRoom ? (
            <AdminChatWindow room={selectedRoom} onRoomUpdate={handleRoomUpdate} />
          ) : (
            <Paper
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Iconify
                  icon="solar:chat-round-line-bold-duotone"
                  sx={{ width: 80, height: 80, mb: 2, color: 'text.disabled' }}
                />
                <Typography variant="h6" color="text.secondary">
                  Select a chat room to start
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                  Choose a chat room from the list on the left
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

