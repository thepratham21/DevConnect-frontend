import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Send, Trash2, User, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const CommentSection = ({ postId, currentUser, onCommentAdded }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});
    
    const user = currentUser || useSelector(store => store.user);
    const navigate = useNavigate();

    const fetchComments = async () => {
        try {
            setFetching(true);
            const res = await axios.get(
                `${BASE_URL}/comments/${postId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                // Ensure all comments have replies array
                const commentsWithReplies = (res.data.comments || []).map(comment => ({
                    ...comment,
                    replies: comment.replies || []
                }));
                setComments(commentsWithReplies);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setFetching(false);
        }
    };

    const addComment = async () => {
        if (!user) {
            alert("Please login to comment");
            navigate("/login");
            return;
        }

        if (!text.trim()) {
            alert("Comment cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${BASE_URL}/createComment/${postId}`,
                { content: text },
                { withCredentials: true }
            );

            if (res.data.success) {
                setText("");
                fetchComments();
                
                if (onCommentAdded) {
                    onCommentAdded();
                }
            }
        } catch (err) {
            console.error("Error adding comment:", err);
        } finally {
            setLoading(false);
        }
    };

    const addReply = async (parentCommentId, replyContent) => {
        if (!user) {
            alert("Please login to reply");
            navigate("/login");
            return;
        }

        if (!replyContent.trim()) {
            alert("Reply cannot be empty");
            return;
        }

        try {
            const res = await axios.post(
                `${BASE_URL}/reply/${parentCommentId}`,
                { content: replyContent },
                { withCredentials: true }
            );

            if (res.data.success) {
                // Get the actual reply data from server response
                const newReply = res.data.comment;
                
                // Update the comments state with the new reply
                const updateCommentsWithReply = (commentList) => {
                    return commentList.map(comment => {
                        if (comment._id === parentCommentId) {
                            // Create updated comment with new reply
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), newReply]
                            };
                        }
                        
                        // Recursively check replies
                        if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateCommentsWithReply(comment.replies)
                            };
                        }
                        
                        return comment;
                    });
                };

                // Update state with the new reply
                setComments(prev => updateCommentsWithReply(prev));
                
                // Auto-expand the parent comment
                setExpandedReplies(prev => ({
                    ...prev,
                    [parentCommentId]: true
                }));
                
                // Enhance the reply with user data after a delay
                setTimeout(() => {
                    setComments(prev => {
                        const enhanceReplyWithUser = (commentList) => {
                            return commentList.map(comment => {
                                if (comment._id === newReply._id && !comment.userId) {
                                    return {
                                        ...comment,
                                        userId: user
                                    };
                                }
                                
                                if (comment.replies && comment.replies.length > 0) {
                                    return {
                                        ...comment,
                                        replies: enhanceReplyWithUser(comment.replies)
                                    };
                                }
                                
                                return comment;
                            });
                        };
                        
                        return enhanceReplyWithUser(prev);
                    });
                }, 100);
                
                if (onCommentAdded) {
                    onCommentAdded();
                }
            }
        } catch (err) {
            console.error("Error adding reply:", err);
            fetchComments();
        }
    };

    const deleteComment = async (commentId, commentUserId) => {
        if (!user || user._id !== commentUserId) {
            alert("You can only delete your own comments");
            return;
        }

        if (!window.confirm("Are you sure?")) return;

        try {
            await axios.delete(
                `${BASE_URL}/delete/${commentId}`,
                { withCredentials: true }
            );

            fetchComments();
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const formatCommentTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleUserClick = (userId) => {
        if (!userId) return;
        navigate(`/user/${userId}`);
    };

    // Separate ReplyForm component
    const ReplyForm = ({ parentCommentId, onCancel, onSubmit }) => {
        const [replyText, setReplyText] = useState("");

        const handleSubmit = () => {
            if (replyText.trim()) {
                onSubmit(parentCommentId, replyText);
                setReplyText("");
                onCancel();
            }
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit();
            }
        };

        return (
            <div className="mt-4">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 flex-shrink-0">
                        {user?.photoUrl ? (
                            <img 
                                src={user.photoUrl} 
                                alt={user.firstName}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-4 h-4 text-white/70" />
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full p-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Write a reply..."
                            rows={2}
                            maxLength={200}
                            autoFocus
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-white/50">
                                {replyText.length}/200 characters
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setReplyText("");
                                        onCancel();
                                    }}
                                    className="text-xs px-3 py-1 rounded bg-white/10 text-white/70 hover:bg-white/20"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!replyText.trim()}
                                    className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Post Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Main CommentItem component
    const CommentItem = ({ comment, depth = 0 }) => {
        const [showReplyForm, setShowReplyForm] = useState(false);
        const isExpanded = expandedReplies[comment._id] !== undefined 
            ? expandedReplies[comment._id] 
            : depth === 0;

        return (
            <div className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    
                    <button 
                        onClick={() => handleUserClick(comment.userId?._id)}
                        className="focus:outline-none hover:opacity-80 transition-opacity flex-shrink-0"
                    >
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            {comment.userId?.photoUrl ? (
                                <img 
                                    src={comment.userId.photoUrl} 
                                    alt={comment.userId.firstName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-white/70" />
                            )}
                        </div>
                    </button>
                    
                    
                    <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                            <div>
                                
                                <button 
                                    onClick={() => handleUserClick(comment.userId?._id)}
                                    className="focus:outline-none text-left hover:opacity-80 transition-opacity"
                                >
                                    <span className="font-medium text-sm text-white hover:underline">
                                        {comment.userId?.firstName} {comment.userId?.lastName}
                                    </span>
                                </button>
                                <span className="text-xs text-white/50 ml-2">
                                    {formatCommentTime(comment.createdAt)}
                                </span>
                            </div>
                            
                            {user && comment.userId && user._id === comment.userId._id && (
                                <button
                                    onClick={() => deleteComment(comment._id, comment.userId._id)}
                                    className="text-white/50 hover:text-red-400 p-1 rounded-full hover:bg-white/5 transition-colors"
                                    title="Delete comment"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        <p className="text-white/80 text-sm mt-2 whitespace-pre-line">
                            {comment.content}
                        </p>

                        
                        <div className="flex items-center gap-4 mt-3">
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                            >
                                <MessageSquare className="w-3 h-3" />
                                {showReplyForm ? "Cancel Reply" : "Reply"}
                            </button>
                            
                            
                            {comment.replies && comment.replies.length > 0 && (
                                <button
                                    onClick={() => toggleReplies(comment._id)}
                                    className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                                >
                                    {isExpanded ? (
                                        <>
                                            <ChevronUp className="w-3 h-3" />
                                            Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-3 h-3" />
                                            Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        
                        {showReplyForm && (
                            <ReplyForm
                                parentCommentId={comment._id}
                                onCancel={() => setShowReplyForm(false)}
                                onSubmit={addReply}
                            />
                        )}
                    </div>
                </div>

                
                {isExpanded && comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2">
                        {comment.replies.map(reply => (
                            <CommentItem 
                                key={reply._id} 
                                comment={reply} 
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div className="mt-6">
            
            <div className="mb-6">
                <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 flex-shrink-0">
                        {user?.photoUrl ? (
                            <img 
                                src={user.photoUrl} 
                                alt={user.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-white/70" />
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={user ? "Write a comment..." : "Please login to comment"}
                            rows={2}
                            disabled={!user}
                            maxLength={300}
                        />
                        <div className="flex justify-between items-center mt-3">
                            <div className="text-xs text-white/50">
                                {text.length}/300 characters
                            </div>
                            <button
                                onClick={addComment}
                                disabled={loading || !text.trim() || !user}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {loading ? "Posting..." : "Post Comment"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
            <div>
                {fetching ? (
                    <div className="text-center py-6">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-sm text-white/50">Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-6 text-white/50 text-sm">
                        No comments yet. Be the first to comment!
                    </div>
                ) : (
                    <div>
                        {comments.map((comment) => (
                            <CommentItem key={comment._id} comment={comment} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;