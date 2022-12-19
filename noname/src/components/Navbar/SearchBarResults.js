/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import './SearchBarResults.css';

function SearchBarResults(props) {
  const { searchResults, showList } = props;
  // const redirectToProfile = () => {
  //   console.log('clicked');
  //   redirect('/login');
  // };
  return (
    <div className={`search-bar-results w-100 d-flex justify-content-center ${searchResults.length === 0 ? 'd-none' : ''}`}>
      <ul className="list-group w-25">
        {
          searchResults.length > 0 ? (
            searchResults.map((item) => (
              <Link key={item._id} className="text-decoration-none" to={`/profile/${item._id}`}>
                <li className="list-group-item user-result-li">
                  <div className="d-flex">
                    <img
                      className="avatar-image ms-3 my-2"
                      src={item.profilePicture}
                      alt="Avatar"
                      mode="aspectFit"
                    />
                    <h6 className="m-0 username">{item.username}</h6>
                  </div>
                </li>
              </Link>
            ))
          ) : (
            <li className={`list-group-item user-result-li ${showList ? '' : 'd-none'}`}>
              <div className="d-flex">
                <h6 className="m-0 username">No results found</h6>
              </div>
            </li>
          )
        }
      </ul>
    </div>
  );
}

export default SearchBarResults;
