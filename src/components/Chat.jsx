import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Send, Clock, CheckCheck } from "lucide-react";

const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [targetUserName, setTargetUserName] = useState("");
    const user = useSelector((store) => store.user);
    const userId = user?._id;

    const fetchChatMessages = async () => {
        const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
            withCredentials: true,
        });

        console.log(chat.data);

        // Get target user name from the chat data
        if (chat.data.otherUser) {
            setTargetUserName(`${chat.data.otherUser.firstName} ${chat.data.otherUser.lastName}`);
        } else if (chat.data.participants) {
            // Fallback: Find the other participant who is not the current user
            const otherParticipant = chat.data.participants.find(
                participant => participant._id !== userId
            );
            if (otherParticipant) {
                setTargetUserName(`${otherParticipant.firstName} ${otherParticipant.lastName}`);
            }
        }

        const chatMessages = chat?.data?.messages.map((msg) => {
            const { senderId, text } = msg;
            return {
                firstName: senderId?.firstName,
                lastName: senderId?.lastName,
                text,
            };
        });
        setMessages(chatMessages);
    };
    useEffect(() => {
        fetchChatMessages();
    }, []);

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
            setMessages((messages) => [...messages, { firstName, lastName, text }]);
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
        setNewMessage("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto p-4 h-[85vh] flex flex-col">
            {/* Chat Header - Fixed to show target user's name */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl border border-gray-700 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {targetUserName?.charAt(0) || "U"}
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-white">
                                {targetUserName || "Chat"}
                            </h1>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                <Clock size={12} />
                                Online
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">
                        {messages.length} messages
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 bg-gray-900 border-x border-gray-700 overflow-hidden flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Send size={24} />
                            </div>
                            <p className="text-lg">Start a conversation</p>
                            <p className="text-sm">Send your first message to begin chatting</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isOwnMessage = user.firstName === msg.firstName;
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                                        {!isOwnMessage && (
                                            <div className="flex items-center gap-2 mb-1 ml-1">
                                                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full text-xs flex items-center justify-center text-white font-medium">
                                                    {msg.firstName?.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-300">
                                                    {msg.firstName} {msg.lastName}
                                                </span>
                                            </div>
                                        )}
                                        <div
                                            className={`rounded-2xl px-4 py-3 ${isOwnMessage
                                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                                                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                        </div>
                                        <div className={`flex items-center gap-2 mt-1 text-xs ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                            <span className="text-gray-500">{formatTime()}</span>
                                            {isOwnMessage && (
                                                <CheckCheck size={12} className="text-blue-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-700 p-4 bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={`Message ${targetUserName.split(' ')[0] || ''}`}
                                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${newMessage.trim()
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                                    } transition-all duration-200`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                        Press Enter to send • Shift + Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Chat;