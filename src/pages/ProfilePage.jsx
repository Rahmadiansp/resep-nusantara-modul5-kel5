import { useEffect, useState } from 'react';
import { getUserProfile, getFavoriteRecipes } from '../services/userService';
import recipeService from '../services/recipeService';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    // Ambil data profil user
    const userProfile = getUserProfile();
    setProfile(userProfile);

    // Ambil resep favorit
    async function fetchFavorites() {
      setLoadingFavorites(true);
      const favoriteIds = getFavoriteRecipes();
      // Ambil detail resep favorit
      const promises = favoriteIds.map(async (id) => {
        const result = await recipeService.getRecipeById(id);
        if (result && result.success) {
          return result.data;
        }
        return null;
      });
      const recipes = await Promise.all(promises);
      setFavoriteRecipes(recipes.filter(Boolean));
      setLoadingFavorites(false);
    }
    fetchFavorites();
  }, []);

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Profile Pengguna
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {profile ? (
            <div>
              <div className="flex items-center gap-4 mb-4">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border" />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500">
                    {profile.username ? profile.username[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-xl">{profile.username || 'Pengguna'}</h2>
                  <p className="text-gray-500">{profile.bio || 'Bio belum diisi.'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Memuat data profil...</p>
          )}
        </div>

        {/* Menu Resep Favorit */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resep Favorit Saya</h2>
          {loadingFavorites ? (
            <p>Memuat resep favorit...</p>
          ) : favoriteRecipes.length === 0 ? (
            <p>Belum ada resep favorit.</p>
          ) : (
            <ul className="space-y-4">
              {favoriteRecipes.map(recipe => (
                <li key={recipe.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <img src={recipe.image_url} alt={recipe.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold text-lg">{recipe.name}</h3>
                    <p className="text-gray-500">{recipe.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}