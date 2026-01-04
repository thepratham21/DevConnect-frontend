import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Send, User, Check } from "lucide-react";

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [targetUser, setTargetUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((store) => store.user);
    const userId = user?._id;

    const fetchChatMessages = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(BASE_URL + "/chat/" + targetUserId, {
                withCredentials: true,
            });

            console.log("Chat response:", response.data);

            if (response.data.success) {
                // Set target user from the response
                if (response.data.otherUser) {
                    setTargetUser(response.data.otherUser);
                }

                // Transform messages for frontend display
                const chatMessages = response.data.messages.map((msg) => {
                    const { senderId, text, createdAt } = msg;
                    return {
                        firstName: senderId?.firstName,
                        lastName: senderId?.lastName,
                        text,
                        isOwnMessage: senderId?._id === userId,
                        timestamp: createdAt,
                    };
                });
                
                setMessages(chatMessages);
            }
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, [targetUserId]);

    useEffect(() => {
        if (!userId) {
            return;
        }
        const socket = createSocketConnection();
        // As soon as the page loaded, the socket connection is made and joinChat event is emitted
        socket.emit("joinChat", {
            firstName: user.firstName,
            userId,
            targetUserId,
        });

        socket.on("messageReceived", ({ firstName, lastName, text }) => {
            console.log(firstName + " :  " + text);
            setMessages((messages) => [...messages, { 
                firstName, 
                lastName, 
                text,
                isOwnMessage: false,
                timestamp: new Date(),
            }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId, targetUserId]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        
        const socket = createSocketConnection();
        socket.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            text: newMessage,
        });
        
        // Optimistically add message to local state
        setMessages((prevMessages) => [...prevMessages, { 
            firstName: user.firstName, 
            lastName: user.lastName, 
            text: newMessage,
            isOwnMessage: true,
            timestamp: new Date(),
        }]);
        setNewMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-white/50 text-sm">Loading chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Chat Header */}
            <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                        {targetUser?.firstName?.charAt(0) || <User className="w-6 h-6 text-white/70" />}
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">
                            {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Chat"}
                        </h1>
                        <p className="text-white/50 text-sm">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl min-h-[60vh] max-h-[60vh] overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/50 py-10">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
                            <Send className="w-6 h-6 text-white/50" />
                        </div>
                        <p className="text-lg mb-1">No messages yet</p>
                        <p className="text-sm">Send your first message to {targetUser?.firstName || 'start the conversation'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, index) => {
                            const isOwnMessage = msg.isOwnMessage;
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                                        {!isOwnMessage && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white text-xs border border-white/20">
                                                    {msg.firstName?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-white/80">
                                                    {msg.firstName} {msg.lastName}
                                                </span>
                                            </div>
                                        )}
                                        <div
                                            className={`rounded-xl px-4 py-3 ${isOwnMessage
                                                    ? "bg-blue-600 text-white rounded-br-sm"
                                                    : "bg-white/10 text-white rounded-bl-sm"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                        </div>
                                        <div className={`flex items-center gap-1 mt-1 text-xs ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                            <span className="text-white/50">{formatTime(msg.timestamp)}</span>
                                            {isOwnMessage && (
                                                <Check className="w-3 h-3 text-blue-300" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={`Message ${targetUser?.firstName || '...'}`}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-white/30"
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className={`px-4 py-3 rounded-lg flex items-center gap-2 ${newMessage.trim()
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-white/10 text-white/50 cursor-not-allowed"
                            } transition-colors`}
                    >
                        <Send className="w-4 h-4" />
                        Send
                    </button>
                </div>
                <p className="text-white/50 text-xs text-center mt-3">
                    Press Enter to send • Shift + Enter for new line
                </p>
            </div>
        </div>
    );
};

export default Chat;