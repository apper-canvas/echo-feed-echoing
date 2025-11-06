import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PostCard = ({ post, className }) => {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

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
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <ApperIcon name="MessageSquare" size={12} />
          <span>Post #{post.Id}</span>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200">
            <ApperIcon name="Heart" size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors duration-200">
            <ApperIcon name="Share2" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;