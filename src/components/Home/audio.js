import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function AudioPlayer({ src, dictationId }) {
  const audioRef = useRef(null);
  const [userText, setUserText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [detailedExplanation, setDetailedExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (src && audioRef.current) {
      audioRef.current.load();
    }

    const handleKeyPress = (event) => {
      if (!audioRef.current) return;

      switch (event.keyCode) {
        case 17: // Control key
          event.preventDefault();
          if (audioRef.current.paused) {
            audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
          break;
        case 107: // '+'
          event.preventDefault();
          audioRef.current.playbackRate = Math.min(audioRef.current.playbackRate + 0.1, 2);
          break;
        case 109: // '-'
          event.preventDefault();
          audioRef.current.playbackRate = Math.max(audioRef.current.playbackRate - 0.1, 0.5);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [src]);

  const formatResponseText = (corrections) => {
    const correctionCount = corrections.length;
    console.log(corrections);

    if (correctionCount === 0) {
      return <p style={{ textAlign: 'center' }}>Bravo, vous n'avez fait aucune faute !</p>;
    } else {
      return (
        <div>
          <p>Vous avez fait {correctionCount} faute{correctionCount > 1 ? 's' : ''} :</p>
          <ul>
            {corrections.map((correction, index) => (
              <li key={index}>
                Le mot : <strong>{correction.incorrect}</strong> s'écrit : <strong>{correction.correct}</strong>
                <button
                  onClick={() => correctionD(correction.detailedCorrectionId)}
                  className='btnDetail'
                >
                  Correction détaillée
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  const correctionD = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/api/dictee/detailed-correction`, { id });
      setDetailedExplanation(response.data.explanation);
    } catch (error) {
      console.error('Erreur lors de la récupération de la correction détaillée :', error);
    }
  };

  const handleSubmitText = async () => {
    if (!userText.trim()) {
      alert("Veuillez fournir du texte à analyser.");
      return;
    }

    setLoading(true);
    setUserText('');
    try {
      const userId = user._id;
      const response = await axios.post(`${API_URL}/api/dictee/analyze`, {
        userText,
        dictationId,
        userId
      });

      if (response.data) {
        console.log(response.data);
        setAnalysisResult(formatResponseText(response.data));
      } else {
        alert("La réponse du serveur n'était pas au format attendu.");
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du texte:', error);
      alert("Erreur lors de la soumission du texte: " + error.message);
    }
    setLoading(false);
  };

  // Fonction pour enlever le focus de l'audio dès qu'il l'obtient
  const handleAudioFocus = () => {
    if (audioRef.current) {
      audioRef.current.blur();
    }
  };

  return (
    <>
      {!analysisResult ? (
        <div className='container_audio'>
          <audio ref={audioRef} src={src} controls onFocus={handleAudioFocus} />
          <textarea
            className='text_dictee'
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Écrivez ici ce que vous entendez..."
            spellCheck={false} // Désactiver le correcteur orthographique
          />
          <button
            onClick={handleSubmitText}
            disabled={loading || !userText.trim()}
            className={userText.trim() && !loading ? 'bouton_submit' : ''}
          >
            {loading ? 'Analyse en cours...' : userText.trim() ? 'Soumettre Texte' : 'Aucun texte'}
          </button>
        </div>
      ) : (
        <div className='analysis_result'>
          {analysisResult}
          {detailedExplanation && (
            <div className='detailed_explanation'>
              <p>Correction détaillée :</p>
              <p
              className='detailedExplanation'
              >{detailedExplanation}</p>
            </div>
          )}
          <button
            onClick={() => {
              setAnalysisResult(null);
              setDetailedExplanation('');
            }}
          >
            Retour
          </button>

        </div>
      )}
    </>
  );
}

export default AudioPlayer;
