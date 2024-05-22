import axios from "axios";

export const verifyEmailToken = (token) => async (dispatch) => {  
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify-email-token`, config);

    if (res.status === 200) {  
      console.log('Reponse du server', res.data);    
      return { isValid: true, user: res.data.user }; // Assurez-vous que cette réponse est bien formée côté serveur
    } else {
      console.log('Erreur de réponse du serveur:', res.status);
      return { isValid: false, message: 'Erreur de vérification' };
    }
  } catch (err) {
    console.error('Erreur lors de la vérification du token:', err);
    return { isValid: false, message: err.message || 'Erreur interne' };
  }
};



export const loadUser = ({ token }) => async (dispatch, getState) => {

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
     
    });


    console.log(res.data)
   
  } catch (err) {
    
  }
};

