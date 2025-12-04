import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useUser } from '../../hooks/useUser';
import ChatMessage from './ChatMessage';
import { ChatRoomStatus } from '../../api/chat';

const ChatWindow: React.FC = () => {
    const { user } = useUser();
    const {
        isOpen,
        closeChat,
        chatRoom,
        messages,
        sendMessage,
        loadMoreMessages,
        isLoading,
        hasMoreMessages,
        isConnected
    } = useChat();
    
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);
    
    // Focus input when window opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);
    
    // Handle scroll for loading more messages
    const handleScroll = () => {
        if (!messagesContainerRef.current || isLoading || !hasMoreMessages) return;
        
        const { scrollTop } = messagesContainerRef.current;
        
        // Load more when scrolled to top
        if (scrollTop === 0) {
            loadMoreMessages();
        }
    };
    
    // Handle send message
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (inputMessage.trim() && isConnected) {
            sendMessage(inputMessage.trim());
            setInputMessage('');
            setIsTyping(false);
        }
    };
    
    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
        
        // TODO: Implement typing indicator
        // if (!isTyping && e.target.value.length > 0) {
        //     setIsTyping(true);
        //     // Send typing indicator via WebSocket
        // } else if (isTyping && e.target.value.length === 0) {
        //     setIsTyping(false);
        //     // Send stop typing indicator
        // }
    };
    
    if (!isOpen || !user) {
        return null;
    }
    
    const isChatClosed = chatRoom?.status === ChatRoomStatus.CLOSED;
    
    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-info">
                    <h3 className="chat-header-title">
                        Support Chat
                    </h3>
                    <div className="chat-header-status">
                        {chatRoom?.staffName ? (
                            <span>Chatting with: {chatRoom.staffName}</span>
                        ) : (
                            <span>Waiting for staff...</span>
                        )}
                        {!isConnected && (
                            <span className="connection-status offline">• Disconnected</span>
                        )}
                    </div>
                </div>
                
                <button
                    className="chat-close-button"
                    onClick={closeChat}
                    title="Close chat"
                    aria-label="Close chat"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            
            {/* Messages Container */}
            <div
                className="chat-messages"
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {/* Load more indicator */}
                {isLoading && hasMoreMessages && (
                    <div className="chat-loading">
                        <div className="spinner-small" />
                        <span>Loading more messages...</span>
                    </div>
                )}
                
                {/* Messages */}
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <p>No messages yet.</p>
                        <p>Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isOwn={message.senderId === user.id}
                            />
                        ))}
                    </>
                )}
                
                {/* Scroll to bottom ref */}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            {isChatClosed ? (
                <div className="chat-closed-notice">
                    <p>Chat has been closed</p>
                </div>
            ) : (
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="chat-input"
                        placeholder={isConnected ? "Type a message..." : "Connecting..."}
                        value={inputMessage}
                        onChange={handleInputChange}
                        disabled={!isConnected}
                        maxLength={500}
                    />
                    
                    <button
                        type="submit"
                        className="chat-send-button"
                        disabled={!inputMessage.trim() || !isConnected}
                        title="Send message"
                        aria-label="Send message"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChatWindow;
