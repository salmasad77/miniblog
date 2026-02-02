/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./src/models/User.model');
const Post = require('./src/models/Post.model');
const Category = require('./src/models/Category.model');
const connectDB = require('./src/config/db');

// Helper to transform MongoDB Export JSON (Extended JSON) to regular JSON
const transformData = (data) => {
  return data.map(item => {
    const newItem = { ...item };

    // Transform _id
    if (newItem._id && newItem._id.$oid) {
      newItem._id = newItem._id.$oid;
    }

    // Transform date fields
    ['createdAt', 'updatedAt'].forEach(field => {
      if (newItem[field] && newItem[field].$date) {
        newItem[field] = new Date(newItem[field].$date);
      }
    });

    // Transform refs with $oid
    // Author
    if (newItem.author && newItem.author.$oid) {
      newItem.author = newItem.author.$oid;
    }

    // Likes array
    if (newItem.likes && Array.isArray(newItem.likes)) {
      newItem.likes = newItem.likes.map(like => {
        return like.$oid ? like.$oid : like;
      });
    }

    // Comments array
    if (newItem.comments && Array.isArray(newItem.comments)) {
        newItem.comments = newItem.comments.map(comment => {
            const newComment = { ...comment };
            if (newComment._id && newComment._id.$oid) newComment._id = newComment._id.$oid;
            if (newComment.user && newComment.user.$oid) newComment.user = newComment.user.$oid;
            if (newComment.createdAt && newComment.createdAt.$date) newComment.createdAt = new Date(newComment.createdAt.$date);
            if (newComment.updatedAt && newComment.updatedAt.$date) newComment.updatedAt = new Date(newComment.updatedAt.$date);
            return newComment;
        })
    }
    
    // Remove __v if present, or keep it. Mongoose handles it.
    return newItem;
  });
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Reading JSON files...');
    // Paths relative to backend/seed.js (which is where we are running this)
    // The user said the files are in c:\Users\LENOVO\Desktop\blog\posts.json
    // And backend is c:\Users\LENOVO\Desktop\blog\backend
    // So the files are in ../posts.json relative to seed.js?
    // Wait, the USER said: @[posts.json] is c:\Users\LENOVO\Desktop\blog\posts.json
    // The CWD for backend commands is c:\Users\LENOVO\Desktop\blog\backend
    // So ../posts.json is correct.
    
    const usersPath = path.join(__dirname, '../users.json');
    const postsPath = path.join(__dirname, '../posts.json');

    console.log(`Loading users from ${usersPath}`);
    const usersRaw = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    
    console.log(`Loading posts from ${postsPath}`);
    const postsRaw = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

    const users = transformData(usersRaw);
    const posts = transformData(postsRaw);

    console.log('Clearing old data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Category.deleteMany({});

    console.log(`Inserting ${users.length} Users...`);
    await User.insertMany(users);

    console.log(`Inserting ${posts.length} Posts...`);
    await Post.insertMany(posts);

    console.log('Extracting and Inserting Categories...');
    const categoryNames = [...new Set(posts.map(p => p.category))];
    const categories = categoryNames.map(name => ({
        name,
        description: `All about ${name}`,
        slug: name.toLowerCase().split(' ').join('-')
    }));
    
    if (categories.length > 0) {
        await Category.insertMany(categories);
        console.log(`Inserted ${categories.length} Categories.`);
    }

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
