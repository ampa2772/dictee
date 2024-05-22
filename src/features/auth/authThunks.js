// features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        formData,
        config
      );
      console.log('réponse', res.data);
      // Ne pas mettre à jour le state ici
      return { email: formData.email }; // Retourne seulement l'email pour utilisation future
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  }
);




export const login = createAsyncThunk(
  'auth/login',
  async (inputData, { rejectWithValue }) => {
    // console.log("API URL:", process.env.REACT_APP_API_URL); // Log l'URL API pour le débogage
    // console.log(inputData);
    const { rememberMe, ...formData } = inputData;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { ...formData, rememberMe },
        config
      );
      if (res.status === 200) {
        console.log(res.data);
        return { token: res.data.token, rememberMe: res.data.rememberMe, user: res.data.user };
      } else {
        return rejectWithValue({ message: res.data.message, status: res.status });
      }
    } catch (err) {
      console.log("Error sending request:", err.message); // Log any error messages
      return rejectWithValue({ message: err.response.data.message, status: err.response.status });
    }
  }
);

