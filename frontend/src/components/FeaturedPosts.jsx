import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { postAPI } from "../api/axios";

// 👉 URL backend (important)
const backendURL = "http://localhost:5000";

export default function FeaturedPosts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await postAPI.getAll();
        const allPosts = response.data || [];

        // ⭐ seulement les posts avec image + tri par likes
        const sorted = allPosts
          .filter(post => post.image)
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 5);

        setFeaturedPosts(sorted);
      } catch (error) {
        console.error("Error fetching featured posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!featuredPosts.length) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPosts]);

  if (loading || featuredPosts.length === 0) return null;

  const currentPost = featuredPosts[currentIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
        Featured Stories
        <span className="h-1 w-20 bg-indigo-500 rounded-full ml-2"></span>
      </h2>

      <div className="relative group rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* ✅ IMAGE CORRIGÉE */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  currentPost.image
                    ? `${backendURL}${currentPost.image}`
                    : "https://images.unsplash.com/photo-1499750310159-5254f2196f40?auto=format&fit=crop&w=2070&q=80"
                })`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold uppercase mb-4"
              >
                {currentPost.category || "General"}
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              >
                {currentPost.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-slate-300 text-lg mb-6 line-clamp-2 md:line-clamp-3"
              >
                {currentPost.content}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to={`/post/${currentPost._id}`}
                  className="inline-flex items-center gap-2 text-white font-semibold hover:text-indigo-300 transition-colors text-lg"
                >
                  Read Article
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % featuredPosts.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 right-8 flex gap-2">
          {featuredPosts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-3 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60 w-3"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
