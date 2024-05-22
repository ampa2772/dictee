import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from '../auth/Login';
// Supposant que setDisplayState pourrait encore être nécessaire pour d'autres affichages
import { setDisplayState } from '../../features/display/displaySlice';
import Register from '../auth/Register'; // Importer le composant Register

function EntryPage() {
  const dispatch = useDispatch();

  const { loginDisplay, registerDisplay } = useSelector((state) => state.display);
  
  // La fonction handleTitleClick pourrait être utilisée pour d'autres interactions si nécessaire
  const handleTitleClick = () => {
    // Action possible ou autre logique
    dispatch(setDisplayState({ displayKey: 'indexPageDisplay', value: true }));
  };

  // Afficher toujours le composant Login, sans tenir compte de l'état de l'affichage
  return (
    <div className="indexPage">  
      <div className="titre" onClick={handleTitleClick}>
        MagicScrib
      </div>
      {loginDisplay && <Login /> } 
      {registerDisplay && <Register />}
    </div>
  );
}

export default EntryPage;

