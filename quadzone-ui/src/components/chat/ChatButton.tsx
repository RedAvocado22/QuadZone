import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useUser } from '../../hooks/useUser';

const ChatButton: React.FC = () => {
    const { user } = useUser();
    const { isOpen, openChat, unreadCount, isConnected } = useChat();
    
    // Don't show chat button if user is not logged in
    if (!user) {
        return null;
    }
    
    // Don't show if chat window is already open
    if (isOpen) {
        return null;
    }
    
    return (
        <div className="chat-button-container">
            <button
                className="chat-button"
                onClick={openChat}
                title="Open support chat"
                aria-label="Open support chat"
            >
                <div className="chat-button-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                </div>
                
                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="chat-button-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                
                {/* Connection status indicator */}
                <span 
                    className={`chat-button-status ${isConnected ? 'online' : 'offline'}`}
                    title={isConnected ? 'Online' : 'Offline'}
                />
            </button>
            
            {/* Tooltip */}
            <div className="chat-button-tooltip">
                Chat with support staff
            </div>
        </div>
    );
};

export default ChatButton;
