import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { Search, User, MessageSquare, ChevronRight } from "lucide-react";

const Inbox = () => {
    const [chats, setChats] = useState([]);
    const [filteredChats, setFilteredChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((store) => store.user);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        // Filter chats based on search term
        if (searchTerm.trim() === "") {
            setFilteredChats(chats);
        } else {
            const filtered = chats.filter(chat => 
                chat.otherUser?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chat.otherUser?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                chat.lastMessage?.text.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChats(filtered);
        }
    }, [searchTerm, chats]);

    const fetchChats = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(BASE_URL + "/chats", {
                withCredentials: true,
            });

            if (response.data.success) {
                setChats(response.data.chats);
                setFilteredChats(response.data.chats);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const formatDateForSort = (timestamp) => {
        if (!timestamp) return new Date();
        return new Date(timestamp).toISOString();
    };

    const truncateText = (text, maxLength = 35) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-white/50 text-sm">Loading conversations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
                <p className="text-white/50">Your conversations with other developers</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-white/30"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="space-y-3">
                {filteredChats.length === 0 ? (
                    <div className="p-8 bg-white/5 border border-white/10 rounded-xl text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                            <MessageSquare className="w-8 h-8 text-white/50" />
                        </div>
                        <p className="text-lg font-semibold text-white mb-2">
                            {searchTerm ? "No conversations found" : "No conversations yet"}
                        </p>
                        <p className="text-white/50">
                            {searchTerm 
                                ? "Try searching with a different name"
                                : "Start messaging other developers to build your network"
                            }
                        </p>
                    </div>
                ) : (
                    filteredChats
                        .sort((a, b) => 
                            new Date(formatDateForSort(b.lastMessage?.timestamp || b.updatedAt)) - 
                            new Date(formatDateForSort(a.lastMessage?.timestamp || a.updatedAt))
                        )
                        .map((chat) => (
                            <Link 
                                key={chat.chatId} 
                                to={`/chat/${chat.otherUser?._id}`}
                                className="block"
                            >
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* User Avatar */}
                                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                                {chat.otherUser?.firstName?.charAt(0) || <User className="w-6 h-6 text-white/70" />}
                                            </div>
                                            
                                            {/* Chat Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline justify-between mb-1">
                                                    <h3 className="font-semibold text-white truncate">
                                                        {chat.otherUser?.firstName} {chat.otherUser?.lastName}
                                                    </h3>
                                                    <span className="text-xs text-white/50 whitespace-nowrap ml-2">
                                                        {formatTime(chat.lastMessage?.timestamp || chat.updatedAt)}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {chat.lastMessage ? (
                                                        <p className="text-white/70 text-sm truncate">
                                                            {chat.lastMessage.senderId === user._id 
                                                                ? <span className="text-blue-400">You: </span>
                                                                : `${chat.lastMessage.senderName}: `
                                                            }
                                                            {truncateText(chat.lastMessage.text)}
                                                        </p>
                                                    ) : (
                                                        <p className="text-white/50 text-sm italic">Start a conversation</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Arrow */}
                                        <ChevronRight 
                                            size={20} 
                                            className="text-white/50 group-hover:text-white transition-colors ml-3" 
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))
                )}
            </div>
        </div>
    );
};

export default Inbox;