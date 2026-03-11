import React, { useEffect } from 'react';
import { usePosts } from '../context/PostContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { Loader2, RefreshCw } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Feed = () => {
    const { posts, loading, error, fetchPosts, hasMore, page } = usePosts();
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    useEffect(() => {
        fetchPosts(1, true); // initial fetch
    }, [fetchPosts]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            fetchPosts(page + 1);
        }
    }, [inView, hasMore, loading, page, fetchPosts]);

    return (
        <div className="max-w-xl mx-auto pb-12">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">Home Feed</h1>
                <p className="text-gray-500 text-sm mt-1">See what's happening right now</p>
            </div>

            <CreatePost />

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-6 shadow-sm border border-red-100 flex items-center justify-between">
                    <p>{error}</p>
                    <button
                        onClick={() => fetchPosts(1, true)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Retry
                    </button>
                </div>
            )}

            {loading && posts.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-gray-500 font-medium">Loading feed...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}

                    {posts.length === 0 && !loading && !error && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-900 font-medium text-lg">No posts yet</p>
                            <p className="text-gray-500 mt-1">Be the first to share something!</p>
                        </div>
                    )}

                    {hasMore && (
                        <div ref={ref} className="w-full py-6 flex justify-center items-center">
                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                            <span className="ml-2 text-gray-500 font-medium">Loading more...</span>
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <p className="text-center text-gray-400 py-6 font-medium">✨ You've caught up on everything!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Feed;
