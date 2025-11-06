import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import CommentForm from "@/components/molecules/CommentForm";

const CommentItem = ({ comment, onCommentAdded, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true });
  const maxLevel = 3; // Limit nesting depth

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplyAdded = () => {
setShowReplyForm(false);
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex gap-3 group">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <ApperIcon name="User" size={16} className="text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-900">
                {comment.author}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {timeAgo}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.content}
            </p>
          </div>
          
          <div className="mt-2 flex items-center gap-4">
            {level < maxLevel && (
              <button
                onClick={handleReplyClick}
                className="text-xs text-gray-500 hover:text-primary flex items-center gap-1 transition-colors duration-200"
              >
                <ApperIcon name="Reply" size={12} />
                Reply
              </button>
            )}
            
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <ApperIcon name="MessageCircle" size={12} />
              <span>Comment #{comment.Id}</span>
            </div>
          </div>
          
          {showReplyForm && (
            <div className="mt-3 bg-white rounded-lg border border-gray-200 p-3">
              <CommentForm
                postId={comment.postId}
                parentId={comment.Id}
                onCommentAdded={handleReplyAdded}
                onCancel={handleCancelReply}
                placeholder={`Reply to ${comment.author}...`}
              />
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.Id}
                  comment={reply}
                  onCommentAdded={onCommentAdded}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;