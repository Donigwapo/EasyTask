import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import Swal from 'sweetalert2';


const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const loginWithFormValues = async (email, password) => {
    try {
      const response = await fetch('https://task-list-db.onrender.com/api/v1/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.user.id);
      //  window.location.reload();
        
      } else {
        console.error('Error:', response.statusText);
        Swal.fire("Login Failed");
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire("An error occurred");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginWithFormValues, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
