// User Login, Register, Logout, Get Info
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import data from './index';
import { localSet, localGet, localRemove } from '../localStorage';

// Login
const login = async (email, password) => {
  try {
    const response = await axios.post(`${data.rootTemp}/users/login`, { email, password });
    // store the token
    localSet('token', response.data.token);
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

// Logout
const logout = async () => {
  try {
    localRemove('token');
  } catch (err) {
    throw new Error(err);
  }
};

// Register
const register = async (email, password) => {
  try {
    const response = await axios.post(`${data.rootTemp}/users/register`, { email, password });
    // store the token
    localSet('token', response.data.token);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

// Search user by username
const searchUserByUsername = (username) => axios.get(`${data.rootTemp}/search/users?username=${username}`);

// Get User Info by user id
const getUserByUserId = (userId) => axios.get(`${data.rootTemp}/users/${userId}`);

const getAllUsers = () => axios.get(`${data.rootTemp}/users`);

const getCurrentUserProfile = async () => {
  try {
    const token = localGet('token');
    const decoded = jwtDecode(token);
    const rawUserData = await getUserByUserId(decoded.id);
    return rawUserData;
  } catch (err) {
    throw new Error('err');
  }
};

const updateUserProfile = async (userId, profile, password = null) => {
  const token = localGet('token');
  const {
    username,
    bio,
    email,
    profilePicture,
  } = profile;

  const res = await axios.put(`${data.rootTemp}/profile/${userId}`, {
    bio,
    profilePicture,
    username,
    email,
    token,
    password,
  });
  return res.data;
};

const getUserRecommendations = async (userId) => {
  const res = await axios.get(`${data.rootTemp}/rcmd/${userId}`);
  return res;
};

export {
  login,
  logout,
  register,
  getCurrentUserProfile,
  searchUserByUsername,
  getUserByUserId,
  updateUserProfile,
  getAllUsers,
  getUserRecommendations,
};
