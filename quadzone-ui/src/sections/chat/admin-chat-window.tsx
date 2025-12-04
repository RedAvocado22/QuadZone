import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { Iconify } from 'src/components/iconify';
import type { ChatRoom, ChatMessage } from 'src/api/chat';
import { 
  getMessageHistory, 
  formatMessageTime, 
  ChatRoomStatus,
  closeChatRoom,
  assignStaff,
  MessageType 
} from 'src/api/chat';
import { useUser } from 'src/hooks/useUser';
import webSocketService from 'src/services/websocket';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

interface AdminChatWindowProps {
  room: ChatRoom;
  onRoomUpdate?: (room: ChatRoom) => void;
}

export function AdminChatWindow({ room, onRoomUpdate }: AdminChatWindowProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<string | null>(null);

  // Load message history
  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const history = await getMessageHistory(room.id, 0, 100);
      setMessages(history.content.reverse());
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [room.id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Subscribe to room messages
  useEffect(() => {
    if (!webSocketService.isConnected() || !room.id) return;

    const destination = `/queue/messages/${room.id}`;

    subscriptionRef.current = webSocketService.subscribe(destination, (message) => {
      // Handle room status updates
      if (message.type === 'ROOM_CLOSED') {
        if (onRoomUpdate) {
          onRoomUpdate({ ...room, status: ChatRoomStatus.CLOSED });
        }
        toast.info('Chat room has been closed');
        return;
      }

      if (message.type === 'STAFF_ASSIGNED') {
        if (onRoomUpdate) {
          onRoomUpdate({
            ...room,
            staffId: message.staffId,
            staffName: message.staffName,
            status: ChatRoomStatus.ASSIGNED,
          });
        }
        toast.success(`Staff ${message.staffName} has joined the chat`);
        return;
      }

      // Handle regular chat message
      const chatMessage: ChatMessage = {
        id: message.id,
        roomId: message.roomId,
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
        content: message.content,
        messageType: message.messageType || MessageType.TEXT,
        sentAt: message.sentAt,
        read: false,
      };

      // Add message to the list (avoid duplicates)
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === chatMessage.id);
        if (exists) return prev;
        return [chatMessage, ...prev];
      });
    });

    // Join the room
    webSocketService.sendMessage('/app/chat.join', { roomId: room.id });

    return () => {
      if (subscriptionRef.current) {
        webSocketService.unsubscribe(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [room, onRoomUpdate]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !user || sending) return;

    setSending(true);
    try {
      if (!webSocketService.isConnected()) {
        toast.error('Chat connection lost. Please try again.');
        return;
      }

      webSocketService.sendMessage('/app/chat.send', {
        roomId: room.id,
        senderId: user.id,
        content: inputValue.trim(),
      });

      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }, [inputValue, user, room.id, sending]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleAssignToMe = useCallback(async () => {
    if (!user) return;
    
    try {
      const updatedRoom = await assignStaff(room.id, user.id);
      if (onRoomUpdate) {
        onRoomUpdate(updatedRoom);
      }
      toast.success('You have been assigned to this chat room');
    } catch (error) {
      console.error('Failed to assign staff:', error);
      toast.error('Failed to assign staff');
    }
  }, [room.id, user, onRoomUpdate]);

  const handleCloseRoom = useCallback(async () => {
    if (!window.confirm('Are you sure you want to close this chat room?')) return;

    try {
      const updatedRoom = await closeChatRoom(room.id);
      if (onRoomUpdate) {
        onRoomUpdate(updatedRoom);
      }
      toast.success('Chat room has been closed');
    } catch (error) {
      console.error('Failed to close room:', error);
      toast.error('Failed to close chat room');
    }
  }, [room.id, onRoomUpdate]);

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

  const isOwnMessage = useMemo(() => {
    return (message: ChatMessage) => message.senderId === user?.id;
  }, [user]);

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
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.neutral',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{room.customerName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {room.customerEmail}
            </Typography>
          </Box>

          <Chip label={getStatusLabel(room.status)} color={getStatusColor(room.status)} />
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {room.status === 'ACTIVE' && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAssignToMe}
            >
              Accept
            </Button>
          )}
          {room.status !== 'CLOSED' && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="mingcute:close-line" />}
              onClick={handleCloseRoom}
            >
              Close Chat
            </Button>
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No messages yet
            </Typography>
          </Box>
        ) : (
          <>
            {/* Render messages in reverse order (oldest at top) */}
            {[...messages].reverse().map((message) => {
              const isOwn = isOwnMessage(message);
              const isSystem = message.messageType === MessageType.SYSTEM;

              if (isSystem) {
                return (
                  <Box key={message.id} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Chip label={message.content} size="small" />
                  </Box>
                );
              }

              return (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                    }}
                  >
                    {!isOwn && (
                      <Typography variant="caption" color="text.secondary">
                        {message.senderName}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: isOwn ? 'primary.light' : 'background.paper',
                        color: isOwn ? 'primary.contrastText' : 'text.primary',
                        wordWrap: 'break-word',
                      }}
                    >
                      <Typography variant="body2">{message.content}</Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ alignSelf: isOwn ? 'flex-end' : 'flex-start' }}
                    >
                      {formatMessageTime(message.sentAt)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input */}
      {room.status !== 'CLOSED' && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sending}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!inputValue.trim() || sending}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                  },
                }}
              >
                {sending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Iconify icon="eva:arrow-ios-forward-fill" />
                )}
              </IconButton>
            </Box>
          </Box>
        </>
      )}
    </Card>
  );
}

