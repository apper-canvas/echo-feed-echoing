import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { commentService } from "@/services/api/commentService";
import { postService } from "@/services/api/postService";
import ApperIcon from "@/components/ApperIcon";
import CommentItem from "@/components/molecules/CommentItem";
import CommentForm from "@/components/molecules/CommentForm";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";
const PostCard = ({ post, className }) => {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

const handleLike = async () => {
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      if (isLiked) {
        await postService.unlikePost(post.Id);
        toast.success('Post unliked');
      } else {
        await postService.likePost(post.Id);
        toast.success('Post liked!');
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error('Failed to update like status');
    }
  };

const loadComments = async () => {
    if (commentsLoading) return;
    
    setCommentsLoading(true);
    try {
      const postComments = await commentService.getByPostId(post.Id);
      setComments(postComments);
      setCommentCount(postComments.length);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleComments = async () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);
    
    if (newShowComments && comments.length === 0) {
      await loadComments();
    }
  };

  const handleCommentAdded = async () => {
    await loadComments();
    if (!showComments) {
      setShowComments(true);
    }
    toast.success("Comment added successfully!");
  };

  const handleAddCommentClick = async () => {
    const newShowForm = !showCommentForm;
    setShowCommentForm(newShowForm);
    
    if (newShowForm && !showComments) {
      setShowComments(true);
      if (comments.length === 0) {
        await loadComments();
      }
    }
  };

  // Load initial comment count
  useEffect(() => {
    const loadCommentCount = async () => {
      try {
        const postComments = await commentService.getByPostId(post.Id);
        setCommentCount(postComments.length);
      } catch (error) {
        console.error("Error loading comment count:", error);
      }
    };
    
    loadCommentCount();
  }, [post.Id]);
return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group animate-slide-down shadow-md",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-blue-600/20 transition-all duration-200">
            <ApperIcon name="User" className="w-6 h-6 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors duration-200">
              {post.author}
            </h4>
            <div className="flex items-center gap-1 text-sm text-secondary bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors duration-200">
              <ApperIcon name="Clock" size={12} />
              {timeAgo}
            </div>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {post.content}
            </p>
          </div>
        </div>
      </div>
      
<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleComments}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="MessageSquare" size={12} />
            <span>
              {commentCount > 0 ? `${commentCount} ${commentCount === 1 ? 'comment' : 'comments'}` : 'Comments'}
            </span>
          </button>
          
          <button
            onClick={handleAddCommentClick}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="Plus" size={12} />
            <span>Add comment</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>Post #{post.Id}</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors duration-200">
            <ApperIcon name="Share2" size={16} />
          </button>
        </div>
      </div>

{/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-4 space-y-4 animate-slide-down">
          {!showCommentForm && (
            <div className="flex justify-center">
              <button
                onClick={handleAddCommentClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <ApperIcon name="Plus" size={14} />
                Add Comment
              </button>
            </div>
          )}
          
          {showCommentForm && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <CommentForm
                postId={post.Id}
                onCommentAdded={handleCommentAdded}
                onCancel={() => setShowCommentForm(false)}
              />
            </div>
          )}
          
          {commentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                Loading comments...
              </div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.Id}
                  comment={comment}
                  onCommentAdded={handleCommentAdded}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="MessageSquare" size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}
      
      {/* Like Section */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95",
              isLiked 
                ? "text-red-500 bg-red-50 hover:bg-red-100" 
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            )}
          >
            <ApperIcon 
              name={isLiked ? "Heart" : "Heart"} 
              size={16} 
              className={cn(
                "transition-all duration-200",
                isLiked ? "fill-current" : ""
              )} 
            />
            <span className="text-sm font-medium transition-colors duration-200">
{likeCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;