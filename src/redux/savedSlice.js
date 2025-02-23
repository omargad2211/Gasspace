import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Function to load the Wishlist from LocalStorage
const loadWishlistFromLocalStorage = () => {
  const savedWishlist = localStorage.getItem("Saved");
  return savedWishlist ? JSON.parse(savedWishlist) : [];
};

// Function to save the Wishlist to LocalStorage
const saveWishlistToLocalStorage = (wishlistItems) => {
  localStorage.setItem("Saved", JSON.stringify(wishlistItems));
};

const SavedSlice = createSlice({
  name: "Saved",
  initialState: {
    items: loadWishlistFromLocalStorage(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const {
        id,
        uid,
        photoURL,
        displayName,
        image,
        post,
        timestamp,
        isSelected,
      } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (!existingItem) {
        // Add new item to Wishlist
        state.items.push({
          id,
          uid,
          photoURL,
          displayName,
          image,
          post,
          timestamp,
          isSelected,
        });
        saveWishlistToLocalStorage(state.items);
        // toast.success('Film added to Favorites');
      }
    },
    removeFromWishlist: (state, action) => {
      const { id, subjectID } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.subjectID === subjectID)
      );
      saveWishlistToLocalStorage(state.items);
      // toast.error("Film removed from Favorites");
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToLocalStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  SavedSlice.actions;
export default SavedSlice.reducer;

// Selector to calculate total items in the Wishlist
export const selectTotalItems = (state) => state.saved.items.length;
