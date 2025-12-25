
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { User, X, Mail, Calendar, MapPin, Send, Code, Globe, Briefcase } from 'lucide-react';
import { useSelector } from "react-redux";

const UserProfileModel = ({ userId, isOpen, onClose }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [connectLoading, setConnectLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    
    const currentUser = useSelector(store => store.user);

    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserProfile();
        } else {
            
            setUser(null);
            setLoading(true);
            setError("");
            setIsConnected(false);
        }
    }, [userId, isOpen]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError("");
            
            const res = await axios.get(
                `${BASE_URL}/profile/view/${userId}`,
                { withCredentials: true }
            );
            
            if (res.data.success) {
                setUser(res.data.user);
            } else {
                setError(res.data.message || "Failed to load profile");
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError(err.response?.data?.message || "Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!currentUser) {
            alert("Please login to send connection requests");
            return;
        }

        if (currentUser._id === userId) {
            alert("You cannot connect with yourself");
            return;
        }

        setConnectLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/request/send/interested/${userId}`,
                {},
                { withCredentials: true }
            );

            if (response.data) {
                setIsConnected(true);
                alert("Connection request sent!");
            }
        } catch (err) {
            console.error("Error sending connection request:", err);
            alert(err.response?.data?.message || "Failed to send connection request");
        } finally {
            setConnectLoading(false);
        }
    };

    
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        
        <div className="fixed inset-0 z-[9999] bg-black">
            
            <div className="sticky top-0 z-10 bg-black/90 border-b border-white/10 p-4 flex justify-between items-center">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                    <span className="text-sm">Back</span>
                </button>
                
                <h2 className="text-xl font-bold text-white">Profile</h2>
                
                <div className="w-10"> </div>
            </div>

            
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-white/70">Loading profile...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                        <div className="w-20 h-20 mb-4 bg-white/10 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-white/50" />
                        </div>
                        <p className="text-red-400 text-center mb-4">{error}</p>
                        <button
                            onClick={fetchUserProfile}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : user ? (
                    <div className="p-6 space-y-8">
                        
                        <div className="flex flex-col items-center text-center">
                            <div className="w-40 h-40 mb-6 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center">
                                {user.photoUrl ? (
                                    <img 
                                        src={user.photoUrl} 
                                        alt={user.firstName}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-20 h-20 text-white/50" />
                                )}
                            </div>
                            
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {user.firstName} {user.lastName}
                            </h1>
                            
                            {user.title && (
                                <p className="text-xl text-white/70 mb-4">{user.title}</p>
                            )}
                            
                            {user.location && (
                                <div className="flex items-center justify-center gap-2 text-white/50 mb-6">
                                    <MapPin className="w-5 h-5" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                            
                            
                            {currentUser && currentUser._id !== user._id && (
                                <button
                                    onClick={handleConnect}
                                    disabled={connectLoading || isConnected}
                                    className={`w-full max-w-md py-4 rounded-xl font-semibold text-lg transition-all ${
                                        isConnected 
                                            ? "bg-green-600 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    } ${connectLoading ? "opacity-70" : ""}`}
                                >
                                    {connectLoading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sending Connection Request...
                                        </span>
                                    ) : isConnected ? (
                                        "Connection Request Sent ✓"
                                    ) : (
                                        <span className="flex items-center justify-center gap-3">
                                            <Send className="w-5 h-5" />
                                            Connect with {user.firstName}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>

                        
                        {user.about && (
                            <div className="bg-white/5 rounded-2xl p-6">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <User className="w-6 h-6" />
                                    About
                                </h3>
                                <p className="text-white/80 text-lg leading-relaxed whitespace-pre-line">
                                    {user.about}
                                </p>
                            </div>
                        )}

                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {user.email && (
                                <div className="bg-white/5 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Mail className="w-5 h-5 text-blue-400" />
                                        <h4 className="text-lg font-semibold text-white">Email</h4>
                                    </div>
                                    <p className="text-white/90 break-all">{user.email}</p>
                                </div>
                            )}

                            
                            {user.age && (
                                <div className="bg-white/5 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="w-5 h-5 text-green-400" />
                                        <h4 className="text-lg font-semibold text-white">Age</h4>
                                    </div>
                                    <p className="text-white/90 text-2xl font-bold">{user.age} years</p>
                                </div>
                            )}

                            
                            {user.gender && (
                                <div className="bg-white/5 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <User className="w-5 h-5 text-purple-400" />
                                        <h4 className="text-lg font-semibold text-white">Gender</h4>
                                    </div>
                                    <p className="text-white/90 text-xl capitalize">{user.gender}</p>
                                </div>
                            )}

                            
                            {user.title && (
                                <div className="bg-white/5 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Briefcase className="w-5 h-5 text-yellow-400" />
                                        <h4 className="text-lg font-semibold text-white">Position</h4>
                                    </div>
                                    <p className="text-white/90 text-xl">{user.title}</p>
                                </div>
                            )}
                        </div>

                        
                        {user.skills && user.skills.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-6">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Code className="w-6 h-6" />
                                    Skills & Expertise
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {user.skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="px-5 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                                        >
                                            <span className="text-lg font-medium">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        
                        {(!user.skills || user.skills.length === 0) && (
                            <div className="bg-white/5 rounded-2xl p-6 text-center">
                                <Code className="w-12 h-12 text-white/30 mx-auto mb-3" />
                                <p className="text-white/50">No skills added yet</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-24 h-24 mb-6 bg-white/10 rounded-full flex items-center justify-center">
                            <User className="w-12 h-12 text-white/50" />
                        </div>
                        <p className="text-white/70 text-xl">User not found</p>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModel;