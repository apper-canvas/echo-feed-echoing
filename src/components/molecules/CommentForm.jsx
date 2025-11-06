import { useState } from "react";
import { toast } from "react-toastify";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { commentService } from "@/services/api/commentService";

const CommentForm = ({ postId, parentId = null, onCommentAdded, onCancel, placeholder = "Write a comment..." }) => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!content.trim()) {
      newErrors.content = "Comment content is required";
    } else if (content.length > 280) {
      newErrors.content = "Comment must be 280 characters or less";
    }

    if (!author.trim()) {
      newErrors.author = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await commentService.create({
        postId,
        parentId,
        content: content.trim(),
        author: author.trim()
      });

      toast.success(parentId ? "Reply added successfully!" : "Comment added successfully!");
      
      setContent("");
      setAuthor("");
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error(error.message || "Failed to add comment");
      setErrors({ submit: error.message || "Failed to add comment" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setAuthor("");
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  const remainingChars = 280 - content.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
          <ApperIcon name="User" size={16} className="text-white" />
        </div>
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus-ring focus:border-primary transition-all duration-200"
            disabled={isSubmitting}
          />
          {errors.author && (
            <p className="text-sm text-error">{errors.author}</p>
          )}
          
          <Textarea
            rows={3}
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={errors.content}
            disabled={isSubmitting}
            className="text-sm"
          />
          {errors.content && (
            <p className="text-sm text-error">{errors.content}</p>
          )}
          
          <div className="flex items-center justify-between">
            <div className={`text-xs ${remainingChars < 50 ? remainingChars < 0 ? 'text-error' : 'text-warning' : 'text-gray-500'}`}>
              {remainingChars} characters remaining
            </div>
            
            <div className="flex gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !content.trim() || !author.trim() || remainingChars < 0}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{parentId ? "Replying..." : "Posting..."}</span>
                  </div>
                ) : (
                  parentId ? "Reply" : "Comment"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {errors.submit && (
        <div className="text-sm text-error bg-error/10 border border-error/20 rounded-lg p-3">
          {errors.submit}
        </div>
      )}
    </form>
  );
};

export default CommentForm;