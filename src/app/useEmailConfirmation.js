import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { verifyEmailToken } from './emailActions';
import { setEmailConfirmed } from '../features/auth/authSlice';

const useEmailConfirmation = (token) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook pour naviguer

  useEffect(() => {
    const verifyTokenAndFetchUser = () => {
      dispatch(verifyEmailToken(token))
        .then(result => {
          console.log(result);
          if (result.isValid) {
            dispatch(setEmailConfirmed(result.user));
            navigate('/'); // Redirection vers la racine après la confirmation
          } else {
            console.error("Le token n'est pas valide");
          }
        })
        .catch(err => {
          console.error("Erreur lors de la vérification du token:", err);
        });
    };

    if (token) {
      verifyTokenAndFetchUser();
    }
  }, [dispatch, token, navigate]); // Ajoutez `navigate` comme dépendance

  // Aucune valeur de retour n'est nécessaire pour un hook personnalisé s'il n'y a pas de données à retourner
};

export default useEmailConfirmation;







