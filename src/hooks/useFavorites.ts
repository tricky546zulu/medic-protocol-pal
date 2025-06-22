
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favoritesService';
import { queryKeys } from '@/config/queryKeys';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { QUERY_STALE_TIME } from '@/constants/appConstants';

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: queryKeys.favorites.byUser(user?.id || ''),
    queryFn: () => favoritesService.getUserFavorites(user!.id),
    enabled: !!user,
    staleTime: QUERY_STALE_TIME.USER_DATA,
  });

  const favoriteMedicationsQuery = useQuery({
    queryKey: ['favorite-medications', user?.id],
    queryFn: () => favoritesService.getFavoriteMedications(user!.id),
    enabled: !!user,
    staleTime: QUERY_STALE_TIME.USER_DATA,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: ({ medicationId, medicationName }: { medicationId: string; medicationName: string }) => {
      if (!user) throw new Error('User not authenticated');
      return favoritesService.addFavorite(user.id, medicationId);
    },
    onSuccess: (_, { medicationName }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.byUser(user!.id) });
      queryClient.invalidateQueries({ queryKey: ['favorite-medications', user!.id] });
      toast({
        title: "Bookmark Added",
        description: `${medicationName} added to your favorites`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add bookmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: ({ medicationId, medicationName }: { medicationId: string; medicationName: string }) => {
      if (!user) throw new Error('User not authenticated');
      return favoritesService.removeFavorite(user.id, medicationId);
    },
    onSuccess: (_, { medicationName }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.byUser(user!.id) });
      queryClient.invalidateQueries({ queryKey: ['favorite-medications', user!.id] });
      toast({
        title: "Bookmark Removed",
        description: `${medicationName} removed from your favorites`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove bookmark. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    userFavorites: favoritesQuery.data || [],
    favoriteMedications: favoriteMedicationsQuery.data || [],
    isLoading: favoritesQuery.isLoading || favoriteMedicationsQuery.isLoading,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isAddingFavorite: addFavoriteMutation.isPending,
    isRemovingFavorite: removeFavoriteMutation.isPending,
  };
};
