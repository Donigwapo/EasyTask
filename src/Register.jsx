import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  useEffect(() => {
    const handleRegister = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/sign_up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: {
              email,
              password,
              password_confirmation: passwordConfirmation,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to register user');
        }

        const responseData = await response.json();
        Swal.fire('Success!', responseData.message, 'success');
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    };

    Swal.fire({
      title: 'Registration Form',
      html: `
        <form id="registration-form">
          <label>
            Email:
            <input type="email" value="${email}" id="email-input" class="swal2-input"/>
          </label>
          <label>
            Password:
            <input type="password" value="${password}" id="password-input" class="swal2-input"/>
          </label>
          <label>
            Confirm Password:
            <input type="password" value="${passwordConfirmation}" id="password-confirmation-input" class="swal2-input"/>
          </label>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Register',
      preConfirm: () => {
        const emailInput = document.getElementById('email-input');
        const passwordInput = document.getElementById('password-input');
        const passwordConfirmationInput = document.getElementById('password-confirmation-input');

        setEmail(emailInput.value);
        setPassword(passwordInput.value);
        setPasswordConfirmation(passwordConfirmationInput.value);

        return handleRegister();
      },
    });
  }, []);

  return null; // This component doesn't render anything itself
}

export default Register;
