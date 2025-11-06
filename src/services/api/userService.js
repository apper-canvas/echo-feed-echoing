import usersData from '@/services/mockData/users.json';
import followingData from '@/services/mockData/followingRelationships.json';
import { postService } from '@/services/api/postService';

// Create a copy to avoid mutating the original data
let users = [...usersData];
let followingRelationships = [...followingData];

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
      return null;
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
      return [];
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
  },

  // Following system methods
  async follow(followerUsername, followingUsername) {
    await delay(200);
    
    const follower = users.find(u => u.username === followerUsername);
    const following = users.find(u => u.username === followingUsername);
    
    if (!follower || !following) {
      throw new Error('User not found');
    }
    
    if (follower.Id === following.Id) {
      throw new Error('Cannot follow yourself');
    }
    
    // Check if already following
    const existingRelationship = followingRelationships.find(
      rel => rel.followerId === follower.Id && rel.followingId === following.Id
    );
    
    if (existingRelationship) {
      throw new Error('Already following this user');
    }
    
    // Add the relationship
    followingRelationships.push({
      followerId: follower.Id,
      followingId: following.Id
    });
    
    return true;
  },

  async unfollow(followerUsername, followingUsername) {
    await delay(200);
    
    const follower = users.find(u => u.username === followerUsername);
    const following = users.find(u => u.username === followingUsername);
    
    if (!follower || !following) {
      throw new Error('User not found');
    }
    
    // Find and remove the relationship
    const relationshipIndex = followingRelationships.findIndex(
      rel => rel.followerId === follower.Id && rel.followingId === following.Id
    );
    
    if (relationshipIndex === -1) {
      throw new Error('Not following this user');
    }
    
    followingRelationships.splice(relationshipIndex, 1);
    return true;
  },

  async isFollowing(followerUsername, followingUsername) {
    await delay(100);
    
    const follower = users.find(u => u.username === followerUsername);
    const following = users.find(u => u.username === followingUsername);
    
    if (!follower || !following) {
      return false;
    }
    
    return followingRelationships.some(
      rel => rel.followerId === follower.Id && rel.followingId === following.Id
    );
  },

  async getFollowerStats(username) {
    await delay(150);
    
    const user = users.find(u => u.username === username);
    if (!user) {
      return { followers: 0, following: 0 };
    }
    
    const followers = followingRelationships.filter(rel => rel.followingId === user.Id).length;
    const following = followingRelationships.filter(rel => rel.followerId === user.Id).length;
    
    return { followers, following };
  }
};