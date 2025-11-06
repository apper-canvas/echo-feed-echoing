import ApperIcon from "@/components/ApperIcon";

const Empty = ({ onCreatePost }) => {
  return (
    <div className="flex items-center justify-center py-16 px-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ApperIcon name="MessageSquarePlus" className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute top-2 right-2 w-4 h-4 bg-accent rounded-full animate-bounce"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-success rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome to Echo Feed!
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Be the first to share your thoughts and start the conversation. 
            Your voice matters here.
          </p>
        </div>

        {onCreatePost && (
          <button
            onClick={onCreatePost}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 focus-ring transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="PenTool" size={18} />
            Create Your First Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;