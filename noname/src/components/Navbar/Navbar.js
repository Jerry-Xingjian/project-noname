import React, { useRef, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { localGet } from '../../utils/localStorage';
import { getActivityFeed } from '../../utils/api/activityFeed';
import { logout, searchUserByUsername } from '../../utils/api/user';
import SearchBarResults from './SearchBarResults';
import NewPostPopup from '../NewPostPopup/NewPostPopup';

function Navbar() {
  const token = localGet('token');
  let userId;
  let authFlag = false;
  if (token) {
    authFlag = true;
    const decoded = jwtDecode(token);
    userId = decoded.id;
  } else {
    authFlag = false;
  }
  const [showGlobalNewPostPopup, setShowGlobalNewPostPopup] = useState(false);
  const location = useLocation();
  const hideMenu = useRef(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  hideMenu.current = location.pathname === '/login' || location.pathname === '/register';

  const fetchPostData = async () => {
    await getActivityFeed();
    // setPosts(feed.data);
    // console.log(posts);
  };

  const inputHandler = async (e) => {
    // convert input text to lower case
    const { value } = e.target;
    if (value === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const res = await searchUserByUsername(value);
    setSearchResults(res.data.data);
    setShowResults(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed-top">
      {
          authFlag === true
            ? (
              <div>
                <nav className="navbar navbar-expand-lg bg-dark">
                  <div className="container-fluid navbar-content-padding d-flex justify-content-between">
                    <Link className="navbar-brand" to="/home">
                      <p className="brand-name">NoName</p>
                    </Link>

                    {/* Search bar */}
                    <input className={`form-control me-2 w-25 ${hideMenu.current ? 'd-none' : ''}`} type="search" placeholder="Search" aria-label="Search" onChange={inputHandler} />

                    <div className={`menu-icon d-flex justify-content-around ${hideMenu.current ? 'd-none' : ''}`}>
                      {/* Add route links here on each icon */}
                      <Link className="btn btn-link btn-sm" id="home-page-btn" to="/home">
                        <img src="https://nonome-project-media.s3.amazonaws.com/icons/global.svg" alt="menu" />
                      </Link>
                      <button type="button" className="btn btn-link btn-sm" onClick={() => setShowGlobalNewPostPopup(true)}>
                        <img src="https://nonome-project-media.s3.amazonaws.com/icons/add-square.svg" alt="menu" />
                      </button>
                      <Link className="btn btn-link btn-sm" to={`/profile/${userId}`}>
                        <img src="https://nonome-project-media.s3.amazonaws.com/icons/profile-circle.svg" alt="menu" />
                      </Link>
                      <Link onClick={handleLogout} className="btn btn-link btn-sm" to="/login">
                        <img src="https://nonome-project-media.s3.amazonaws.com/icons/logout.svg" alt="menu" />
                      </Link>
                    </div>
                  </div>
                </nav>
                <SearchBarResults className={`d-flex justify-content-center ${hideMenu.current ? 'd-none' : ''}`} searchResults={searchResults} showList={showResults} />
                <NewPostPopup
                  show={showGlobalNewPostPopup}
                  onHide={() => setShowGlobalNewPostPopup(false)}
                  userId={`${userId}`}
                  fetchPosts={fetchPostData}
                />
              </div>
            )
            : (
              <nav className="navbar navbar-expand-lg bg-dark">
                <div className="container-fluid navbar-content-padding d-flex justify-content-between">
                  <p className="brand-name">NoName</p>
                </div>
              </nav>
            )
      }
    </div>
  );
}

export default Navbar;
