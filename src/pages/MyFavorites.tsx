
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MedicationCard } from '@/components/medications/MedicationCard';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';

const MyFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favoriteMedications, isLoading } = useFavorites();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl w-fit mx-auto mb-6">
              <Heart className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">My Favorites</h1>
            <p className="text-gray-600 mb-6">Sign in to view your bookmarked medications</p>
            <Button onClick={() => navigate('/auth')} size="lg" className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/medications')}
            className="min-h-[44px] min-w-[44px] hover:bg-white/50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              My Favorites
            </h1>
            <p className="text-gray-600 mt-2">
              Your bookmarked medications for quick access
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <div className="h-48 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        ) : favoriteMedications.length > 0 ? (
          <>
            <div className="mb-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 w-fit">
              {favoriteMedications.length} bookmarked medication{favoriteMedications.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteMedications.map((medication) => (
                <MedicationCard key={medication.id} medication={medication} />
              ))}
            </div>
          </>
        ) : (
          <Card className="text-center py-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl w-fit mx-auto mb-6">
                <Heart className="h-16 w-16 text-primary" />
              </div>
              <p className="text-gray-500 mb-4 text-lg">No favorite medications yet.</p>
              <p className="text-gray-400 text-sm mb-6">
                Bookmark medications to access them quickly here.
              </p>
              <Button onClick={() => navigate('/medications')} size="lg" className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Browse Medications
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
