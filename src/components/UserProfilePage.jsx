

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    MapPin,
    Send,
    Code,
    Briefcase,
    MessageCircle,
} from "lucide-react";

const UserProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [connectLoading, setConnectLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const currentUser = useSelector((store) => store.user);

    useEffect(() => {
        if (userId) fetchUserProfile();
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get(`${BASE_URL}/profile/view/${userId}`, {
                withCredentials: true,
            });
            if (res.data.success) setUser(res.data.user);
            else setError(res.data.message || "Failed to load profile");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!currentUser) {
            alert("Please login to send connection requests");
            navigate("/login");
            return;
        }
        if (currentUser._id === userId) return alert("You cannot connect with yourself");

        setConnectLoading(true);
        try {
            const res = await axios.post(
                `${BASE_URL}/request/send/interested/${userId}`,
                {},
                { withCredentials: true }
            );
            if (res.data) {
                setIsConnected(true);
                alert("Connection request sent!");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send request");
        } finally {
            setConnectLoading(false);
        }
    };

    const handleChat = () => {
        if (!currentUser) {
            alert("Please login to chat");
            navigate("/login");
            return;
        }
        navigate(`/chat/${userId}`, { 
        state: { 
            targetUserId: userId,
            userName: `${user.firstName} ${user.lastName}`
        } 
    });
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-gradient-to-br from-black via-neutral-900 to-black">
                <div className="text-center">
                    <div className="h-14 w-14 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-white/60 mt-4">Loading profile…</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen grid place-items-center bg-black text-white">
                <div className="text-center space-y-4">
                    <User className="w-16 h-16 mx-auto text-white/30" />
                    <p className="text-red-400">{error || "User not found"}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white">
            
            <div className="sticky top-0 z-20 backdrop-blur bg-black/60 border-b border-white/10">
                <div className="max-w-5xl mx-auto p-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/70 hover:text-white"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-8">
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-16 h-16 text-white/40" />
                        )}
                    </div>

                    <h1 className="text-3xl font-bold mt-4">
                        {user.firstName} {user.lastName}
                    </h1>
                    {user.title && <p className="text-white/60 mt-1">{user.title}</p>}
                    {user.location && (
                        <div className="flex items-center justify-center gap-2 text-white/50 mt-2">
                            <MapPin size={16} /> {user.location}
                        </div>
                    )}

                    {currentUser && currentUser._id !== user._id && (
                        <div className="mt-6 flex gap-3 justify-center flex-wrap">
                            <button
                                onClick={handleConnect}
                                disabled={connectLoading || isConnected}
                                className={`px-6 py-3 rounded-xl font-medium transition ${isConnected
                                        ? "bg-green-600"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {connectLoading ? "Sending…" : isConnected ? "Request Sent" : "Connect"}
                            </button>
                            <button
                                onClick={handleChat}
                                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                            >
                                <MessageCircle size={18} /> Message
                            </button>
                        </div>
                    )}
                </div>

                
                {user.about && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
                            <User size={18} /> About
                        </h3>
                        <p className="text-white/80 leading-relaxed whitespace-pre-line">
                            {user.about}
                        </p>
                    </div>
                )}

                
                <div className="grid sm:grid-cols-2 gap-4">
                    {user.email && <Info icon={Mail} label="Email" value={user.email} />}
                    {user.age && <Info icon={Calendar} label="Age" value={`${user.age} years`} />}
                    {user.gender && <Info icon={User} label="Gender" value={user.gender} />}
                    {user.title && <Info icon={Briefcase} label="Position" value={user.title} />}
                </div>

                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <Code size={18} /> Skills
                    </h3>
                    {user.skills?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white/50">No skills added yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const Info = ({ icon: Icon, label, value }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-2 text-white/60 mb-1">
            <Icon size={16} /> {label}
        </div>
        <p className="text-white font-medium break-all">{value}</p>
    </div>
);

export default UserProfilePage;