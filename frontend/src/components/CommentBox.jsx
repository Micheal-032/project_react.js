import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { Trash2, Edit2 } from 'lucide-react';
import { DateTime } from 'luxon';

const CommentBox = ({ post }) => {
    const { user } = useAuth();
    const { addComment, deleteComment, editComment } = usePosts();

    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsLoading(true);
        try {
            await addComment(post._id, text);
            setText('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm('Delete this comment?')) {
            try {
                await deleteComment(post._id, commentId);
            } catch (error) {
                console.error('Failed to delete comment:', error);
            }
        }
    };

    const handleEdit = async (commentId) => {
        if (!editText.trim()) return;
        try {
            await editComment(commentId, editText);
            setEditingId(null);
        } catch (error) {
            console.error('Failed to edit comment:', error);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex space-x-3 mb-5">
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-100"
                />
                <div className="flex-grow flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all overflow-hidden pr-1">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-transparent border-none text-sm px-4 py-2 focus:ring-0 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!text.trim() || isLoading}
                        className="text-blue-600 font-medium text-sm px-3 py-1 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Post
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {post.comments?.map(comment => (
                    <div key={comment._id} className="flex space-x-3 group animate-in fade-in duration-300">
                        <img
                            src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.name}&background=random`}
                            alt={comment.author?.name}
                            className="w-8 h-8 rounded-full object-cover mt-0.5"
                        />
                        <div className="flex-grow">
                            {editingId === comment._id ? (
                                <div className="flex flex-col space-y-2 mt-1 max-w-[95%]">
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg text-sm px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                                        autoFocus
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(comment._id)}
                                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 cursor-pointer"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-2 inline-block max-w-[95%]">
                                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-200 mr-2">{comment.author?.name}</span>
                                        <span className="text-gray-800 dark:text-gray-300 text-sm break-words">{comment.text}</span>
                                    </div>
                                    <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500 dark:text-gray-400 pl-2">
                                        <span>{DateTime.fromISO(comment.createdAt).toRelative()}</span>
                                        {user?.id === comment.author?._id && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(comment._id);
                                                        setEditText(comment.text);
                                                    }}
                                                    className="hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center cursor-pointer"
                                                >
                                                    <Edit2 className="w-3 h-3 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {(!post.comments || post.comments.length === 0) && (
                    <p className="text-center text-sm text-gray-500 py-2">No comments yet. Be the first!</p>
                )}
            </div>
        </div>
    );
};

export default CommentBox;
