import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categoriesAPI } from "../api/axios";
import Loader from "../components/Loader";

// Fallback images if no backend category image
const categoryImages = {
  technology: "/images/technology.png",
  lifestyle: "/images/lifestyle.png",
  design: "/images/design.png",
  travel: "/images/travel.png", // using .png now
  health: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
  business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  culture: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
  general: "/images/general.png"
};

const defaultCategories = [
  { name: "Technology", description: "Latest gadgets, software, and tech trends." },
  { name: "Lifestyle", description: "Tips for a balanced and happy life." },
  { name: "Design", description: "Creative inspiration and design principles." },
  { name: "Travel", description: "Explore the world with our travel guides." },
  { name: "Health", description: "Stay fit, healthy, and mindful." },
  { name: "Business", description: "Insights for entrepreneurs and professionals." },
  { name: "Culture", description: "Art, music, movies, and more." },
  { name: "General", description: "Everything else under the sun." }
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesAPI.getAll();
      // If backend returns empty, use default list mixed with images
      if (res.data.length === 0) {
        setCategories(defaultCategories.map(c => ({ 
            ...c, 
            slug: c.name.toLowerCase(),
            image: categoryImages[c.name.toLowerCase()] || categoryImages.general 
        })));
      } else {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      // Fallback to defaults on error
      setCategories(defaultCategories.map(c => ({ 
          ...c, 
          slug: c.name.toLowerCase(),
          image: categoryImages[c.name.toLowerCase()]
      })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader size="large" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4"
          >
            Explore <span className="text-indigo-600 dark:text-indigo-400">Topics</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Dive into our collection of articles across various categories.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/?category=${cat.name}`}
                className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full border border-slate-100 dark:border-slate-800"
              >
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                   <img 
                     src={cat.image || categoryImages[cat.name.toLowerCase()] || categoryImages.general} 
                     alt={cat.name}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     onError={(e) => { e.target.src = categoryImages.general; }}
                   />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
