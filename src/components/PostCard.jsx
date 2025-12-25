import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import CommentSection from "./Commentsection";
import { Heart, MessageCircle, Trash2, User, Image as ImageIcon, X } from 'lucide-react';
import { removePost, updatePostLikes } from "../utils/postSlice";

const PostCard = ({ post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likesCount || 0);
    const [loading, setLoading] = useState(false);
    const [connectLoading, setConnectLoading] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isAuthor = user && post.author && user._id === post.author._id;

    useEffect(() => {
        fetchCommentCount();
        // Check if user has liked this post
        if (user && post.likes && Array.isArray(post.likes)) {
            setIsLiked(post.likes.includes(user._id));
        }
    }, [post._id, user, post.likes]);

    const fetchCommentCount = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/comments/${post._id}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                setCommentCount(res.data.comments?.length || 0);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    // Helper function to get image URLs from post
    const getImageUrls = () => {
        if (!post.images || !Array.isArray(post.images)) return [];
        
        // Check if images are objects with url property or simple strings
        return post.images.map(img => {
            if (typeof img === 'string') {
                return img; // It's already a URL string
            } else if (img && img.url) {
                return img.url; // It's an object with url property
            } else if (img && img.secure_url) {
                return img.secure_url; // Cloudinary secure_url
            }
            return null;
        }).filter(url => url !== null);
    };

    const handleUserClick = (userId) => {
        if (!userId) return;
        navigate(`/user/${userId}`);
    };

    const handleConnect = async () => {
        if (!user) {
            alert("Please login to send connection requests");
            navigate("/login");
            return;
        }

        if (isAuthor) {
            alert("You cannot connect with yourself");
            return;
        }

        setConnectLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/request/send/interested/${post.author._id}`,
                {},
                { withCredentials: true }
            );

            if (response.data) {
                setIsConnected(true);
                setConnectionStatus('interested');
                alert(`Connection request sent to ${post.author.firstName}!`);
            }
        } catch (err) {
            console.error("Error sending connection request:", err);
            alert(err.response?.data?.message || "Failed to send connection request");
        } finally {
            setConnectLoading(false);
        }
    };

    const handleLike = async () => {
        if (loading || !user) {
            if (!user) {
                alert("Please login to like posts");
                navigate("/login");
            }
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/likes/${post._id}`,
                {},
                { withCredentials: true }
            );

            if (response.data.success) {
                setIsLiked(response.data.liked);
                const newLikeCount = response.data.liked ? likeCount + 1 : likeCount - 1;
                setLikeCount(newLikeCount);
                
                dispatch(updatePostLikes({
                    postId: post._id,
                    liked: response.data.liked,
                    likesCount: newLikeCount,
                    userId: user._id
                }));
            }
        } catch (err) {
            console.error("Error liking post:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async () => {
        if (!user || !window.confirm("Are you sure you want to delete this post?")) return;

        try {
            await axios.delete(
                `${BASE_URL}/posts/delete/${post._id}`,
                { withCredentials: true }
            );
            
            dispatch(removePost(post._id));
        } catch (err) {
            console.error("Error deleting post:", err);
            alert(err.response?.data?.message || "Failed to delete post");
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getConnectButtonProps = () => {
        if (isAuthor) return { text: "Your Post", disabled: true, style: "bg-gray-500 cursor-not-allowed" };
        if (isConnected) {
            switch(connectionStatus) {
                case 'interested': return { text: "Request Sent", disabled: true, style: "bg-yellow-500 cursor-not-allowed" };
                case 'accepted': return { text: "Connected", disabled: true, style: "bg-green-500 cursor-not-allowed" };
                case 'rejected': return { text: "Rejected", disabled: true, style: "bg-red-500 cursor-not-allowed" };
                default: return { text: "Connect", disabled: false, style: "bg-blue-600 hover:bg-blue-700" };
            }
        }
        return { text: "Connect", disabled: false, style: "bg-blue-600 hover:bg-blue-700" };
    };

    const connectButton = getConnectButtonProps();
    const imageUrls = getImageUrls();
    const hasImages = imageUrls.length > 0;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
            
            
            {showImageModal && selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 p-2"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    
                    <button 
                        onClick={() => handleUserClick(post.author?._id)}
                        className="focus:outline-none hover:opacity-80 transition-opacity"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            {post.author?.photoUrl ? (
                                <img 
                                    src={post.author.photoUrl} 
                                    alt={post.author.firstName}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-white/70" />
                            )}
                        </div>
                    </button>
                    
                    <div>
                        <div className="flex items-center gap-2">
                            
                            <button 
                                onClick={() => handleUserClick(post.author?._id)}
                                className="focus:outline-none text-left hover:opacity-80 transition-opacity"
                            >
                                <h4 className="font-semibold text-white hover:underline">
                                    {post.author?.firstName} {post.author?.lastName}
                                </h4>
                            </button>
                            
                            {!isAuthor && (
                                <button
                                    onClick={handleConnect}
                                    disabled={connectLoading || connectButton.disabled}
                                    className={`text-white text-xs px-3 py-1 rounded-full ${connectButton.style} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {connectLoading ? (
                                        <span className="flex items-center">
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></div>
                                            Sending...
                                        </span>
                                    ) : connectButton.text}
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-white/50">
                            {formatDate(post.createdAt)}
                        </p>
                    </div>
                </div>
                
                {isAuthor && (
                    <button
                        onClick={handleDeletePost}
                        className="text-white/50 hover:text-red-400 p-2 rounded-full hover:bg-white/5 transition-colors"
                        title="Delete post"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            
            <div className="mb-6">
                <p className="text-white/90 whitespace-pre-line leading-relaxed">{post.content}</p>
            </div>

            
            {hasImages && (
                <div className="mb-6">
                    <div className={`grid gap-4 ${
                        imageUrls.length === 1 ? 'grid-cols-1' : 
                        imageUrls.length === 2 ? 'grid-cols-2' : 
                        imageUrls.length === 3 ? 'grid-cols-2 md:grid-cols-3' : 
                        'grid-cols-2 md:grid-cols-2 lg:grid-cols-4'
                    }`}>
                        {imageUrls.map((imageUrl, index) => (
                            <div 
                                key={index} 
                                className="relative overflow-hidden rounded-lg bg-white/5 group cursor-pointer"
                                onClick={() => handleImageClick(imageUrl)}
                            >
                                <img
                                    src={imageUrl}
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        // If image fails to load, show placeholder
                                        e.target.onerror = null;
                                        e.target.src = `https://via.placeholder.com/400x300/1a1a2e/ffffff?text=Image+${index + 1}`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <ImageIcon className="w-8 h-8 text-white/80" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 text-sm text-white/50 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-1" />
                        {imageUrls.length} {imageUrls.length === 1 ? 'image' : 'images'}
                    </div>
                </div>
            )}

            
            <div className="flex items-center text-sm text-white/50 mb-4 space-x-6">
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
                {hasImages && (
                    <span>{imageUrls.length} {imageUrls.length === 1 ? 'image' : 'images'}</span>
                )}
            </div>

            
            <div className="flex border-t border-b border-white/10 py-3">
                <button
                    onClick={handleLike}
                    disabled={loading || !user}
                    className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${
                        isLiked 
                            ? 'text-red-400 hover:bg-white/5' 
                            : 'text-white/70 hover:bg-white/5'
                    } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Heart 
                        className="w-5 h-5 mr-2" 
                        fill={isLiked ? "currentColor" : "none"} 
                        stroke="currentColor"
                    />
                    <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 flex items-center justify-center py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
                >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Comment</span>
                </button>
            </div>

            
            {showComments && (
                <div className="mt-6">
                    <CommentSection 
                        postId={post._id} 
                        currentUser={user}
                        onCommentAdded={() => {
                            fetchCommentCount();
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PostCard;