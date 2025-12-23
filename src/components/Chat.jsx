import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {

    const { targetUserId } = useParams();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [chatUserName, setChatUserName] = useState("Loading...");

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    const user = useSelector(store => store.user);
    const userId = user?._id;

    // ----------------------
    // FETCH TARGET USER NAME
    // ----------------------
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${BASE_URL}/user/${targetUserId}`,
                    { withCredentials: true }
                );

                setChatUserName(res.data.fullName || "Unknown User");
            } catch (err) {
                console.error("Failed to fetch chat user:", err);
                setChatUserName("Unknown User");
            }
        };

        if (targetUserId) fetchUser();
    }, [targetUserId]);

    // ----------------------
    // SOCKET CONNECTION
    // ----------------------
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = createSocketConnection();
        }

        const socket = socketRef.current;

        if (userId && targetUserId) {
            socket.emit("joinChat", { userId, targetUserId });
        }

        socket.on("receiveMessage", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.off("receiveMessage");
        };

    }, [userId, targetUserId]);

    // AUTO SCROLL
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // SEND MESSAGE
    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMsg = {
            firstName: user.firstName,
            lastName: user.lastName,
            senderId: userId,
            receiverId: targetUserId,
            text: message,
            createdAt: new Date(),
        };

        socketRef.current.emit("sendMessage", newMsg);

        setMessages(prev => [...prev, newMsg]);
        setMessage("");
    };

    return (
        <div className="flex flex-col h-screen bg-base-100">

            {/* TOP BAR */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-200 border-b border-base-300 sticky top-0 z-20">
                <div className="w-12 h-12 rounded-full bg-base-300 animate-pulse" />
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">{chatUserName}</h2>
                    <p className="text-xs text-gray-500">Online</p>
                </div>
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">

                {messages.map((msg, index) => (
                    msg.senderId === userId ? (
                        <div key={index} className="flex justify-end">
                            <div className="max-w-[70%] bg-primary text-primary-content px-4 py-2 rounded-2xl shadow">
                                {msg.text}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-base-300 animate-pulse" />
                            <div className="max-w-[70%] bg-base-200 px-4 py-2 rounded-2xl shadow">
                                {msg.text}
                            </div>
                        </div>
                    )
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT BAR */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-200 border-t border-base-300 sticky bottom-0">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input input-bordered w-full rounded-full"
                    placeholder="Type a message..."
                />
                <button
                    className="btn btn-primary rounded-full px-6"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>

        </div>
    );
};

export default Chat;