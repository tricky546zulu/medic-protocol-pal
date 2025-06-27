
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button'; // Added ButtonProps
import { BookmarkIcon, BookmarkMinusIcon, Loader2Icon } from 'lucide-react'; // Updated Icons
import { toast } from '@/components/ui/use-toast'; // Corrected toast import
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps extends Pick<ButtonProps, 'size'> { // Allow size prop
  medicationId: string;
  medicationName: string;
  showText?: boolean; // Option to show/hide text
}

export const BookmarkButton = ({
  medicationId,
  medicationName,
  size = "sm", // Default size
  showText = true
}: BookmarkButtonProps) => {
  const { user } = useAuth();
  const { userFavorites, addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = useFavorites();

  const isBookmarked = userFavorites.includes(medicationId);
  const isLoading = isAddingFavorite || isRemovingFavorite;

  const toggleBookmark = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent card click-through if nested
    event.preventDefault();

    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to manage your bookmarks.",
        variant: "destructive",
      });
      return;
    }

    if (isBookmarked) {
      removeFavorite({ medicationId, medicationName });
    } else {
      addFavorite({ medicationId, medicationName });
    }
  };

  const IconComponent = isBookmarked ? BookmarkMinusIcon : BookmarkIcon;
  const buttonText = isLoading ? "..." : isBookmarked ? "Bookmarked" : "Bookmark";

  return (
    <Button
      variant={isBookmarked ? "secondary" : "outline"} // Use secondary for bookmarked state for better contrast with primary actions
      size={size}
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        "touch-manipulation transition-colors duration-150",
        showText ? "gap-2" : "", // Only add gap if text is shown
        size === "icon" && "aspect-square", // Ensure icon buttons are square
        isBookmarked && "border-primary/50 text-primary hover:bg-primary/10",
        !isBookmarked && "hover:bg-accent"
      )}
      aria-label={isBookmarked ? `Remove ${medicationName} from bookmarks` : `Add ${medicationName} to bookmarks`}
    >
      {isLoading ? (
        <Loader2Icon className="h-4 w-4 animate-spin" />
      ) : (
        <IconComponent className="h-4 w-4" />
      )}
      {showText && <span>{buttonText}</span>}
    </Button>
  );
};
