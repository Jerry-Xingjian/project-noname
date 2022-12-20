import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import Alert from 'react-bootstrap/Alert';
import LoginTable from '../../components/LoginTable/LoginTable';

function Login() {
  const [alertInfo, setAlertInfo] = React.useState({ show: false, message: '' });

  return (
    <div className="background login">
      <Alert
        className="login-alert"
        variant="danger"
        show={alertInfo.show}
        onClose={() => setAlertInfo({ show: false, message: '' })}
        dismissible
      >
        {alertInfo.message}
      </Alert>
      <LoginTable showAlert={setAlertInfo} />
    </div>
  );
}

export default Login;
