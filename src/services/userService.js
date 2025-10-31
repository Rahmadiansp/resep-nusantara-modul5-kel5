const USER_PROFILE_KEY = 'user_profile';
const USER_IDENTIFIER_KEY = 'user_identifier';
const FAVORITE_RECIPES_KEY = 'favorite_recipes';

/**
 * Get or generate user identifier
 */
export const getUserIdentifier = () => {
  let userId = localStorage.getItem(USER_IDENTIFIER_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_IDENTIFIER_KEY, userId);
  }
  return userId;
};

/**
 * Get user profile from localStorage
 */
export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    if (profile) {
      return JSON.parse(profile);
    }
    // Return default profile with user identifier
    return {
      username: 'Pengguna',
      avatar: null,
      bio: '',
      userId: getUserIdentifier()
    };
  } catch (error) {
    return {
      username: 'Pengguna',
      avatar: null,
      bio: '',
      userId: getUserIdentifier()
    };
  }
};

/**
 * Save user profile to localStorage
 */
export const saveUserProfile = (profile) => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Update avatar
 */
export const updateAvatar = (avatarUrl) => {
  try {
    const profile = getUserProfile();
    profile.avatar = avatarUrl;
    return saveUserProfile(profile);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Update username
 */
export const updateUsername = (username) => {
  try {
    const profile = getUserProfile();
    profile.username = username.trim();
    return saveUserProfile(profile);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Update bio
 */
export const updateBio = (bio) => {
  try {
    const profile = getUserProfile();
    profile.bio = bio.trim();
    return saveUserProfile(profile);
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// FAVORITE RECIPE FUNCTIONS

export const getFavoriteRecipes = () => {
  try {
    const data = localStorage.getItem(FAVORITE_RECIPES_KEY);
    if (data) return JSON.parse(data);
    return [];
  } catch {
    return [];
  }
};

export const addFavoriteRecipe = (recipeId) => {
  const favorites = getFavoriteRecipes();
  if (!favorites.includes(recipeId)) {
    favorites.push(recipeId);
    localStorage.setItem(FAVORITE_RECIPES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavoriteRecipe = (recipeId) => {
  let favorites = getFavoriteRecipes();
  favorites = favorites.filter(id => id !== recipeId);
  localStorage.setItem(FAVORITE_RECIPES_KEY, JSON.stringify(favorites));
};

export default {
  getUserIdentifier,
  getUserProfile,
  saveUserProfile,
  updateAvatar,
  updateUsername,
  updateBio,
  getFavoriteRecipes,
  addFavoriteRecipe,
  removeFavoriteRecipe
};