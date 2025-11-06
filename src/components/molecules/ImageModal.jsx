import { useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ImageModal = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onNavigate 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < images.length - 1;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all duration-200"
        >
          <ApperIcon name="X" size={20} />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} of {images.length}
          </div>
        )}

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (canGoBack) onNavigate(currentIndex - 1);
              }}
              disabled={!canGoBack}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                canGoBack
                  ? "bg-black bg-opacity-50 hover:bg-opacity-70 text-white cursor-pointer"
                  : "bg-black bg-opacity-25 text-gray-500 cursor-not-allowed"
              )}
            >
              <ApperIcon name="ChevronLeft" size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (canGoForward) onNavigate(currentIndex + 1);
              }}
              disabled={!canGoForward}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                canGoForward
                  ? "bg-black bg-opacity-50 hover:bg-opacity-70 text-white cursor-pointer"
                  : "bg-black bg-opacity-25 text-gray-500 cursor-not-allowed"
              )}
            >
              <ApperIcon name="ChevronRight" size={24} />
            </button>
          </>
        )}

        {/* Main Image */}
        <div 
          className="relative max-w-full max-h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage.data}
            alt={currentImage.name || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          
          {/* Image Info */}
          {currentImage.name && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
              <p className="text-sm truncate">{currentImage.name}</p>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(index);
                }}
                className={cn(
                  "w-12 h-12 rounded border-2 overflow-hidden transition-all duration-200",
                  index === currentIndex
                    ? "border-white opacity-100"
                    : "border-transparent opacity-60 hover:opacity-80"
                )}
              >
                <img
                  src={image.data}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;