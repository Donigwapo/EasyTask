import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Register() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [passwordConfirmation, setPasswordConfirmation] = useState('');

  useEffect(() => {
    Swal.fire({
      title: 'Registration Form',
      html: `
        <form id="registration-form">
          <label>
            Email:
            <input type="email" id="email-input" class="swal2-input"/>
          </label>
          <label>
            Password:
            <input type="password" id="password-input" class="swal2-input"/>
          </label>
          <label>
            Confirm Password:
            <input type="password" id="password-confirmation-input" class="swal2-input"/>
          </label>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Register',
      preConfirm: async () => {
        const emailInput = document.getElementById('email-input').value;
        const passwordInput = document.getElementById('password-input').value;
        const passwordConfirmationInput = document.getElementById('password-confirmation-input').value;

        try {
          const response = await fetch('https://task-list-db.onrender.com/api/v1/sign_up', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: {
                email: emailInput,
                password: passwordInput,
                password_confirmation: passwordConfirmationInput,
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
      },
    });
  }, []);

  return null; // This component doesn't render anything itself
}

export default Register;
