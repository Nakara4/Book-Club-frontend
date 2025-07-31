import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthContainer = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSwitchToSignup = () => {
    setIsSignup(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignup(false);
  };

  return (
    <div>
      {isSignup ? (
        <Signup onSwitchToLogin={handleSwitchToLogin} />
      ) : (
        <Login onSwitchToSignup={handleSwitchToSignup} />
      )}
    </div>
  );
};

export default AuthContainer;
