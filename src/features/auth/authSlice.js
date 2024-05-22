import { createSlice } from '@reduxjs/toolkit';
import { register, login } from './authThunks';

// Chargement initial du state depuis localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, token } = action.payload;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    logout(state) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setEmailConfirmed(state, action) {
      const { _id, email, firstName } = action.payload; // Destructuration pour exclure le mot de passe
    
      // Création d'un nouvel objet utilisateur sans le mot de passe
      const user = { _id, email, firstName };
    
      state.isAuthenticated = true;
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user)); // Mettre à jour localStorage avec l'objet modifié
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.email;
        // Ajouter ici la logique pour sauvegarder dans localStorage si nécessaire
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        const { _id, email, firstName } = user; // Assumant que l'API ne renvoie pas le mot de passe
      
        // Créer un nouvel objet utilisateur sans le mot de passe
        const userWithoutPassword = { _id, email, firstName };
      
        state.isAuthenticated = true;
        state.token = token;
        state.user = userWithoutPassword;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword)); // Mettre à jour localStorage
      })      
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setUser, logout, setEmailConfirmed } = authSlice.actions;
export default authSlice.reducer;

