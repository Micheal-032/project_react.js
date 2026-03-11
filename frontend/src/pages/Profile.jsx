import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import PostCard from '../components/PostCard';
import { Edit3, Check, X, Camera, MapPin, Calendar, Mail } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { posts } = usePosts();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const userPosts = posts.filter(p => p.author?._id === user?.id || p.author === user?.id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await updateUser(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-12">
            {/* Profile Header Card */}
            <div className="card mb-8">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl opacity-90 relative">
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <span className="text-white text-sm font-medium drop-shadow-md">Cover colors are auto-generated</span>
                        </div>
                    )}
                </div>

                <div className="px-6 pb-6 pt-0">
                    <div className="flex justify-between items-start">
                        <div className="relative -mt-16 sm:-mt-20 group">
                            <img
                                src={isEditing && formData.avatar ? formData.avatar : (user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`)}
                                alt={user?.name}
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white object-cover bg-white shadow-md transition-transform"
                            />
                            {isEditing && (
                                <div className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-700 transition">
                                    <Camera className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 font-medium rounded-full text-sm transition-colors flex items-center"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-2 border border-gray-300 hover:bg-gray-50 rounded-full text-gray-600 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isUpdating}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-sm disabled:opacity-50"
                                    >
                                        {isUpdating ? <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div> : <Check className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isEditing ? (
                        <div className="mt-4">
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <p className="text-gray-500 mt-1 flex items-center text-sm">
                                <Mail className="w-4 h-4 mr-1.5" />
                                {user?.email}
                            </p>

                            {user?.bio && (
                                <p className="text-gray-800 mt-4 leading-relaxed whitespace-pre-wrap">{user?.bio}</p>
                            )}

                            <div className="flex items-center space-x-4 mt-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1.5 font-medium">
                                    <span className="text-gray-900 font-bold">{userPosts.length}</span>
                                    <span>Posts</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1.5" />
                                    Joined simply
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-4 animate-in fade-in duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="input-field resize-none h-24"
                                    placeholder="Tell the world about yourself..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image URL</label>
                                <input
                                    type="text"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    className="input-field"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User's Posts Feed */}
            <div className="mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <span className="border-b-2 border-blue-600 pb-2 inline-block">My Posts</span>
                </h2>
            </div>

            <div className="space-y-6">
                {userPosts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}

                {userPosts.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="text-5xl mb-4">✍️</div>
                        <p className="text-gray-900 font-medium">No posts written yet</p>
                        <p className="text-gray-500 mt-1">Share your thoughts on the home feed!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
