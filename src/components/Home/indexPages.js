import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setDisplayState } from '../../features/display/displaySlice';

import EntryPage from './EntryPage';
import ResetPassword from '../auth/ResetPassword';
import EmailSent from '../redirection/EmailSent';
import EmailConfirmation from '../redirection/EmailConfirmation';
import WarningEmailConfirmation from '../redirection/warningEmailConfirmation';

function IndexPages() {
  const location = useLocation();
  const dispatch = useDispatch();
  const displayState = useSelector(state => state.display);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      dispatch(setDisplayState({ displayKey: 'emailConfirmationDisplay', value: true }));
    }
  }, [location, dispatch]);

  return (
    <>
      {displayState.indexPageDisplay && <EntryPage />}
      {displayState.resetPasswordDisplay && <ResetPassword />}
      {displayState.emailSentDisplay && <EmailSent />}
      {displayState.emailConfirmationDisplay && <EmailConfirmation />}
      {displayState.WarningEmailConfirmationDisplay && <WarningEmailConfirmation />}
    </>
  );
}

export default IndexPages;



