import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authThunks'; // Assurez-vous que ce chemin est correct
import { setDisplayState } from '../../features/display/displaySlice';

const Login = (props) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error); // Assurez-vous que 'state.auth' est le bon chemin

  const initialState = {
    email: '',
    password: '',
  };

  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ ...formData, rememberMe })).unwrap();
      // La logique après la connexion réussie peut aller ici si nécessaire
    } catch (dispatchError) {
      // Gestion des erreurs ici
      console.error('Échec de la connexion :', dispatchError);
    }
  };

  const toggleRegister = () => {
    dispatch(setDisplayState({ displayKey: 'registerDisplay', value: true }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
      {error && <div className="login-error">{error}</div>}
        <form onSubmit={onSubmit} className='formLogin'>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              placeholder="Email"
              className='input-Login'
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              placeholder="Mot de passe"
              className='input-Login'
            />
          </div>
          <div className="options-wrapper">
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='checkBox-Input-login'
                id="rememberMe"
              />
              <label htmlFor="rememberMe" className='remember-link'>
                Se souvenir de moi
              </label>
            </div>
            <div className="reset-password-container">
              <a href="/reset-password" className="reset-password-link">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Se connecter
          </button>
        </form>
        <button className="switch-button" onClick={toggleRegister}>
        Créer nouveau compte
      </button>
      </div>
      
    </div>
  );
};

export default Login;
