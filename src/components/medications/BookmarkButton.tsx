
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkMinus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  medicationId: string;
  medicationName: string;
}

export const BookmarkButton = ({ medicationId, medicationName }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark Removed" : "Bookmark Added",
      description: `${medicationName} ${isBookmarked ? 'removed from' : 'added to'} your favorites`,
    });
  };

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      onClick={toggleBookmark}
      className="flex items-center gap-2"
    >
      {isBookmarked ? (
        <BookmarkMinus className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {isBookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
};
