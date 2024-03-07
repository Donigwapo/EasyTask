// Login.js
import React, { useContext, useEffect } from 'react';
import AuthContext from './context/AuthContext';
import Swal from 'sweetalert2';

const Login = () => {
  const { isLoggedIn, loginWithFormValues, logout } = useContext(AuthContext);

  const handleLogin = async () => {
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
      loginWithFormValues(email, password);
    }
  };


  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     handleLogin();
  //   }
  // }, [isLoggedIn]);
  return (
    <>
      <div className="top_right">
        {isLoggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
          
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
    </>
  );
};

export default Login;
