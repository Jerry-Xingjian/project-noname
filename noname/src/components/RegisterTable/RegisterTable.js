import React, { useState, useEffect } from 'react';
import './RegisterTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../utils/api/user';

function RegisterTable() {
  const [passwordEqual, setPasswordEqual] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const checkPasswordEqual = () => setPasswordEqual(password === confirmedPassword);

  // Password changes handler
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmedPassword(event.target.value);
  };

  // Check if password and confirmed password are equal
  useEffect(() => {
    checkPasswordEqual();
  }, [password, confirmedPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = document.getElementById('floatingInput').value;
    const { data } = await register(email, password);

    if (data.token) {
      // TODO: Add token to local storage
      // const { token, ...body } = data;
      // setCredentials(body);
      // addLoginToken(token);
      navigate('/home');
    } else {
      // TODO: Show error message
      // console.log('Error: Register failed');
    }
  };

  // Add loading snipper

  return (
    <div className="container d-flex flex-column w-25 position-absolute top-50 end-0 translate-middle">
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <div className="mb-3">
          <h1 className="text-center">Sign In</h1>
          <p className="text-center text-black-50">Start your journey from here</p>
        </div>
        <div className="form-floating mb-3">
          <input type="email" className="form-control background-white" id="floatingInput" placeholder="name@example.com" name="email" />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control background-white" id="floatingPassword" placeholder="Password" name="password" onChange={handlePasswordChange} value={password} />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className={`form-control background-white ${passwordEqual ? '' : 'is-invalid'}`} id="floatingConfirmedPassword" placeholder="Confirm Password" onChange={handleConfirmPasswordChange} value={confirmedPassword} />
          <label htmlFor="floatingPassword">Confirm your password</label>
        </div>
        <button type="submit" className="btn btn-danger text-light mb-3">Sign In</button>
      </form>
      {/* <button type="button" className="btn btn-primary text-light mb-3">
      Sign in with Google</button> */}
      <div className="text-center text-black-50 d-flex justify-content-center">
        <p className="my-0 me-1">Already have an account?</p>
        <Link className="text-danger" to="/login">
          <p>Login here!</p>
        </Link>
      </div>
    </div>
  );
}

export default RegisterTable;
