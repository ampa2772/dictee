import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import axios from 'axios';
import AudioPlayer from './audio';
import utilisateur from '../../Images/utilisateur.svg';

function DicteeComposant() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDictations, setShowDictations] = useState(false);
  const [dictations, setDictations] = useState([]);
  const [currentDictationTitle, setCurrentDictationTitle] = useState('');
  const [dictationId, setDictationId] = useState('');

  console.log(dictationId);

  useEffect(() => {
    const savedAudioUrl = localStorage.getItem('audioUrl');
    const savedTitle = localStorage.getItem('dictationTitle');
    const savedDictationId = localStorage.getItem('dictationId'); // Récupérer l'_id
    if (savedAudioUrl) {
      setAudioUrl(savedAudioUrl);
      setCurrentDictationTitle(savedTitle);
      setDictationId(savedDictationId); // Mettre à jour l'_id dans l'état
    }
  }, []);

  const getAudio = async () => {
    setLoading(true);
    localStorage.removeItem('audioUrl');
    localStorage.removeItem('dictationTitle');
    localStorage.removeItem('dictationId');
    setAudioUrl('');
    try {
      const response = await axios.post('http://localhost:5000/api/dictee/synthesize', { user });
      if (response.data) {
        localStorage.setItem('audioUrl', response.data.audioUrl);
        localStorage.setItem('dictationTitle', response.data.title);
        localStorage.setItem('dictationId', response.data.dictationId);
        setAudioUrl(response.data.audioUrl);
        setCurrentDictationTitle(response.data.title);
        setDictationId(response.data.dictationId);
        setShowDictations(false);
        setLoading(false);

        console.log(response.data);
      }
    } catch (error) {
      console.error("Une erreur est survenue lors de la génération de l'audio", error);
    }
  };

  const fetchDictations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dictee/stories/${user._id}`);
      setDictations(response.data);
      setShowDictations(true);
      setCurrentDictationTitle('')
    } catch (error) {
      console.error("Erreur lors de la récupération des dictées :", error);
    }
  };

  const playDictation = async (dictationId, title) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dictee/play/${dictationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Data': JSON.stringify(user)
        }
      });
      if (response.data && response.data.audioUrl) {
        localStorage.setItem('audioUrl', response.data.audioUrl);
        localStorage.setItem('dictationTitle', title);
        localStorage.setItem('dictationId', dictationId); // Sauvegarder l'_id également
        setAudioUrl(response.data.audioUrl);
        setCurrentDictationTitle(title);
        setDictationId(dictationId); // Mettre à jour l'_id dans l'état local
        setShowDictations(false);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture de la dictée :", error);
    }
  };
  

  return (
    <>
      <div className="header">
        {currentDictationTitle ? (
          <div className="dictation-title">{currentDictationTitle}</div>
        ) : (
          <button onClick={getAudio} disabled={loading} className='generateBTN'>
            {loading ? 'Génération en cours...' : 'Nouvelle dictée'}
          </button>
        )}
        <div

          className='User-logo'

          onClick={() => setShowLogout(!showLogout)}>
          <img src={utilisateur} alt="Utilisateur Logo" className="current-user-change-icon" />
        </div>
      </div>
      {showLogout && (
        <div className="menu">
          <div onClick={fetchDictations}>
            Mes dictées
          </div>
          <div onClick={() => dispatch(logout())}>
            Se déconnecter
          </div>
        </div>
      )}
      <div className="container">
        {!loading && !showDictations && audioUrl && (
          <AudioPlayer src={audioUrl} dictationId={dictationId} />
        )}
        {showDictations && (
          <div className="dictations-list">
            {dictations.map((dictation, index) => (
              <div key={index} onClick={() => playDictation(dictation._id, dictation.title)}>{dictation.title}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DicteeComposant;





