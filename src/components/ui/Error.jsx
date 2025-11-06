import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertTriangle" className="w-10 h-10 text-error" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-error rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800">Oops! Something went wrong</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus-ring transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;