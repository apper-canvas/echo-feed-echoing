import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PostComposer = ({ onPostCreate }) => {
const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const maxLength = 500;
  const warningThreshold = 400; // 80% of max length
  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const showWarning = characterCount >= warningThreshold;

const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedImages.length > 4) {
      toast.error("You can upload up to 4 images per post");
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = {
          id: Date.now() + Math.random(),
          name: file.name,
          data: event.target.result,
          size: file.size
        };
        
        setSelectedImages(prev => [...prev, imageData]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please write something before posting!");
      return;
    }

    if (isOverLimit) {
      toast.error(`Post is too long! Please keep it under ${maxLength} characters.`);
      return;
    }

    if (!author.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onPostCreate({
        content: content.trim(),
        author: author.trim(),
        images: selectedImages.map(img => ({
          id: img.id,
          name: img.name,
          data: img.data
        }))
      });
      
      setContent("");
      setSelectedImages([]);
      toast.success("Your post has been shared! 🎉");
    } catch (error) {
      toast.error(error.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const getCharacterCountClass = () => {
    if (isOverLimit) return "character-counter danger";
    if (showWarning) return "character-counter warning";
    return "character-counter text-gray-500";
  };

  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 shadow-lg",
      isFocused && "shadow-xl border-primary/30 bg-gradient-to-br from-white to-blue-50/30"
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-md">
          <ApperIcon name="PenTool" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Share your thoughts</h3>
          <p className="text-sm text-gray-600">What's on your mind today?</p>
        </div>
      </div>

<form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <Input
            id="author"
            type="text"
            placeholder="Enter your name..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSubmitting}
            className="transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Your Post
          </label>
          <Textarea
            id="content"
            placeholder="Share something interesting, ask a question, or just say hello..."
            value={content}
            onChange={handleContentChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSubmitting}
            rows={4}
            error={isOverLimit}
            className="transition-all duration-200"
          />
          
          <div className="flex items-center justify-between mt-2">
            <div className={getCharacterCountClass()}>
              {characterCount}/{maxLength} characters
            </div>
            {showWarning && (
              <div className="flex items-center gap-1 text-sm">
                <ApperIcon 
                  name={isOverLimit ? "AlertTriangle" : "Info"} 
                  size={14} 
                  className={isOverLimit ? "text-error" : "text-warning"} 
                />
                <span className={isOverLimit ? "text-error font-medium" : "text-warning"}>
                  {isOverLimit ? "Too long!" : "Almost there"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Optional)
          </label>
          
          <div className="space-y-3">
            <div className="relative">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting || selectedImages.length >= 4}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
                ${selectedImages.length >= 4 
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-primary hover:bg-blue-50 cursor-pointer'
                }
              `}>
                <div className="flex flex-col items-center gap-2">
                  <ApperIcon 
                    name="ImagePlus" 
                    size={24} 
                    className={selectedImages.length >= 4 ? "text-gray-400" : "text-gray-600"} 
                  />
                  <div className="text-sm">
                    <span className={selectedImages.length >= 4 ? "text-gray-400" : "text-gray-600"}>
                      {selectedImages.length >= 4 
                        ? "Maximum 4 images reached" 
                        : "Click to upload images or drag and drop"
                      }
                    </span>
                    {selectedImages.length < 4 && (
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.data}
                      alt={image.name}
                      className="w-full h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      disabled={isSubmitting}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                    >
                      <ApperIcon name="X" size={12} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-500">
            <ApperIcon name="Heart" size={12} className="inline mr-1" />
            Share your authentic voice
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim() || !author.trim() || isOverLimit}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostComposer;