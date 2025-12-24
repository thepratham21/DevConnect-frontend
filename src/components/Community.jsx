
import { useState } from "react"; 
import CreatePost from "./CreatePost";
import PostFeed from "./PostFeed";

const Community = () => {
    const [refreshFlag, setRefreshFlag] = useState(false);

    const refreshFeed = () => {
        setRefreshFlag((prev) => !prev);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-white mb-3">DevConnect Community</h1>
                <p className="text-white/70">Share ideas, ask questions, and connect with fellow developers</p>
            </div>
            
            <CreatePost refreshFeed={refreshFeed} />
            <PostFeed key={refreshFlag} />
        </div>
    );
};

export default Community;