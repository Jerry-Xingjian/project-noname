import React from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginTable from '../../components/LoginTable/LoginTable';

function Login() {
  return (
    <div className="background">
      <LoginTable />
    </div>
  );
}

export default Login;
