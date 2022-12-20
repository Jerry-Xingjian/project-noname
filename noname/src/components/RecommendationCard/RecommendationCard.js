/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RecommendationCard.css';
import { follow, unfollow } from '../../utils/api/follow';

function RecommendationCard(props) {
  // TODO: `Follow` button on click event, Call API
  const { recommendedInfo, userInfo } = props;
  const [isFollowed, setIsFollowed] = useState(false);

  const handleFollow = async () => {
    await follow(userInfo._id, recommendedInfo._id);
    // TODO: Update Recommendation
    setIsFollowed(true);
    // TODO: Call up an alert `successfully followed`
  };

  const handleUnfollow = async () => {
    // Remove following
    await unfollow(userInfo._id, recommendedInfo._id);
    // TODO: Update recommendations
    // await updateRecommendations(currentUser.current);
    setIsFollowed(false);
    // TODO: Pop up a confirm box
  };

  return (
    <div className="recommendation-card d-flex py-1 px-1 my-1">
      <img
        className="avatar-image ms-3 my-2 mx-2"
        src={recommendedInfo.profilePicture}
        alt="Avatar"
        mode="aspectFit"
      />
      <div className="card-body mx-2" id="direct-profile-page">
        <Link to={`/profile/${recommendedInfo._id}`} className="text-decoration-none" role="presentation">
          <h6 className="card-title mt-1" id="username-id">{ recommendedInfo.username }</h6>
          <div className="card-text"><small className="text-muted d-inline-block text-truncate">{ recommendedInfo.bio }</small></div>
        </Link>
      </div>
      {
        isFollowed ? (
          <button type="button" id="unfollow-btn" className="btn btn-link text-decoration-none text-secondary" onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <button type="button" id="follow-btn" className="btn btn-link text-decoration-none" onClick={handleFollow}>Follow</button>
        )
      }
    </div>
  );
}

export default RecommendationCard;
