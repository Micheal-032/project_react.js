import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { MessageCircle, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { DateTime } from 'luxon';
import LikeButton from './LikeButton';
import CommentBox from './CommentBox';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const { updatePost, deletePost, likePost } = usePosts();

    const [showComments, setShowComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text);
    const [editImage, setEditImage] = useState(post.image || '');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            setEditText(post.text);
            setEditImage(post.image || '');
        }
    }, [post.text, post.image, isEditing]);

    const isOwner = user?.id === post.author?._id;

    const handleLike = async () => {
        setIsLiking(true);
        try {
            await likePost(post._id);
        } catch (error) {
            console.error('Like failed', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(post._id);
            } catch (error) {
                console.error('Delete failed', error);
            }
        }
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            await updatePost(post._id, { text: editText, image: editImage });
            setIsEditing(false);
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="card mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out dark:bg-gray-800 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 sm:p-5 flex justify-between items-start">
                <div className="flex space-x-3">
                    <img
                        src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}&background=random`}
                        alt={post.author?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900 leading-tight">{post.author?.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{DateTime.fromISO(post.createdAt).toRelative()}</p>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-10 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-150">
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        setIsEditing(true);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Post
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-4 sm:px-5 pb-3">
                {isEditing ? (
                    <div className="space-y-3 mb-3 mt-2">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border-none resize-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-blue-500 outline-none"
                            rows={3}
                        />
                        <input
                            type="text"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                            placeholder="Image URL (optional)"
                            className="input-field bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditText(post.text);
                                    setEditImage(post.image || '');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating || !editText.trim()}
                                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer flex items-center"
                            >
                                {isUpdating ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-[15px] leading-relaxed mb-3">
                            {post.text}
                        </p>

                        {post.image && (
                            <div className="mt-3 -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <img
                                    src={post.image}
                                    alt="Post attachment"
                                    className="w-full max-h-[500px] object-contain"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer Stats & Actions */}
            <div className="px-4 sm:px-5 py-3 border-t border-gray-50 dark:border-gray-700">
                <div className="flex items-center space-x-6">
                    <LikeButton
                        likes={post.likes}
                        currentUserId={user?.id}
                        onLike={handleLike}
                        isLoading={isLiking}
                    />

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center space-x-1.5 transition-colors ${showComments ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                            }`}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium text-sm">{post.comments?.length > 0 ? post.comments.length : 'Comment'}</span>
                    </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                        <CommentBox post={post} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
