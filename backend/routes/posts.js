const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @route   GET /api/posts
router.get('/', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate('author', 'name avatar')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name avatar' }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.json({
            posts,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/posts
router.post('/', protect, async (req, res) => {
    try {
        const { text, image } = req.body;
        const post = await Post.create({
            text,
            image,
            author: req.user.id
        });

        // Populate author
        await post.populate('author', 'name avatar');

        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/posts/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        // Check user
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authorized' });
        }

        post.text = req.body.text || post.text;
        post.image = req.body.image !== undefined ? req.body.image : post.image;

        await post.save();

        res.json({ success: true, message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/posts/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'User not authorized' });
        }

        // Delete all associated comments
        await Comment.deleteMany({ post: post._id });
        await post.deleteOne();

        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/posts/:id/like
router.post('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const likedIndex = post.likes.indexOf(req.user.id);
        let liked = false;

        if (likedIndex !== -1) { // User already liked, so unlike
            post.likes.splice(likedIndex, 1);
        } else { // User hasn't liked, so like
            post.likes.push(req.user.id);
            liked = true;

            // Send Notification if user is not author
            if (post.author.toString() !== req.user.id) {
                const io = req.app.get('io');
                if (io) {
                    io.to(post.author.toString()).emit('notification', {
                        type: 'like',
                        postId: post._id,
                        message: `Someone liked your post.`,
                        createdAt: new Date()
                    });
                }
            }
        }

        await post.save();
        res.json({ success: true, liked, totalLikes: post.likes.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const comment = await Comment.create({
            text: req.body.text,
            author: req.user.id,
            post: post._id
        });

        post.comments.push(comment._id);
        await post.save();

        await comment.populate('author', 'name avatar');

        // Send Notification if user is not author
        if (post.author.toString() !== req.user.id) {
            const io = req.app.get('io');
            if (io) {
                io.to(post.author.toString()).emit('notification', {
                    id: Math.random().toString(36).substring(7),
                    type: 'comment',
                    postId: post._id,
                    message: `${comment.author.name} commented on your post.`,
                    createdAt: new Date()
                });
            }
        }

        res.status(201).json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
