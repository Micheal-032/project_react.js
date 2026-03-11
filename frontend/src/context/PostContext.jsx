/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
        try {
            setLoading(true);
            const res = await api.get(`/posts?page=${pageNum}&limit=10`);
            if (res.data.posts) {
                if (reset) {
                    setPosts(res.data.posts);
                } else {
                    setPosts(prev => {
                        // filter out duplicates just in case
                        const newPosts = res.data.posts.filter(p => !prev.some(pr => pr._id === p._id));
                        return [...prev, ...newPosts];
                    });
                }
                setPage(res.data.page);
                setHasMore(res.data.page < res.data.totalPages);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPost = async (postData) => {
        const res = await api.post('/posts', postData);
        if (res.data.success) {
            setPosts(prev => [res.data.post, ...prev]);
            return res.data;
        }
    };

    const updatePost = async (id, postData) => {
        const res = await api.put(`/posts/${id}`, postData);
        if (res.data.success) {
            setPosts(prev => prev.map(p => p._id === id ? { ...p, ...postData } : p));
            return res.data;
        }
    };

    const deletePost = async (id) => {
        const res = await api.delete(`/posts/${id}`);
        if (res.data.success) {
            setPosts(prev => prev.filter(p => p._id !== id));
        }
    };

    const likePost = async (id) => {
        const res = await api.post(`/posts/${id}/like`);
        if (res.data.success) {
            setPosts(prev => prev.map(p => {
                if (p._id === id) {
                    const liked = res.data.liked;
                    return {
                        ...p,
                        likes: liked ? [...p.likes, 'placeholder'] : p.likes.slice(0, p.likes.length - 1)
                    };
                }
                return p;
            }));
            return res.data;
        }
    };

    const addComment = async (postId, text) => {
        const res = await api.post(`/posts/${postId}/comments`, { text });
        if (res.data.success) {
            setPosts(prev => prev.map(p => {
                if (p._id === postId) {
                    return { ...p, comments: [...p.comments, res.data.comment] };
                }
                return p;
            }));
        }
        return res.data;
    };

    const editComment = async (commentId, text) => {
        const res = await api.put(`/comments/${commentId}`, { text });
        if (res.data.success) {
            setPosts(prev => prev.map(p => {
                const hasComment = p.comments.some(c => c._id === commentId);
                if (hasComment) {
                    return {
                        ...p,
                        comments: p.comments.map(c => c._id === commentId ? { ...c, text } : c)
                    };
                }
                return p;
            }));
        }
        return res.data;
    };

    const deleteComment = async (postId, commentId) => {
        const res = await api.delete(`/comments/${commentId}`);
        if (res.data.success) {
            setPosts(prev => prev.map(p => {
                if (p._id === postId) {
                    return { ...p, comments: p.comments.filter(c => c._id !== commentId) };
                }
                return p;
            }));
        }
    };

    return (
        <PostContext.Provider value={{
            posts, loading, error, page, hasMore,
            fetchPosts, createPost, updatePost, deletePost, likePost, addComment, editComment, deleteComment
        }}>
            {children}
        </PostContext.Provider>
    );
};
