import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const CreatePost = ({ refreshFeed }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const user = useSelector(store => store.user);

    const handleCreatePost = async () => {
        if (!user) {
            setError("Please login to create posts");
            return;
        }

        if (!content.trim()) {
            setError("Post content cannot be empty");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await axios.post(
                `${BASE_URL}/posts/createPost`,
                { content },
                { 
                    withCredentials: true
                }
            );

            setContent("");
            if (refreshFeed) refreshFeed();
        } catch (err) {
            console.error("Error creating post:", err);
            setError(err.response?.data?.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">Please login to create posts</p>
            </div>
        );
    }

    return (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Create a Post</h2>
            <textarea
                className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                maxLength={500}
            />
            
            <div className="flex justify-between items-center mt-4">
                <div>
                    {error && (
                        <div className="text-red-400 text-sm">{error}</div>
                    )}
                    <div className="text-sm text-white/50">
                        {content.length}/500 characters
                    </div>
                </div>
                <button 
                    onClick={handleCreatePost}
                    disabled={loading || !content.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Posting..." : "Create Post"}
                </button>
            </div>
        </div>
    );
};


export default CreatePost;