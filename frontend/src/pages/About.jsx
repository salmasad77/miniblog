import React from "react";
import { motion } from "framer-motion";
import { Users, Rocket, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4"
          >
            About <span className="text-indigo-600 dark:text-indigo-400">Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            We are a community of passionate writers and readers sharing ideas that matter.
          </motion.p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20 animate-fadeIn">
          <div className="order-2 md:order-1">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
               alt="Team working" 
               className="rounded-2xl shadow-xl w-full object-cover h-[400px]" 
             />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              At Blogify, we believe in the power of storytelling. Our mission is to provide a platform where voices can be heard, ideas can be shared, and knowledge can be accessible to everyone.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              Whether you're a tech enthusiast, a lifestyle guru, or just someone with a story to tell, Blogify is your home.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "Community First", desc: "We build for people, fostering a safe and inclusive environment." },
            { icon: Rocket, title: "Innovation", desc: "Constantly pushing boundaries to bring you the best experience." },
            { icon: Heart, title: "Passion", desc: "We love what we do, and we hope it shows in every pixel." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
