import React from 'react';
import './UserProfile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwtDecode from 'jwt-decode';
import { useParams, Navigate } from 'react-router-dom';
import { localGet } from '../../utils/localStorage';
import UserProfilePage from '../../components/UserProfilePage/UserProfilePage';
import OtherUserProfilePage from '../../components/OtherUserProfilePage/OtherUserProfilePage';

function UserProfile() {
  const { id } = useParams();
  const token = localGet('token');
  let authFlag = false;
  let decoded;
  if (token) {
    authFlag = true;
    decoded = jwtDecode(token);
  }

  if (authFlag === false) {
    return <Navigate replace to="/login" />;
  }
  return (
    <div className="background-white">
      {id === decoded.id
        ? <UserProfilePage userId={id} />
        : <OtherUserProfilePage userId={id} />}
    </div>
  );
}

export default UserProfile;
