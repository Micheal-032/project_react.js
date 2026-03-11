import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { Image as ImageIcon, Send, X } from 'lucide-react';
import { uploadImage } from '../utils/uploadImage';

const CreatePost = () => {
    const { user } = useAuth();
    const { createPost } = usePosts();

    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && !image.trim() && !imageFile) return;

        setIsLoading(true);
        try {
            let finalImageUrl = image;
            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }
            await createPost({ text, image: finalImageUrl });
            setText('');
            setImage('');
            setImageFile(null);
            setIsExpanded(false);
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to post. If uploading, check console errors.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file)); // use for preview
            setIsExpanded(true);
        }
    };

    const clearImage = () => {
        setImage('');
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="card p-4 sm:p-5 mb-6">
            <div className="flex space-x-4">
                <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-100"
                />
                <div className="flex-grow">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            placeholder="What's on your mind?"
                            className="w-full bg-gray-50 border-none resize-none rounded-xl px-4 py-3 focus:ring-0 text-gray-800 placeholder-gray-500 focus:bg-white focus:shadow-sm transition-all"
                            rows={isExpanded ? 3 : 1}
                        />

                        {(isExpanded || image || imageFile) && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ImageIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={imageFile ? 'Selected File...' : image}
                                            onChange={(e) => {
                                                if (!imageFile) setImage(e.target.value);
                                            }}
                                            disabled={!!imageFile}
                                            placeholder="Image URL or upload"
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                        Upload
                                    </button>
                                </div>

                                {image && (
                                    <div className="mb-3 relative rounded-lg overflow-hidden border border-gray-100 max-h-48 group inline-block">
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsExpanded(false);
                                            clearImage();
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || (!text.trim() && !image.trim() && !imageFile)}
                                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <span>Post</span>
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
