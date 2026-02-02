import { useEffect, useState } from "react";
import { postAPI } from "../api/axios";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedPosts from "../components/FeaturedPosts";
import CategoryList from "../components/CategoryList";
import Newsletter from "../components/Newsletter";



export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await postAPI.getAll({ category });
        setPosts(response.data.data?.posts || response.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading posts..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Hero />
      <FeaturedPosts />
      <CategoryList />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Latest Articles</h2>
          <Link to="/categories" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-4">
              No posts found
            </h2>
            {user ? (
              <p className="text-slate-500">
                <Link to="/create" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                  Write the first post
                </Link>
                {" "}and start the conversation.
              </p>
            ) : (
              <p className="text-slate-500">
                <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                  Sign up
                </Link>{" "}
                to start posting.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}
      </main>

      <Newsletter />
    </div>
  );
}
