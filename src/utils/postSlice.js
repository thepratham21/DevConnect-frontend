
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'posts',
    initialState: [],
    reducers: {
        addPosts: (state, action) => {
            return action.payload;
        },
        addPost: (state, action) => {
            return [action.payload, ...state];
        },
        removePost: (state, action) => {
            return state.filter(post => post._id !== action.payload);
        },
        updatePostLikes: (state, action) => {
            const { postId, liked, likesCount } = action.payload;
            return state.map(post => 
                post._id === postId 
                    ? { ...post, isLiked: liked, likesCount }
                    : post
            );
        }
    },
});

export const { addPosts, addPost, removePost, updatePostLikes } = postSlice.actions;
export default postSlice.reducer;