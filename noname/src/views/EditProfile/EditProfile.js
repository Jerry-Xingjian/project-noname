import React from 'react';
import './EditProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, Navigate } from 'react-router-dom';
import EditProfilePage from '../../components/EditProfilePage/EditProfilePage';
import { localGet } from '../../utils/localStorage';

function EditProfile() {
  const token = localGet('token');
  let authFlag = false;
  if (token) {
    authFlag = true;
  }
  const { id } = useParams();

  if (authFlag === false) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div className="background-white">
      <EditProfilePage userId={id} />
    </div>
  );
}

export default EditProfile;
