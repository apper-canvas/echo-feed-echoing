import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus-ring focus:border-primary transition-all duration-200 resize-none",
        error && "border-error focus:border-error focus:ring-error",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;