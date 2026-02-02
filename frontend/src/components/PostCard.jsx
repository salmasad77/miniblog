import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Clock, User, ArrowRight } from "lucide-react";

export default function PostCard({ post, index = 0 }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-slate-100 dark:border-slate-700"
    >
      <Link to={`/post/${post._id}`} className="block relative h-60 overflow-hidden">
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" /> {/* Placeholder while loading */}
        {post.image ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${post.image}`}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <img
            src={`/images/${post.category?.toLowerCase() || 'general'}.png`}
            onError={(e) => { e.target.src = '/images/general.png'; }}
            alt={post.category}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute top-4 left-4">
           {/* Placeholder category since backend might not send it yet, default to 'General' */}
           <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm uppercase tracking-wider">
             Article
           </span>
        </div>
      </Link>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
           <div className="flex items-center gap-1">
             <User className="w-3 h-3" />
             <span className="font-medium">{post.author?.name || "Anonymous"}</span>
           </div>
           <div className="flex items-center gap-1">
             <Clock className="w-3 h-3" />
             <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
           </div>
        </div>

        <Link to={`/post/${post._id}`} className="block mb-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-6 flex-1">
          {post.content}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <Link 
            to={`/post/${post._id}`}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400">
             <span>{Math.ceil(post.content?.length / 500) || 3} min read</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
