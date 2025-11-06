const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-accent/30 rounded-full animate-ping mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Loading Echo Feed</h3>
          <p className="text-sm text-gray-600">Fetching the latest posts...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;