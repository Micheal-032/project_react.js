import React from 'react';
import { Heart } from 'lucide-react';

const LikeButton = ({ likes = [], currentUserId, onLike, isLoading }) => {
    // Using a simplified logic: if generic "current_user" is in array, or currentUserId is found
    // For the mock approach we did in backend, we're returning array of IDs
    const isLiked = likes.includes(currentUserId) || likes.includes('current_user') || likes.includes('placeholder');
    const likeCount = likes.length;

    return (
        <button
            onClick={onLike}
            disabled={isLoading}
            className={`flex items-center space-x-1.5 transition-colors ${isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-500 hover:text-red-500'
                }`}
        >
            <Heart
                className={`w-5 h-5 transition-transform ${isLiked ? 'fill-current scale-110' : 'scale-100'} ${isLoading ? 'opacity-50' : ''}`}
            />
            <span className="font-medium text-sm">{likeCount > 0 ? likeCount : 'Like'}</span>
        </button>
    );
};

export default LikeButton;
