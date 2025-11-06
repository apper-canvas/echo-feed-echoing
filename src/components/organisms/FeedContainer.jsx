import { useState, useEffect } from "react";
import { postService } from "@/services/api/postService";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const FeedContainer = ({ refreshTrigger, onCreatePostClick }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const postsData = await postService.getAll();
      setPosts(postsData);
    } catch (err) {
      setError(err.message || "Failed to load posts. Please try again.");
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [refreshTrigger]);

  const handleRetry = () => {
    loadPosts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 border-2 border-accent/30 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  if (posts.length === 0) {
    return <Empty onCreatePost={onCreatePostClick} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Latest Posts</h2>
          <p className="text-sm text-gray-600 mt-1">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} shared
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          Live feed
        </div>
      </div>

      <div className="feed-container space-y-6">
        {posts.map((post, index) => (
          <PostCard 
            key={post.Id} 
            post={post}
            className={`animate-fade-in`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          />
        ))}
      </div>
      
      {posts.length > 5 && (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            You've caught up with all posts! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedContainer;