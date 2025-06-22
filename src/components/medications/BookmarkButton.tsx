
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkMinus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BookmarkButtonProps {
  medicationId: string;
  medicationName: string;
}

export const BookmarkButton = ({ medicationId, medicationName }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Check if medication is bookmarked on component mount
  useEffect(() => {
    if (user) {
      checkIfBookmarked();
    }
  }, [user, medicationId]);

  const checkIfBookmarked = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('medication_id', medicationId)
        .single();

      if (data) {
        setIsBookmarked(true);
      }
    } catch (error) {
      // No bookmark found, which is fine
      setIsBookmarked(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark medications",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('medication_id', medicationId);

        if (error) throw error;

        setIsBookmarked(false);
        toast({
          title: "Bookmark Removed",
          description: `${medicationName} removed from your favorites`,
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            medication_id: medicationId,
          });

        if (error) throw error;

        setIsBookmarked(true);
        toast({
          title: "Bookmark Added",
          description: `${medicationName} added to your favorites`,
        });
      }
    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
