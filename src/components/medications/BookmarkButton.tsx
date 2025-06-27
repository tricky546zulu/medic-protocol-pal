
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkMinus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';

interface BookmarkButtonProps {
  medicationId: string;
  medicationName: string;
}

export const BookmarkButton = ({ medicationId, medicationName }: BookmarkButtonProps) => {
  const { user } = useAuth();
  const { userFavorites, addFavorite, removeFavorite, isAddingFavorite, isRemovingFavorite } = useFavorites();

  const isBookmarked = userFavorites.includes(medicationId);
  const isLoading = isAddingFavorite || isRemovingFavorite;

  const toggleBookmark = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark medications",
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

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      onClick={toggleBookmark}
      disabled={isLoading}
      className="flex items-center gap-2 touch-manipulation min-h-[44px]"
    >
      {isBookmarked ? (
        <BookmarkMinus className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {isLoading ? "..." : isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
};
