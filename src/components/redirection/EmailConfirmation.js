import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useEmailConfirmation from '../../app/useEmailConfirmation';

import { useParams } from 'react-router-dom';

const EmailConfirmation = () => {
  const { token } = useParams();
  console.log(token);
  useEmailConfirmation(token);

  return (
    <div>
      <h1>Confirmation de l'e-mail</h1>
      <p>Votre e-mail est en cours de confirmation, veuillez patienter...</p>
    </div>
  );
};


export default EmailConfirmation;






