import { useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { Image, X, Upload } from 'lucide-react';

const CreatePost = ({ refreshFeed }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    
    const user = useSelector(store => store.user);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        if (!user) {
            setError("Please login to upload images");
            return;
        }

        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;
        
        if (files.length + images.length > 4) {
            setError("Maximum 4 images allowed per post");
            return;
        }

        // Validate file types
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && 
            ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
        );

        if (validFiles.length === 0) {
            setError("Please select valid image files (JPEG, PNG, GIF, WebP)");
            return;
        }

        // Create preview URLs
        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages([...images, ...newImages]);
        e.target.value = ""; // Reset input
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleCreatePost = async () => {
        if (!user) {
            setError("Please login to create posts");
            return;
        }

        if (!content.trim() && images.length === 0) {
            setError("Post must have content or images");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("content", content);
            
            // Append all image files
            images.forEach((imageObj, index) => {
                formData.append("images", imageObj.file);
            });

            await axios.post(
                `${BASE_URL}/posts/createPost`,
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setContent("");
            setImages([]);
            if (refreshFeed) refreshFeed();
        } catch (err) {
            console.error("Error creating post:", err);
            setError(err.response?.data?.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
            
        
            <div className="mt-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                />
                
                <div className="flex items-center gap-2 mb-4">
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={uploading || images.length >= 4}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading..." : "Add Images"}
                        <span className="text-xs opacity-70">({images.length}/4)</span>
                    </button>
                    {uploading && (
                        <div className="flex items-center text-sm text-white/50">
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Uploading...
                        </div>
                    )}
                </div>

                
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {images.map((imageObj, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={imageObj.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
                <div>
                    {error && (
                        <div className="text-red-400 text-sm">{error}</div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-white/50">
                        <div>{content.length}/500 characters</div>
                        {images.length > 0 && (
                            <div className="flex items-center">
                                <Image className="w-4 h-4 mr-1" />
                                {images.length} image{images.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
                <button 
                    onClick={handleCreatePost}
                    disabled={loading || (!content.trim() && images.length === 0)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Posting..." : "Create Post"}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;