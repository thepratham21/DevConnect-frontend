// components/PostFeed.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import PostCard from "./PostCard";
import { addPosts } from "../utils/postSlice";

const PostFeed = () => {
    const posts = useSelector(store => store.posts);
    const dispatch = useDispatch();

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/posts`, {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(addPosts(res.data.posts));
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-white/70">No posts yet. Be the first to create one!</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
};

export default PostFeed;