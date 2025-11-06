import usersData from '@/services/mockData/users.json';
import { postService } from '@/services/api/postService';

// Create a copy to avoid mutating the original data
let users = [...usersData];

// Simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const userService = {
  async getAll() {
    await delay(150);
    return [...users];
  },

  async getByUsername(username) {
    await delay(200);
    const user = users.find(u => u.username === username);
    if (!user) {
      throw new Error(`User with username "${username}" not found`);
    }
    return { ...user };
  },

  async getById(id) {
    await delay(150);
    const user = users.find(u => u.Id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return { ...user };
  },

  async getUserPosts(username) {
    await delay(250);
    const user = users.find(u => u.username === username);
    if (!user) {
      throw new Error(`User with username "${username}" not found`);
    }
    
    // Get all posts and filter by author username
    const allPosts = await postService.getAll();
    const userPosts = allPosts.filter(post => post.author === username);
    
    return userPosts;
  },

  async getUserPostCount(username) {
    await delay(100);
    const user = users.find(u => u.username === username);
    if (!user) {
      return 0;
    }
    
    // Get all posts and count user's posts
    const allPosts = await postService.getAll();
    const userPostCount = allPosts.filter(post => post.author === username).length;
    
    return userPostCount;
  },

  // Helper method to check if username exists
  async usernameExists(username) {
    await delay(100);
    return users.some(u => u.username === username);
  }
};