import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/10 via-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <ApperIcon name="MessageSquareX" className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center animate-bounce">
            <ApperIcon name="X" className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into the digital void. 
              Let's get you back to sharing your thoughts!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="min-w-[140px]"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="min-w-[140px]"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? The feed is always just a click away! 
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;