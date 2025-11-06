import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { postService } from "@/services/api/postService";
import { commentService } from "@/services/api/commentService";
import PostComposer from "@/components/molecules/PostComposer";
import FeedContainer from "@/components/organisms/FeedContainer";
import ApperIcon from "@/components/ApperIcon";
const Feed = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const composerRef = useRef(null);

  const handlePostCreate = async (postData) => {
    try {
      await postService.create(postData);
      // Trigger refresh of feed
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error creating post:", error);
      throw error; // Re-throw to let PostComposer handle the error display
    }
  };

  const handleCreatePostClick = () => {
    if (composerRef.current) {
      composerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Zap" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Echo Feed
              </h1>
              <p className="text-sm text-gray-600">Share your voice with the world</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Post Composer */}
        <div ref={composerRef}>
          <PostComposer onPostCreate={handlePostCreate} />
        </div>

        {/* Feed */}
        <div>
          <FeedContainer 
            refreshTrigger={refreshTrigger}
            onCreatePostClick={handleCreatePostClick}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ApperIcon name="Heart" size={14} className="text-red-500" />
            <span>Made with care for meaningful conversations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Feed;