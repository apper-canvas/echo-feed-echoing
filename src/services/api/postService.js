import postsData from "../mockData/posts.json";

const STORAGE_KEY = "echo_feed_posts";

// Initialize posts from localStorage or use mock data
const initializePosts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing stored posts:", error);
      return [...postsData];
    }
  }
  return [...postsData];
};

let posts = initializePosts();

// Save posts to localStorage
const savePosts = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postService = {
  async getAll() {
    await delay(200);
    // Sort by timestamp in descending order (newest first)
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  },

  async getById(id) {
    await delay(250);
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  },

  async create(postData) {
    await delay(300);
    
    if (!postData.content || postData.content.trim().length === 0) {
      throw new Error("Post content is required");
    }

    if (postData.content.length > 500) {
      throw new Error("Post content must be 500 characters or less");
    }

    const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.Id)) : 0;
    const now = Date.now();
    
const newPost = {
      Id: maxId + 1,
      author: postData.author || "Anonymous",
      content: postData.content.trim(),
      timestamp: now,
      createdAt: new Date(now).toISOString(),
      images: postData.images || [],
      comments: []
    };

    posts.push(newPost);
    savePosts();
    return { ...newPost };
  },

  async update(id, updateData) {
    await delay(350);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Post not found");
    }

    if (updateData.content && updateData.content.length > 500) {
      throw new Error("Post content must be 500 characters or less");
    }

    const updatedPost = {
      ...posts[index],
      ...updateData,
      Id: posts[index].Id // Ensure Id doesn't change
    };

    posts[index] = updatedPost;
    savePosts();
    return { ...updatedPost };
  },

  async delete(id) {
    await delay(250);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Post not found");
    }

    const deletedPost = posts[index];
    posts.splice(index, 1);
savePosts();
    return { ...deletedPost };
  },

  async likePost(id) {
    await delay(200);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Post not found");
    }

    const post = posts[index];
    if (post.isLiked) {
      throw new Error("Post already liked");
    }

    posts[index] = {
      ...post,
      isLiked: true,
      likeCount: (post.likeCount || 0) + 1
    };

    savePosts();
    return { ...posts[index] };
  },

  async unlikePost(id) {
    await delay(200);
    const index = posts.findIndex(p => p.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Post not found");
    }

    const post = posts[index];
    if (!post.isLiked) {
      throw new Error("Post not liked");
    }

    posts[index] = {
      ...post,
      isLiked: false,
      likeCount: Math.max((post.likeCount || 0) - 1, 0)
    };

    savePosts();
    return { ...posts[index] };
  }
};

// Saved Posts Management
const SAVED_POSTS_KEY = "echo_feed_saved_posts";

const getSavedPosts = () => {
  try {
    const saved = localStorage.getItem(SAVED_POSTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved posts:', error);
    return [];
  }
};

const savePost = (postId) => {
  try {
    const savedPosts = getSavedPosts();
    if (!savedPosts.includes(postId)) {
      savedPosts.push(postId);
      localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(savedPosts));
    }
    return true;
  } catch (error) {
    console.error('Error saving post:', error);
    return false;
  }
};

const unsavePost = (postId) => {
  try {
    const savedPosts = getSavedPosts();
    const updatedSaved = savedPosts.filter(id => id !== postId);
    localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(updatedSaved));
    return true;
  } catch (error) {
    console.error('Error unsaving post:', error);
    return false;
  }
};

const isPostSaved = (postId) => {
  const savedPosts = getSavedPosts();
  return savedPosts.includes(postId);
};

const sharePost = async (post) => {
  try {
    const postUrl = `${window.location.origin}/post/${post.Id}`;
    const shareText = `Check out this post by ${post.author}: "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`;
    
    // Try native sharing first (mobile devices)
    if (navigator.share) {
      await navigator.share({
        title: `Post by ${post.author}`,
        text: shareText,
        url: postUrl,
      });
      return { success: true, method: 'native' };
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${shareText}\n\n${postUrl}`);
      return { success: true, method: 'clipboard' };
    }
  } catch (error) {
    console.error('Error sharing post:', error);
    return { success: false, error: error.message };
  }
};

export { postService, getSavedPosts, savePost, unsavePost, isPostSaved, sharePost };