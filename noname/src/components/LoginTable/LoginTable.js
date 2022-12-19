import React from 'react';
import './LoginTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../utils/api/user';
import { localGet, localSet } from '../../utils/localStorage';

function LoginTable() {
  const navigate = useNavigate();
  const MAX_ATTEMPTS = 3;
  const accountLockInfo = localGet('accountInfo') || [{}];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = document.getElementById('floatingInput').value;
    const password = document.getElementById('floatingPassword').value;
    let lockInfo;
    accountLockInfo.forEach((account) => {
      if (account.email === email) {
        lockInfo = account;
      }
    });
    if (lockInfo == null && email !== '') {
      accountLockInfo.push({
        email,
        loginAttempts: 0,
        lockoutTime: null,
      });
      lockInfo = accountLockInfo[accountLockInfo.length - 1];
    }

    // Check if the account is currently locked out
    if (email !== '' && lockInfo.lockoutTime !== null) {
      const timeRemaining = lockInfo.lockoutTime + 60 * 1000 - Date.now();
      if (timeRemaining > 0) {
        localSet('accountInfo', accountLockInfo);
        // eslint-disable-next-line no-alert
        alert(`Your account is locked out for ${Math.ceil(timeRemaining / 1000)} seconds. Please try again later.`);
        return;
      }
      // reset the lockoutTime variable to null to allow the user to try logging in again
      lockInfo.lockoutTime = null;
      lockInfo.loginAttempts = 0;
    }
    // login process
    try {
      await login(email, password);
      const index = accountLockInfo.indexOf(lockInfo);
      accountLockInfo.splice(index, 1);
      localSet('accountInfo', accountLockInfo);
      navigate('/home');
    } catch (err) {
      // if user submit the wrong password
      if (err.message.includes(409)) {
        lockInfo.loginAttempts += 1;
        localSet('accountInfo', accountLockInfo);
        if (lockInfo.loginAttempts > 2) {
          lockInfo.lockoutTime = Date.now();
          // eslint-disable-next-line no-alert, max-len
          alert('You have exceeded the maximum number of login attempts. Your account will be locked out for 1 minute.');
        } else {
          // eslint-disable-next-line no-alert
          alert(`Invalid username or password. You have ${MAX_ATTEMPTS - lockInfo.loginAttempts} attempts remaining.`);
        }
      } else if (err.message.includes(410)) {
        const index = accountLockInfo.indexOf(lockInfo);
        accountLockInfo.splice(index, 1);
        // eslint-disable-next-line no-alert
        alert('This email is not registeed. Check typo or register an account.');
      } else if (err.message.includes(404)) {
        // eslint-disable-next-line no-alert
        alert('Missing email or password');
      }
    }
  };

  // Set an interval to check every 1000 milliseconds (1 second) if the lockout has expired
  setInterval(() => {
  // Retrieve the lock information for the specified account
    let lockInfo;
    try {
      const email = document.getElementById('floatingInput').value;
      lockInfo = accountLockInfo.filter((account) => account.email === email);
    } catch (err) {
      return;
    }

    // Check if the account is currently locked out
    if (lockInfo.length !== 0) {
      if (lockInfo[0].lockoutTime !== null) {
        // If the account is locked out
        const timeRemaining = lockInfo.lockoutTime + 60 * 1000 - Date.now();
        // If the lock has expired
        if (timeRemaining <= 0) {
          lockInfo.lockoutTime = null;
          lockInfo.loginAttempts = 0;
        }
      }
    }
  }, 1000);

  return (
    <div className="container d-flex flex-column w-25 position-absolute top-50 end-0 translate-middle">
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <div className="mb-3">
          <h1 className="text-center">Login</h1>
          <p className="text-center text-black-50">
            Login and Stay connected with
            <br />
            your community
          </p>
        </div>
        <div className="form-floating mb-3">
          <input type="email" className="form-control background-white" id="floatingInput" placeholder="name@example.com" name="email" />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control background-white" id="floatingPassword" placeholder="Password" name="password" />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <button type="submit" className="btn btn-danger text-light mb-3">Login</button>
        {/* <button type="button" className="btn btn-primary text-light mb-3">
        Login with Google</button> */}
      </form>
      <div className="text-center text-black-50 d-flex justify-content-center">
        <p className="my-0 me-1">Need an account?</p>
        <Link className="text-danger" to="/register">
          <p>Register here!</p>
        </Link>
      </div>
    </div>
  );
}

export default LoginTable;
