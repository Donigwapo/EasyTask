import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './context/AuthContext';
import Swal from 'sweetalert2';

const Login = () => {
  const { isLoggedIn, loginWithFormValues, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleLogin = async () => {
    setIsLoading(true); // Set loading state to true when login process starts
    const { value: formValues } = await Swal.fire({
      title: 'Login',
      html: `
      <input id="swal-input1" class="swal2-input" placeholder="Email" >
      <input id="swal-input2" class="swal2-input" placeholder="Password" >
      `,
      confirmButtonText: 'Login',
      preConfirm: () => {
        const email = Swal.getPopup().querySelector('#swal-input1').value;
        const password = Swal.getPopup().querySelector('#swal-input2').value;
        if (!email || !password) {
          Swal.showValidationMessage('Please enter email and password');
        }
        return { email, password };
      }
    });

    if (formValues) {
      const { email, password } = formValues;
      // Set loading state to false after the login process is complete
      loginWithFormValues(email, password)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false); // Set loading state to false if login form is cancelled
    }
  };

  return (
    <>
      <div className="top_right">
        {isLoggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        )}
      </div>
    </>
  );
};

export default Login;
