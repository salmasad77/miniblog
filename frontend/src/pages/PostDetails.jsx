import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI } from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Trash2, ArrowLeft, Send } from 'lucide-react';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getById(id);
      setPost(response.data.data?.post || response.data);
      setError('');
    } catch (err) {
      setError('Post not found or failed to load.');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      await postAPI.like(id);
      fetchPost();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await postAPI.comment(id, { content: commentText });
      setCommentText('');
      fetchPost();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.deletePost(id);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader size="large" text="Loading post..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4 font-semibold">{error || 'Post not found'}</div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user?._id === post.author?._id;
  const isLiked = post.likes?.includes(user?._id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* content container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="h-64 md:h-96 w-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10"></div>
            <img
              src={post.image ? `${import.meta.env.VITE_API_URL}${post.image}` : `/images/${post.category?.toLowerCase() || 'general'}.png`}
              onError={(e) => { e.target.classList.add('hidden'); }} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-12">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400">
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-semibold">
                  Article
                </span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {post.author?.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{post.author?.name || 'Anonymous'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Author</p>
                  </div>
                </div>
                
                {isAuthor && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
              </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12 text-slate-600 dark:text-slate-300">
              <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 py-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  isLiked
                    ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-semibold">{post.likes?.length || 0} Likes</span>
              </button>
              
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{post.comments?.length || 0} Comments</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8 mt-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Discussion</h3>
              
              {user && (
                <form onSubmit={handleComment} className="mb-8 relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="absolute right-3 bottom-3 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="space-y-6">
                {post.comments?.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold flex-shrink-0">
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {comment.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400 italic">
                    No comments yet. Be the first to start the conversation!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetails;

