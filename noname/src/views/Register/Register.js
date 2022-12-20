import React from 'react';
import './Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import RegisterTable from '../../components/RegisterTable/RegisterTable';

function Register() {
  const [alertInfo, setAlertInfo] = React.useState({ show: false, message: '' });

  return (
    <div className="background register">
      <Alert
        className="register-alert"
        variant="danger"
        show={alertInfo.show}
        onClose={() => setAlertInfo({ show: false, message: '' })}
        dismissible
      >
        {alertInfo.message}
      </Alert>
      <RegisterTable showAlert={setAlertInfo} />
    </div>
  );
}

export default Register;
