// Mock delay function for realistic API behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for comments (will be replaced with database integration)
let comments = [
  {
    Id: 1,
    postId: 1,
    parentId: null,
    author: "Alice Johnson",
    content: "Great post! This really resonates with me.",
    timestamp: Date.now() - 3600000,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    replies: []
  },
  {
    Id: 2,
    postId: 1,
    parentId: 1,
    author: "Bob Smith",
    content: "I completely agree with Alice on this one.",
    timestamp: Date.now() - 1800000,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    replies: []
  },
  {
    Id: 3,
    postId: 2,
    parentId: null,
    author: "Carol Williams",
    content: "Thanks for sharing your perspective!",
    timestamp: Date.now() - 7200000,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    replies: []
  }
];

// Initialize comments from localStorage if available
const initializeComments = () => {
  try {
    const stored = localStorage.getItem('echo-feed-comments');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading comments from localStorage:', error);
  }
  return comments;
};

// Save comments to localStorage
const saveComments = () => {
  try {
    localStorage.setItem('echo-feed-comments', JSON.stringify(comments));
  } catch (error) {
    console.error('Error saving comments to localStorage:', error);
  }
};

// Initialize comments array
comments = initializeComments();

// Helper function to organize comments with replies
const organizeCommentsWithReplies = (postComments) => {
  const commentsMap = new Map();
  const topLevelComments = [];

  // First pass: create map of all comments
  postComments.forEach(comment => {
    commentsMap.set(comment.Id, { ...comment, replies: [] });
  });

  // Second pass: organize parent-child relationships
  postComments.forEach(comment => {
    if (comment.parentId === null) {
      topLevelComments.push(commentsMap.get(comment.Id));
    } else {
      const parent = commentsMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(commentsMap.get(comment.Id));
      }
    }
  });

  return topLevelComments;
};

export const commentService = {
  async getByPostId(postId) {
    await delay(200);
    const postComments = comments
      .filter(c => c.postId === parseInt(postId))
      .sort((a, b) => a.timestamp - b.timestamp); // Oldest first for comments
    
return organizeCommentsWithReplies(postComments);
  },

  async getById(id) {
    await delay(150);
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  },

  async create(commentData) {
    await delay(300);
    
    if (!commentData.content || commentData.content.trim().length === 0) {
      throw new Error("Comment content is required");
    }

    if (commentData.content.length > 280) {
      throw new Error("Comment must be 280 characters or less");
    }

    if (!commentData.postId) {
      throw new Error("Post ID is required");
    }

    const maxId = comments.length > 0 ? Math.max(...comments.map(c => c.Id)) : 0;
    const now = Date.now();
    
    const newComment = {
      Id: maxId + 1,
      postId: parseInt(commentData.postId),
      parentId: commentData.parentId ? parseInt(commentData.parentId) : null,
      author: commentData.author || "Anonymous",
      content: commentData.content.trim(),
      timestamp: now,
      createdAt: new Date(now).toISOString(),
      replies: []
    };

    comments.push(newComment);
    saveComments();
    return { ...newComment };
  },

  async update(id, updateData) {
    await delay(350);
    const index = comments.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Comment not found");
    }

    if (updateData.content && updateData.content.length > 280) {
      throw new Error("Comment must be 280 characters or less");
    }

    const updatedComment = {
      ...comments[index],
      ...updateData,
      Id: comments[index].Id, // Ensure Id doesn't change
      postId: comments[index].postId, // Ensure postId doesn't change
      parentId: comments[index].parentId // Ensure parentId doesn't change
    };

    comments[index] = updatedComment;
    saveComments();
    return { ...updatedComment };
  },

  async delete(id) {
    await delay(250);
    const index = comments.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Comment not found");
    }

    const deletedComment = comments[index];
    
    // Also delete all replies to this comment
    const replyIndexes = comments
      .map((c, i) => ({ comment: c, index: i }))
      .filter(({ comment }) => comment.parentId === parseInt(id))
      .map(({ index }) => index)
      .sort((a, b) => b - a); // Sort in descending order to avoid index shifting

    replyIndexes.forEach(replyIndex => {
      comments.splice(replyIndex, 1);
    });

    comments.splice(index, 1);
    saveComments();
    return { ...deletedComment };
  }
};