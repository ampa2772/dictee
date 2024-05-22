import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  indexPageDisplay: true,
  resetPasswordDisplay: false,
  emailSentDisplay: false,
  emailConfirmationDisplay: false,
  loginDisplay: true, // nouvel état pour gérer l'affichage de Login
  registerDisplay: false, // nouvel état pour gérer l'affichage de Register
  WarningEmailConfirmationDisplay: false,
};

const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setDisplayState(state, action) {
      const { displayKey, value } = action.payload;
      state[displayKey] = value;
      // Réinitialiser tous les autres états sauf ceux de la page index si value est true
      if (value && (displayKey === 'loginDisplay' || displayKey === 'registerDisplay')) {
        state.loginDisplay = (displayKey === 'loginDisplay');
        state.registerDisplay = (displayKey === 'registerDisplay');
      } else if (value) {
        Object.keys(state).forEach(key => {
          if (key !== displayKey && !['loginDisplay', 'registerDisplay'].includes(key)) {
            state[key] = false;
          }
        });
      }
    },
  },
});

export const { setDisplayState } = displaySlice.actions;
export default displaySlice.reducer;






