import React from 'react';
import { type ChatMessage as ChatMessageType, MessageType, formatMessageTime } from '../../api/chat';

interface ChatMessageProps {
    message: ChatMessageType;
    isOwn: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn }) => {
    // Get avatar URL or use default
    const getAvatarUrl = () => {
        if (message.senderAvatar) {
            return message.senderAvatar;
        }
        
        // Use first letter of sender name as fallback
        const initial = message.senderName ? message.senderName[0].toUpperCase() : '?';
        return null;
    };
    
    const avatarUrl = getAvatarUrl();
    const initial = message.senderName ? message.senderName[0].toUpperCase() : '?';
    
    // Render different message types
    const renderMessageContent = () => {
        switch (message.messageType) {
            case MessageType.SYSTEM:
                return (
                    <div className="message-system">
                        <span className="message-system-content">{message.content}</span>
                        <span className="message-time">{formatMessageTime(message.sentAt)}</span>
                    </div>
                );
                
            case MessageType.TEXT:
            default:
                return (
                    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
                        <p className="message-content">{message.content}</p>
                        <span className="message-time">{formatMessageTime(message.sentAt)}</span>
                    </div>
                );
        }
    };
    
    // System messages don't need wrapper
    if (message.messageType === MessageType.SYSTEM) {
        return renderMessageContent();
    }
    
    return (
        <div className={`message-wrapper ${isOwn ? 'own' : 'other'}`}>
            {/* Avatar for other's messages */}
            {!isOwn && (
                <div className="message-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={message.senderName} />
                    ) : (
                        <div className="message-avatar-fallback">{initial}</div>
                    )}
                </div>
            )}
            
            <div className="message-content-wrapper">
                {/* Sender name for other's messages */}
                {!isOwn && (
                    <span className="message-sender">{message.senderName}</span>
                )}
                
                {renderMessageContent()}
                
                {/* Read indicator for own messages */}
                {isOwn && message.read && (
                    <span className="message-read-indicator" title="Đã xem">✓✓</span>
                )}
            </div>
            
            {/* Avatar for own messages */}
            {isOwn && (
                <div className="message-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={message.senderName} />
                    ) : (
                        <div className="message-avatar-fallback">{initial}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
