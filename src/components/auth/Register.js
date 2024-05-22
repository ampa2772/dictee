import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../features/auth/authThunks';
import { setDisplayState } from '../../features/display/displaySlice';


const Register = (props) => {
  const fields = [
    { label: 'Prénom', name: 'firstName', type: 'text', value: "Marc" },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Mot de passe', name: 'password', type: 'password' },
   
  ];

  const dispatch = useDispatch();

  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleLogin = () => {
    dispatch(setDisplayState({ displayKey: 'loginDisplay', value: true }));
  };



  const onSubmit = async (e) => {
    e.preventDefault();
  
    dispatch(register(formData))
      .unwrap()
      .then((response) => {
        console.log("Navigation possible:", response);
        dispatch(setDisplayState({ displayKey: 'WarningEmailConfirmationDisplay', value: true }));
      })
      .catch((error) => {
        console.error("Échec de l'enregistrement:", error);
      });
  };
  
  

  const error = useSelector((state) => state.auth.error);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="form-container">
          <div className="form-wrapper">
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={onSubmit}>
              {fields.map((field) => (
                <div key={field.name}>
          
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={onChange}
                      required
                      placeholder={field.label}
                    />
                 
                </div>
              ))}
              <button type="submit">S'inscrire</button>
            </form>
            <button className="switch-button" onClick={toggleLogin}>Revenir à se connecter</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
