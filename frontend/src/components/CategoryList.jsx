import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  { id: "all", name: "All Posts" },
  { id: "tech", name: "Technology" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "design", name: "Design" },
  { id: "travel", name: "Travel" },
  { id: "health", name: "Health" },
  { id: "business", name: "Business" },
  { id: "culture", name: "Culture" },
];

export default function CategoryList() {
  return (
    <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={cat.id === 'all' ? '/' : `/?category=${cat.name}`}
              className="inline-block"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  index === 0 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                {cat.name}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
